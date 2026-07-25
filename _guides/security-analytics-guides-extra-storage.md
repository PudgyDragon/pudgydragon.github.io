---
title: "Expanding Capture Storage with an Additional Storage Array"
project: "Security Analytics"
category: "Engineering Guide"
description: "Extend the Security Analytics capture volume after adding an additional storage array."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/Extra_Storage.md"
---

## Introduction

Security Analytics stores captured network traffic within a dedicated Logical Volume Manager (LVM) volume. When additional storage is installed, the existing capture volume can be expanded without reinstalling the appliance.

This guide demonstrates how to extend the capture storage after adding a new storage array to the system.

> **Important**
>
> This guide assumes the new storage has already been presented to the operating system as a single block device. If you installed additional physical disks, you must first configure the RAID controller and create the appropriate virtual disk before continuing.

> **Warning**
>
> Incorrect LVM commands can permanently affect data availability. Verify device names carefully before modifying any physical or logical volumes.

## Prerequisites

Before extending the capture volume:

- Install the additional storage hardware.
- Configure the RAID controller (if applicable).
- Create the desired RAID virtual disk.
- Confirm the operating system detects the new storage device.

## Step 1 – Identify the New Storage Device

List all block devices.

```bash
lsblk
```

Locate the newly added storage device (for example, `/dev/sdb`).

## Step 2 – Review the Existing LVM Configuration

Display the configured volume groups.

```bash
vgs
```

Display the logical volumes.

```bash
lvs
```

This confirms the current capture volume configuration before any changes are made.

## Step 3 – Initialize the Physical Volume

Initialize the new storage device as an LVM physical volume.

Replace `/dev/sdX` with the correct device name.

```bash
pvcreate /dev/sdX
```

## Step 4 – Extend the Capture Volume Group

Add the new physical volume to the existing capture volume group.

```bash
vgextend captureVG /dev/sdX
```

After this step, the additional storage becomes available to the capture volume group.

## Step 5 – Extend the Logical Volume

Expand the capture logical volume to consume all available free space.

```bash
lvextend -l +100%FREE -r /dev/captureVG/captureLV
```

The `-r` option automatically resizes the filesystem after extending the logical volume, eliminating the need to perform a separate filesystem resize.

## Verification

Confirm the logical volume has been expanded successfully.

```bash
lvs
```

Verify the filesystem size.

```bash
df -h
```

Finally, verify the capture filesystem is using the expected amount of storage.

## Troubleshooting

If the new storage device does not appear:

- Verify the RAID virtual disk has been created.
- Confirm the operating system detects the device using `lsblk` or `dmesg`.
- Check the RAID controller for any failed or offline disks.

If `vgextend` reports the device is not initialized:

- Confirm `pvcreate` completed successfully.
- Verify the correct block device was specified.

> **Field Note**
>
> Security Analytics relies heavily on available capture storage. Increasing capture capacity allows the appliance to retain packet data for a longer period before older captures are recycled, providing a larger window for incident investigation and forensic analysis.
