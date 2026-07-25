---
title: "Deploy IBM QRadar SIEM on Red Hat Enterprise Linux 8 (Current Guide)"
project: "QRadar"
category: "Engineering Guide"
description: "Deploy IBM QRadar SIEM 7.5 on Red Hat Enterprise Linux 8 using enterprise storage layouts for Console, Application Host, Event Processor, Flow Processor, High Availability, and QRadar Network Insights appliances."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Installation2025.md"
---

## Introduction

This guide documents the deployment of IBM QRadar SIEM 7.5 Update Pack 13 on Red Hat Enterprise Linux 8 using a storage layout with dedicated operating system and data volumes.

Unlike the standard IBM installation documentation, this guide consolidates storage planning, partition layouts, and appliance-specific recommendations into a single reference. The procedures are based on IBM guidance while incorporating deployment practices validated during multiple enterprise QRadar deployments.

## Reference Documentation

- IBM: Installing RHEL on Your System
- IBM: Linux Operating System Partition Properties for QRadar Installations

## Requirements

This guide assumes:

- Dedicated SSD storage for the operating system.
- Dedicated NVMe storage for `/store` and `/transient`.
- RAID configured for both operating system and data disks.
- A Minimal RHEL installation.

### Appliance Storage Requirements

| Appliance | `/store` | `/transient` | Recommended RAID |
|-----------|----------|--------------|------------------|
| Console | 80% of remaining data volume | 20% of remaining data volume | RAID 1 (OS), RAID 6 (NVMe) |
| Application Host | 80% of remaining data volume | 20% of remaining data volume | RAID 1 (OS), RAID 6 (NVMe) |
| Event Processor | Remaining capacity | Lesser of 20% or 500 GB | RAID 1 (OS), RAID 6 (NVMe) |
| Flow Processor | Remaining capacity | Lesser of 20% or 500 GB | RAID 1 (OS), RAID 6 (NVMe) |
| High Availability | Match the primary appliance | Match the primary appliance | Match the primary appliance |
| QRadar Network Insights | 100% of data volume | Not used | RAID 1 (OS), RAID 10 (NVMe) |

> **Note:** If your server hardware does not support creating NVMe RAID volumes in firmware, create the RAID volume during the RHEL installation.

## Install Red Hat Enterprise Linux

### Installation Settings

Configure the installer using the following recommendations:

- Installation Type: **Minimal Install**
- Configure IPv4 networking
- Disable IPv6 unless required
- Configure DNS and NTP
- Set the root password
- Create an administrative user
- Disable KDUMP
- Select **Custom** partitioning

> **Important:** A Minimal installation avoids unnecessary packages that can complicate QRadar deployments.

## Configure Storage

During custom partitioning:

1. Select all SSD and NVMe drives.
2. Remove existing partitions.
3. Create the operating system volume group (`rootrhel`) using only SSD drives.
4. Create the data volume group (`storerhel`) using only NVMe drives.
5. Configure the RAID level appropriate for the appliance type.

> **Important:** Whenever changing a mount point from **xfs** to **Standard Partition**, verify that only the operating system SSDs are selected.

## Partition Layouts

The following layouts are based on the systems used during deployment. Adjust partition sizes as needed to meet IBM minimum sizing recommendations and your storage capacity.

### Console and Application Host

| Mount Point | Size | Volume Group |
|-------------|------|--------------|
| / | 50 GB | rootrhel |
| /boot | 1 GB | Standard |
| /boot/efi | 1 GB | Standard |
| /tmp | 20 GB | rootrhel |
| /var | 20 GB | rootrhel |
| swap | 24 GB | rootrhel |
| /home | 100 GB | rootrhel |
| /opt | 60 GB | rootrhel |
| /storetmp | 25 GB | rootrhel |
| /var/log | 60 GB | rootrhel |
| /var/log/audit | 30 GB | rootrhel |
| /var/tmp | 10 GB | rootrhel |
| /recovery | 30 GB | Standard |
| /store | 17.2 TB* | storerhel |
| /transient | 4.4 TB* | storerhel |

\*Example values from the deployment environment.

### Event and Flow Processors

Use the same operating system partition layout as the Console and Application Host.

| Data Partition | Example Size |
|----------------|-------------:|
| /store | 21.3 TB* |
| /transient | 500 GB |

### QRadar Network Insights

Use the same operating system partition layout.

| Data Partition | Example Size |
|----------------|-------------:|
| /store | 14.5 TB* |

QRadar Network Insights does **not** require a `/transient` partition.

## Install QRadar

Create a mount point and mount the installation media.

```bash
mkdir -p /media/cdrom
mv qradar.iso /storetmp/
mount -o loop /storetmp/qradar.iso /media/cdrom
/media/cdrom/setup
```

Reboot when prompted, then mount the ISO and rerun the installer to complete the installation.

## Configure Appliance Roles

After installation, configure the appropriate appliance role:

- Console
- Application Host
- Event Processor
- Flow Processor
- High Availability Appliance
- QRadar Network Insights

> **Recommendation:** Configure High Availability appliances on the same management subnet as their primary appliance unless your network architecture requires otherwise.

> **Important:** If HA pairing fails because of password complexity, temporarily use a simpler compliant password, complete the pairing, then restore the required password policy.

## Verification

Verify that:

- RHEL installed successfully.
- Storage volumes are mounted correctly.
- The correct appliance role is configured.
- QRadar services are running.
- The web interface is accessible.
- High Availability synchronization completes successfully, if configured.

## Additional Resources

- IBM QRadar Installation Guide
- IBM QRadar High Availability Guide
- IBM QRadar Administration Guide
