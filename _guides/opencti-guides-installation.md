---
title: "OpenCTI Installation Guide"
project: "OpenCTI"
category: "Threat Intelligence"
description: "Install and configure OpenCTI for threat intelligence management."
source_url: "https://github.com/PudgyDragon/OpenCTI/blob/main/Guides/installation.md"
---

> **Advisory**
>
> This guide documents a single-node OpenCTI deployment on **Red Hat Enterprise Linux 9** using **Docker Compose**. It is intended for enterprise environments, including those that require outbound HTTP/HTTPS proxy access and internally trusted Certificate Authorities (CAs).
>
> Unless otherwise specified, commands are executed as the `root` user. If you are using a standard administrative account, prepend `sudo` where appropriate.

## Introduction

This guide walks through deploying OpenCTI on Red Hat Enterprise Linux 9. It includes operating system preparation, Docker installation, proxy configuration, trusted certificates, HTTPS configuration, and the initial OpenCTI deployment.

The deployment documented here was developed for a corporate environment where Internet access is restricted through an HTTP/HTTPS proxy. Proxy-related configuration is included throughout the guide because it is often omitted from official installation documentation.

## System Requirements

The recommended hardware requirements below are based on the OpenCTI deployment guidance available at the time this guide was written.

| Component | CPU | Memory | Storage | Disk |
|-----------|---:|------:|---------|------|
| Elasticsearch / OpenSearch | 2 Cores | 8 GB | SSD | 16 GB+ |
| Redis | 1 Core | 1 GB | SSD | 16 GB+ |
| RabbitMQ | 1 Core | 512 MB | Standard | 2 GB+ |
| MinIO | 1 Core | 128 MB | SSD | 16 GB+ |
| OpenCTI Core | 2 Cores | 8 GB | Stateless | N/A |
| Worker | 1 Core | 128 MB | Stateless | N/A |
| Connector | 1 Core | 128 MB | Stateless | N/A |
| XTM Composer | 1 Core | 128 MB | Stateless | N/A |

> **Recommendation:** Configure RAID appropriate for your organization's availability requirements. Hardware RAID or software RAID may be used depending on your storage platform.

## Install Red Hat Enterprise Linux

Install RHEL 9 using the standard installer.

### Enable FIPS During Installation (Optional)

If your organization requires FIPS compliance, edit the boot parameters before installation.

```text
Press e at the GRUB menu
Append:

fips=1

Press Ctrl+X to boot
```

> **Important:** If you intend to apply DISA STIGs, do not select a security profile during installation. Some settings (such as SELinux enforcement changes) may interfere with the application installation process.

### Recommended Partition Layout

| Volume Group | Mount Point |
|--------------|-------------|
| SYSTEM | / |
| SYSTEM | /boot |
| SYSTEM | /boot/efi |
| SYSTEM | /var |
| SYSTEM | /tmp |
| SYSTEM | swap |
| DATA | /home |
| DATA | /opt |
| DATA | /storetmp |
| DATA | /var/log |
| DATA | /var/log/audit |
| DATA | /var/tmp |
| Standard Partition | /recovery |

## Configure Docker

### Configure Proxy Environment

```bash
vim /etc/environment
```

Configure both lowercase and uppercase proxy variables.

```text
http_proxy=http://<proxy-host>:<proxy-port>
https_proxy=http://<proxy-host>:<proxy-port>
no_proxy=localhost,127.0.0.1

HTTP_PROXY=http://<proxy-host>:<proxy-port>
HTTPS_PROXY=http://<proxy-host>:<proxy-port>
NO_PROXY=localhost,127.0.0.1
```

Log out and back in after updating the environment.

### Remove Existing Container Runtime

```bash
dnf remove docker docker-client docker-common docker-engine podman runc
```

### Install Docker

```bash
dnf -y install dnf-plugins-core

dnf config-manager --add-repo \
https://download.docker.com/linux/rhel/docker-ce.repo

dnf update

dnf install docker-ce docker-ce-cli containerd.io \
docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker
```

### Configure Docker Proxy

Create the Docker service override.

```bash
mkdir -p /etc/systemd/system/docker.service.d

vim /etc/systemd/system/docker.service.d/http-proxy.conf
```

```ini
[Service]
Environment="HTTP_PROXY=http://<proxy-host>:<proxy-port>/"
Environment="HTTPS_PROXY=http://<proxy-host>:<proxy-port>/"
Environment="NO_PROXY=localhost,127.0.0.1,172.0.0.0/8"
```

Configure the Docker client.

```bash
mkdir -p ~/.docker
vim ~/.docker/config.json
```

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://<proxy-host>:<proxy-port>",
      "httpsProxy": "http://<proxy-host>:<proxy-port>",
      "noProxy": "localhost,127.0.0.1,172.0.0.0/8"
    }
  }
}
```

> **Note:** OpenCTI containers communicate over Docker networks. Adjust the `NO_PROXY` list as appropriate for your deployment.

Reload Docker.

```bash
systemctl daemon-reload
systemctl restart docker
```

### Configure Trusted Certificates

Copy your organization's CA certificates into the system trust store.

```bash
cp <organization-ca>.pem /etc/pki/ca-trust/source/anchors/

cp <organization-root>.pem \
/etc/pki/ca-trust/source/anchors/

update-ca-trust
```

### Verification

```bash
docker version
docker compose version
systemctl status docker
```

## Install OpenCTI

Install prerequisites.

```bash
dnf install git jq

sysctl -w vm.max_map_count=1048575

echo "vm.max_map_count=1048575" >> /etc/sysctl.conf
```

Create a service account.

```bash
mkdir /opt/OpenCTI

useradd -r -m -d /opt/OpenCTI -s /bin/bash opencti_svc

passwd opencti_svc

usermod -aG docker opencti_svc
```

Clone the deployment repository.

```bash
cd /opt/OpenCTI

git clone https://github.com/OpenCTI-Platform/docker.git

cd docker

cp docker-compose.yml docker-compose.yml.bak
```

## Configure OpenCTI

Edit `docker-compose.yml` to expose HTTPS externally while retaining the internal application port.

```yaml
ports:
  - "443:8080"
```

Generate the `.env` file using the values from your original guide. Replace example values such as:

- `OPENCTI_BASE_URL=https://opencti.example.com`
- `OPENCTI_ADMIN_PASSWORD=<admin-password>`
- `OPENCTI_HOST=opencti.example.com`

Generate UUID values for connector IDs as needed.

Bring the stack up once to initialize configuration.

```bash
docker compose up -d
docker compose down
```

## Configure HTTPS

Create a Docker volume for certificates and update `docker-compose.yml` to reference:

- HTTPS certificate
- HTTPS private key
- Proxy environment variables
- Updated health check

Copy your certificate and key into the Docker volume.

```text
/var/lib/docker/volumes/docker_opencti_https/_data/
```

Example filenames:

```text
opencti.crt
opencti.key
```

> **Note:** If using self-signed or internally issued certificates, the health check may require `wget --no-check-certificate` unless the container trusts the issuing CA.

## Deploy OpenCTI

```bash
docker compose up -d
```

## Optional Configuration

Increase worker replicas if system resources allow.

```yaml
worker:
  deploy:
    replicas: 5
```

## Verification

Verify all containers are healthy.

```bash
docker compose ps
```

Confirm:

- Docker services are running.
- OpenCTI is reachable over HTTPS.
- The health endpoint responds successfully.
- You can authenticate using the administrator account.
- Background workers are processing tasks.

## Additional Resources

- OpenCTI Deployment Documentation
- Docker Engine Documentation
- Docker Compose Documentation
- Red Hat Enterprise Linux Documentation
- OpenCTI Docker Repository
