---
title: "Corelight Fleet Manager Deployment"
project: "Corelight"
category: "Engineering Guide"
description: "Deploy Corelight Fleet Manager on Proxmox Virtual Environment."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/FleetManager.md"
---

## Introduction

Corelight Fleet Manager provides centralized management for Corelight sensors, allowing administrators to manage software updates, licensing, and sensor configuration from a single interface.

This guide documents the deployment of Corelight Fleet Manager on Red Hat Enterprise Linux (RHEL) 8.8 running as a virtual machine on Proxmox Virtual Environment (PVE). It also documents deployment issues encountered during testing and the corresponding workarounds.

> **Note:** This guide supplements the official Corelight deployment documentation. If your environment requires an outbound proxy, refer to the **Corelight Proxy Configuration** guide before proceeding.

## Advisory

The deployment workarounds documented later in this guide were developed during testing to resolve startup issues with the `corelight-fleetd` service.

- These changes should **not** be used in production environments.
- For production deployments, work with Corelight Support to identify the underlying cause instead of relying on the documented workarounds.

## Prerequisites

Before beginning the deployment:

- Install Red Hat Enterprise Linux 8.8.
- Configure the required disk partitions.
- Deploy the virtual machine on Proxmox VE.
- If required, configure proxy settings before installing Corelight packages.

## Recommended Disk Layout

The following partition layout was used during testing.

| Mount Point | Size |
|-------------|------|
| `/boot` | 1 GB |
| `/` | 44 GB |
| `swap` | 5 GB |
| `/tmp` | 20 GB |
| `/var` | 80 GB |

Creating the partitions during the operating system installation is significantly easier than resizing them afterward.

## Recommended Proxmox Configuration

### Hardware

- Memory: 32 GiB
- Processors: 4 vCPUs (1 Socket / 4 Cores)
- BIOS: SeaBIOS
- SCSI Controller: VirtIO SCSI Single
- Primary Disk (`scsi0`): 50 GB
- Secondary Disk (`scsi1`): 100 GB
- Network Adapter: VirtIO

### Boot Order

- `scsi0`

## Configure the Corelight Repository

If your deployment requires an enterprise proxy, complete the additional proxy configuration described in the **Corelight Proxy Configuration** guide before continuing.

Download the Corelight repository installation script:

```bash
curl -O https://packages.corelight.com/install/repositories/corelight/stable/script.rpm.sh
```

Modify the script if proxy support is required.

Install the repository:

```bash
chmod +x script.rpm.sh

./script.rpm.sh
```

If required, configure any local Red Hat entitlement repositories to bypass the proxy.

Example:

```bash
subscription-manager repo-override --repo "<repository-name>" --add=proxy:_none_
```

If package dependencies fail to install, install the required packages manually.

Example:

```bash
yum install gpgme yum-utils
```

Continue following the Corelight installation guide.

## Troubleshooting Service Startup

If the `corelight-fleetd` service fails to start after completing the installation, verify the service logs before applying the workaround described below.

During testing, permission-related issues prevented the service from starting successfully.

### Modify Certificate Ownership

```bash
chown root:corelight-fleetd /etc/corelight-fleetd.pem
```

### Modify the Systemd Service

Edit the service definition:

```bash
vim /etc/systemd/system/corelight-fleetd.service
```

Comment out:

```text
User=corelight-fleetd
Group=corelight-fleetd
```

Replace with:

```text
User=root
Group=root
```

### Modify the Startup Script

Edit:

```bash
vim /usr/bin/corelight-fleetd
```

Comment out the section that drops privileges from the `root` user to `corelight-fleetd`.

## Reload Systemd

Reload the service definitions:

```bash
systemctl daemon-reload
```

Restart Docker:

```bash
systemctl restart docker
```

Start the Fleet Manager service:

```bash
systemctl start corelight-fleetd
```

## Verification

Verify that the service is running successfully.

```bash
systemctl status corelight-fleetd
```

Confirm that Fleet Manager is accessible through the web interface and that no service startup errors are reported.
