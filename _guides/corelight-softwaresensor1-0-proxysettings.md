---
title: "Corelight Proxy Configuration"
project: "Corelight"
category: "Engineering Guide"
description: "Configure a Corelight Software Sensor to operate behind an enterprise proxy."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/SoftwareSensor1.0/ProxySettings.md"
---

## Introduction

The Corelight Software Sensor installation guide assumes direct internet connectivity when downloading packages and dependencies. In environments where outbound traffic is routed through an enterprise proxy, additional configuration is required for package managers, Docker, Git, Python, and other installation components.

This guide supplements the official Corelight Software Sensor installation documentation by highlighting the additional proxy configuration required for a successful deployment.

> **Note:** The examples in this guide were validated on **Red Hat Enterprise Linux (RHEL) 8.8**. They are intended to supplement, not replace, the official Corelight installation guide.

## Configure the Corelight Package Repository

### Download the Repository Installation Script

Instead of executing the installation script directly, download it first so it can be modified if necessary.

```bash
curl --proxy http://proxy:port -O https://packages.corelight.com/install/repositories/corelight/stable/script.rpm.sh
```

### Modify the Repository Installation Script

Depending on your environment, you may need to add proxy support to the `curl` command contained within the script.

Edit the script:

```bash
vim script.rpm.sh
```

Modify the repository download command:

```bash
curl --proxy "http://proxy:port" -sSf "${yum_repo_config_url}" > $yum_repo_path
```

### Install Missing Dependencies

If package installation fails because dependencies cannot be downloaded through the proxy, manually install the required repositories and packages.

Example:

```bash
subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms

dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm

yum install gpgme
```

> **Note:** During testing, `gpgme` required manual installation after enabling the EPEL repository.

### Complete the Repository Installation

```bash
chmod +x script.rpm.sh

./script.rpm.sh
```

## Configure YUM for Proxy Access

Edit the YUM configuration:

```bash
vim /etc/yum.conf
```

Example configuration:

```text
proxy=http://proxy:port
no_proxy=*.domain
```

## Configure Suricata Update

Configure the required proxy environment variables before installing `suricata-update`.

```bash
export http_proxy=http://proxy:port
export https_proxy=http://proxy:port

pip3 install --proxy http://proxy:port suricata-update
```

## Configure Docker and Grafana

Add the Docker repository:

```bash
yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
```

Modify the Docker repository if required:

```bash
vim /etc/yum.repos.d/docker-ce.repo
```

Install Docker:

```bash
yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin --allowerasing
```

Configure the Docker service to use the proxy:

```bash
vim /usr/lib/systemd/system/docker.service
```

Add:

```text
Environment="HTTP_PROXY=http://proxy:port"
```

Install Docker Compose:

```bash
pip3 install --proxy http://proxy:port --upgrade --ignore-installed pip setuptools

pip3 install --proxy http://proxy:port docker-compose
```

Configure Git:

```bash
git config --global http.proxy http://proxy:port
```

## Configure Docker Compose

Add proxy environment variables to the `docker-compose.yml` file.

Example:

```yaml
prometheus:
  environment:
    http_proxy: http://proxy:port
    https_proxy: http://proxy:port
    no_proxy: "*.domain"

grafana:
  environment:
    http_proxy: http://proxy:port
    https_proxy: http://proxy:port
    no_proxy: "*.domain"
```

## Configure Docker Client Proxy Settings

Create or edit:

```bash
~/.docker/config.json
```

Example:

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://proxy:port",
      "httpsProxy": "http://proxy:port",
      "noProxy": "*.domain"
    }
  }
}
```

## Configure System-Wide Proxy Variables

Create:

```bash
/etc/profile.d/http_proxy.sh
```

Example:

```bash
export HTTP_PROXY=http://proxy:port
export HTTPS_PROXY=http://proxy:port
export NO_PROXY=*.domain
```

## Known Issues

At the time of testing, Grafana was accessible on TCP port **3000** after applying the proxy configuration. Access to the Corelight service on TCP port **8989** remained under investigation.
