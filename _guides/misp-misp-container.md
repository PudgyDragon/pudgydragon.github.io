---
title: "MISP Container Deployment"
project: "MISP"
category: "Threat Intelligence"
description: "Deploy the Malware Information Sharing Platform (MISP) using Docker containers."
source_url: "https://github.com/PudgyDragon/MISP/blob/main/MISP_Container.md"
---

## Introduction

The official MISP Docker deployment is straightforward in environments with unrestricted internet access. Enterprise environments, however, often require additional configuration for HTTP/HTTPS proxies.

This guide documents the additional steps required to successfully build and deploy the Harvard IT Security Docker image for MISP in a proxied environment.

The deployment documented in this guide was performed on:

- Red Hat Enterprise Linux (RHEL)
- Docker
- Enterprise HTTP/HTTPS proxy
- Repurposed Dell server

## Prerequisites

This guide assumes:

- Docker is already installed and operational.
- Internet access is available through an HTTP/HTTPS proxy.
- Git is installed.

## Clone the Repository

The official MISP Docker project can be found at:

- https://github.com/MISP/docker-misp

This deployment uses the Harvard IT Security implementation:

- https://github.com/harvard-itsecurity/docker-misp

Clone the repository using your proxy configuration.

```bash
cd ~

git clone https://github.com/harvard-itsecurity/docker-misp.git \
  --config "http.proxy=http://<proxyHost>:<proxyPort>"
```

## Configure the Build Script

Navigate to the repository.

```bash
cd docker-misp
```

Edit the build script.

```bash
vi build.sh
```

Update the appropriate values for your environment, including:

- MySQL password
- GPG password
- `MISP_FQDN`

## Configure Docker Proxy Settings

Open the Dockerfile.

```bash
cd container

vi Dockerfile
```

Locate:

```Dockerfile
ENV DEBIAN_PRIORITY critical
```

Immediately below it, add:

```Dockerfile
ENV HTTP_PROXY="http://<proxyHost>:<proxyPort>"
ENV HTTPS_PROXY="http://<proxyHost>:<proxyPort>"
```

## Preserve Proxy Variables During Build

Some installation steps execute with `sudo`. During testing, it was necessary to preserve the proxy environment variables for these commands.

Run:

```bash
sed -i 's/sudo /sudo --preserve-env=HTTP_PROXY,HTTPS_PROXY,http_proxy,https_proxy /g' Dockerfile
```

One occurrence of `sudo` should **not** include the `--preserve-env` option.

Locate:

```Dockerfile
RUN apt-get update && apt-get install -y supervisor ... sudo ...
```

Remove the added `--preserve-env` option from this line only.

> **Note:** This change was required during testing to allow package installation to complete successfully behind an enterprise proxy.

## Build the Image

Return to the project directory.

```bash
cd ..
```

Start the build.

```bash
./build.sh
```

> **Note:** Building the container may take several minutes. Some build steps may appear inactive while packages are downloading or compiling.

## Initialize the Database

Create the database directory.

```bash
mkdir -p /docker/misp-db
```

Initialize the database.

```bash
docker run --rm \
    -v /docker/misp-db:/var/lib/mysql \
    harvarditsecurity/misp \
    /init-db
```

## Start MISP

```bash
docker run -d \
    -p 80:80 \
    -p 443:443 \
    -p 3306:3306 \
    -p 6666:6666 \
    -v /docker/misp-db:/var/lib/mysql \
    harvarditsecurity/misp
```

Browse to the configured `MISP_FQDN`.

Default credentials:

| Username | Password |
|-----------|----------|
| admin@admin.test | admin |

> **Important:** Change the default administrator password immediately after logging in.

## Configure Docker Compose

If MISP will be managed alongside other containers (such as OpenCTI), adding it to an existing Docker Compose deployment simplifies lifecycle management.

Example service definition:

```yaml
misp:
  image: harvarditsecurity/misp
  ports:
    - "80:80"
    - "443:443"
    - "3306:3306"
    - "6666:6666"
  volumes:
    - /docker/misp-db:/var/lib/mysql
  restart: always
```

If the standalone container is already running, stop it before starting Docker Compose.

List running containers.

```bash
docker ps
```

Stop the MISP container.

```bash
docker stop <container-id>
```

Start the Compose stack.

```bash
docker-compose up -d
```

## Verification

Verify the deployment by confirming:

- The MISP login page loads successfully.
- Authentication succeeds using the administrator account.
- Docker reports the container as healthy.
- The database volume persists across container restarts.
- HTTPS is functioning as expected (if configured).

## Known Issues

Additional proxy configuration may be required depending on the environment. Some package managers and utilities may require proxy settings to be configured independently.

This section will be updated as additional proxy-related configurations are identified.

## Additional Resources

- https://github.com/MISP/docker-misp
- https://github.com/harvard-itsecurity/docker-misp
