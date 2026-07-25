---
title: "Troubleshooting Internal Server Error Caused by Storage Layout"
project: "Security Analytics"
category: "Troubleshooting"
description: "Resolve recurring Internal Server Error conditions caused by an incorrect storage layout on Broadcom Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Troubleshoot/Internal_Server_Error.md"
---

## Introduction

One of the more frustrating issues I encountered while deploying Security Analytics on custom hardware was a recurring **Internal Server Error** within the web interface.

Initially, the appliance functioned normally. However, periods of increased traffic would eventually cause the `/var` filesystem to exceed **80% utilization** before ultimately filling to **100%**, at which point the web interface would begin returning **Internal Server Error** messages.

Broadcom has published several Knowledge Base articles covering common causes of this problem.

- Error "Internal Server Error" on Security Analytics login page or Summary widgets
  - https://knowledge.broadcom.com/external/article/168502/error-internal-server-error-on-security.html

- `/var` is full due to large `audit.log` files
  - https://knowledge.broadcom.com/external/article/168496

- `/var` partition is filling up or is 100% utilized
  - https://knowledge.broadcom.com/external/article/168963/var-partition-is-filling-up-or-is-100-ut.html

While those articles are useful, none of them resolved the issue in our environment.

After comparing our appliance against factory-built Security Analytics hardware provided by Broadcom, we discovered that the storage layout created during installation was missing several expected partitions and logical volumes.

This guide documents how we corrected the storage layout and eliminated the recurring Internal Server Error.

> **Warning**
>
> This procedure is destructive. It removes partitions, volume groups, and logical volumes from the storage device being modified. Ensure all required data has been backed up before proceeding.

> **Important**
>
> The partition sizes shown throughout this guide reflect the hardware used in our deployment. Adjust all sizes to match your own storage capacity and retention requirements.

## Symptoms

You may observe one or more of the following:

- Internal Server Error within the web interface
- `/var` repeatedly reaches 100% utilization
- Metadata storage grows unexpectedly
- Packet capture continues while the GUI becomes unstable
- System health degrades during traffic spikes

## Step 1 – Verify the Existing Storage Layout

Begin by reviewing the current storage configuration.

```bash
lsblk
```

A typical appliance should resemble the following layout.

```text
sda
├── /boot
├── /var
├── /
├── /ds
├── /gui
└── /home

sdb
└── indexVG/indexLV
    └── /var/lib/solera/meta

sdc
└── captureVG/captureLV
    └── /pfs
```

Your hardware may differ, but separate logical volumes for metadata and packet storage should exist.

In our environment, only `captureVG` existed. The metadata volume (`indexVG`) had never been created.

## Step 2 – Remove the Existing Storage Configuration

Delete the existing partitions from the storage device.

Example:

```bash
fdisk /dev/sdb
```

Delete each partition before writing the changes.

```
d
w
```

Remove any existing volume groups.

```bash
vgdisplay
vgremove indexVG
vgremove captureVG
```

## Step 3 – Initialize the Disk

Large storage devices may require GPT before partitions larger than 2 TB can be created.

```bash
parted /dev/sdb
```

Example:

```text
mklabel gpt
yes
unit TB
mkpart primary 0 0
print
quit
```

## Step 4 – Create the Partitions

Recreate the storage layout.

```bash
fdisk /dev/sdb
```

Create two Linux LVM partitions.

Example sizes used in our deployment:

| Partition | Purpose | Size |
|-----------|---------|------:|
| sdb1 | Metadata | 4 TB |
| sdb2 | Packet Capture | 36 TB |

Adjust these values to match your environment.

## Step 5 – Create Volume Groups

Create separate volume groups.

```bash
vgcreate indexVG /dev/sdb1
vgcreate captureVG /dev/sdb2
```

Verify the volume groups.

```bash
vgdisplay
```

## Step 6 – Create Logical Volumes

Create the logical volumes.

```bash
lvcreate -L 3.9T -n indexLV indexVG
lvcreate -L 36T -n captureLV captureVG
```

Again, adjust the sizes as appropriate for your hardware.

## Step 7 – Format and Mount the Volumes

Format each logical volume.

```bash
mkfs.xfs /dev/mapper/indexVG-indexLV
mkfs.xfs /dev/mapper/captureVG-captureLV
```

Mount the filesystems.

```bash
mount /dev/mapper/indexVG-indexLV /var/lib/solera/meta
mount /dev/mapper/captureVG-captureLV /pfs
```

## Step 8 – Update `/etc/fstab`

Verify the required mount entries exist.

At minimum, ensure entries similar to the following are present.

```text
/dev/captureVG/captureLV    /pfs                  xfs   defaults,noatime,nodiratime,nobarrier,noauto,nosuid,nodev,allocsize=64m,nofail
/dev/indexVG/indexLV        /var/lib/solera/meta xfs   defaults,noatime,nodiratime,nobarrier,noauto,nosuid,nodev,allocsize=8m,nofail
```

If these entries are missing, add them before rebooting.

## Step 9 – Mount and Reboot

Mount all configured filesystems.

```bash
mount
```

Reboot the appliance.

```bash
reboot
```

## Verification

After the appliance starts:

Verify the storage layout.

```bash
lsblk
```

Verify the volume groups.

```bash
vgdisplay
```

In our environment, the operating system reassigned disk names after the reboot.

For example:

- Original `sdb` became `sda`
- Original `sda` became `sdb`

This is expected on some hardware platforms.

Confirm:

- `/pfs` is mounted.
- `/var/lib/solera/meta` is mounted.
- Packet capture resumes normally.
- Metadata generation resumes normally.
- `/var` no longer grows uncontrollably during periods of heavy traffic.

## Troubleshooting

If `/var` continues to fill:

- Verify `indexVG` exists.
- Verify `/var/lib/solera/meta` is mounted.
- Confirm metadata is not being written to the root filesystem.
- Compare your storage layout against a known-good appliance.

If `lsblk` does not resemble a factory appliance, additional storage configuration may still be required.

> **Field Note**
>
> This issue took considerably longer to diagnose than it should have because the symptoms suggested an application problem rather than a storage configuration issue. Only after comparing our appliance against Broadcom-provided hardware did we discover that the installation had never created the expected metadata volume. Once the storage layout matched the factory appliances, the recurring Internal Server Errors disappeared—even during traffic spikes that had previously filled `/var` to 100%.
