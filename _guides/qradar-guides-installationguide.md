---
title: "Deploy Legacy IBM QRadar on Red Hat Enterprise Linux (SSD/HDD Storage)"
project: "QRadar"
category: "Engineering Guide"
description: "Deploy legacy IBM QRadar releases on customer-provided hardware using separate SSD operating system storage and HDD data storage. For newer deployments, refer to the RHEL 8 installation guide."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/InstallationGuide.md"
---

## Introduction

> **Important**
>
> This guide documents an older deployment method that was validated for earlier QRadar releases using separate SSD and HDD storage. It is retained for environments that continue to deploy or maintain legacy QRadar systems.
>
> For new deployments, use the **Deploy IBM QRadar SIEM on Red Hat Enterprise Linux 8** guide, which reflects the current storage layout and installation workflow.

This guide installs Red Hat Enterprise Linux on SSD storage and manually creates the QRadar `/store` and `/transient` logical volumes on HDD storage before installing QRadar.

## Reference Documentation

- IBM QRadar Installation Documentation
- Fedora Media Writer: https://fedoraproject.org/workstation/download/

## Requirements

This guide assumes:

- Customer-provided hardware
- SSD storage for the operating system
- HDD storage for QRadar data
- Manual LVM configuration after the operating system installation

## Create Installation Media

Create a bootable Red Hat Enterprise Linux USB using Fedora Media Writer.

## Install Red Hat Enterprise Linux

### Initial Installation

Configure the installer using the following recommendations:

- Select the desired language.
- Configure network settings.
  - Disable IPv6 if it is not required.
  - Configure IPv4 addressing.
  - Configure gateway, DNS servers, and search domains.
- Configure NTP.
  - Remove the default servers.
  - Add your organization's NTP servers.
- Set the root password.
- Create an administrative user.

### Partition the Operating System SSD

Select both disks and choose **Custom** partitioning.

Create a volume group named `rootrhel` on the SSD (`sdb`) and configure the following partitions.

| Mount Point | Size | Type |
|--------------|-----:|------|
| /boot/efi | 1 GB | Standard |
| /boot | 1 GB | Standard |
| /recovery | 8 GB | Standard |
| / | 15 GB | LVM |
| swap | 24 GB | LVM |
| /tmp | 15 GB | LVM |
| /storetmp | 15 GB | LVM |
| /home | 25 GB | LVM |
| /opt | 15 GB | LVM |
| /var/log/audit | 10 GB | LVM |
| /var/log | 20 GB | LVM |
| /var | 5 GB | LVM |

Complete the installation and reboot.

## Configure QRadar Storage

After RHEL is installed, create the QRadar data volume group on the HDD (`sda`).

```bash
lsblk

fdisk /dev/sda
# Delete existing partitions if necessary

fdisk /dev/sda
# Create a new Linux LVM partition

vgcreate storerhel /dev/sda1
vgs

mkdir /store
mkdir /transient

lvcreate -L 31T -n store storerhel
mkfs.xfs /dev/mapper/storerhel-store
mount /dev/mapper/storerhel-store /store

lvcreate -L 8T -n transient storerhel
mkfs.xfs /dev/mapper/storerhel-transient
mount /dev/mapper/storerhel-transient /transient
```

Update `/etc/fstab` so both logical volumes mount automatically after reboot.

Example entries:

```text
/dev/mapper/storerhel-store       /store       xfs   defaults   0 0
/dev/mapper/storerhel-transient   /transient   xfs   defaults   0 0
```

Reboot and verify the storage configuration.

```bash
reboot
lsblk
```

Expected layout:

```text
sda
└── storerhel
    ├── store        -> /store
    └── transient    -> /transient

sdb
├── /boot/efi
├── /boot
├── /recovery
└── rootrhel
    ├── /
    ├── swap
    ├── /tmp
    ├── /storetmp
    ├── /home
    ├── /opt
    ├── /var
    ├── /var/log
    └── /var/log/audit
```

## Install QRadar

After the operating system and storage have been configured, mount the QRadar installation media.

```bash
mount -o loop /storetmp/<qradar_iso_file> /media/cdrom
/media/cdrom/setup
reboot
```

After rebooting, continue the installation using the QRadar setup wizard.

## Verification

Verify the following before proceeding with appliance configuration:

- Red Hat Enterprise Linux installed successfully.
- The `rootrhel` volume group exists on the SSD.
- The `storerhel` volume group exists on the HDD.
- `/store` and `/transient` mount successfully after reboot.
- `lsblk` displays the expected storage layout.
- QRadar installation launches successfully from the mounted ISO.

## Additional Resources

- IBM QRadar Installation Documentation
- IBM QRadar Administration Guide

> **Related Guide:** For current QRadar deployments using RHEL 8, NVMe storage, High Availability, and QRadar Network Insights, refer to the newer **Deploy IBM QRadar SIEM on Red Hat Enterprise Linux 8** guide in this repository.
