---
title: "Installing Security Analytics on Proxmox"
project: "Security Analytics"
category: "Engineering Guide"
description: "Installing Broadcom Security Analytics as a virtual machine on Proxmox."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/SSA_Proxmox.md"
---

## Introduction

This guide documents the process I used to successfully install **Broadcom Security Analytics (SSA)** as a virtual machine on **Proxmox VE**.

The primary goal of this project was to build a functional lab environment for testing, experimentation, and learning without requiring dedicated physical hardware. While Broadcom does not officially support this deployment method, it can be useful for evaluation, proof-of-concept work, and developing familiarity with the platform.

> **Important**
>
> This guide reflects the versions of Security Analytics and Proxmox that were available when it was originally written. Both products have changed significantly since then, and portions of this guide may no longer apply to current releases.

> **Note**
>
> This guide has been on my list to revisit for quite some time. I would like to update and validate it against newer versions of Security Analytics and Proxmox, but I honestly don't know when—or if—I'll have the opportunity to do so. Until then, consider this guide a snapshot of what worked in my lab rather than a guaranteed installation procedure for current releases.

> **Warning**
>
> Installing Security Analytics on Proxmox is an unsupported configuration. Expect to perform additional troubleshooting beyond what would normally be required on supported hardware.

## Prerequisites

Before beginning:

- Proxmox VE installed and operational
- Broadcom Security Analytics installation media
- A dedicated storage device or LVM storage pool for installation media
- Root access to the Proxmox host
- Basic familiarity with Proxmox virtual machine management

## Step 1 – Prepare Proxmox Storage

Create an LVM storage target within Proxmox.

The storage should support:

- Disk Images
- Containers

This storage will temporarily be used to hold the Security Analytics installation media.

## Step 2 – Prepare the Proxmox Host

When preparing storage, an existing volume group may prevent the installation media from being created.

Display existing volume groups.

```bash
vgs
```

If an existing capture volume group is present, remove it.

```bash
vgremove captureVG
```

Remove any remaining filesystem signatures from the target disk.

```bash
wipefs --all --backup /dev/sdX
```

Replace `/dev/sdX` with the correct device.

Install required packages.

```bash
apt-get install parted
apt-get install udev
```

On my installation, `udevadm` was not located where the Broadcom installation script expected it.

Creating a copy resolved the issue.

```bash
cp /bin/udevadm /sbin/udevadm
```

> **Field Note**
>
> This workaround was required in my lab environment. Depending on your Proxmox version, it may not be necessary.

## Step 3 – Create the Installation Media

Follow the installation media creation procedure described in the **Installing Security Analytics 8.2.6 on Dell Hardware** guide.

Instead of writing the installer to a USB flash drive, write it directly to the dedicated Proxmox storage device.

Once complete, the storage device can be attached directly to the virtual machine.

## Step 4 – Create the Virtual Machine

Create a new virtual machine using the following settings.

| Setting | Value |
|---------|-------|
| BIOS | SeaBIOS |
| SCSI Controller | VirtIO SCSI |
| Network Adapter 1 | VirtIO (Management) |
| Network Adapter 2 | VirtIO (Capture) |

Do **not** start the virtual machine yet.

Attach the installation media.

```bash
qm set <VM_ID> -virtio0 /dev/sdX
```

Configure the VM to boot from the attached installation disk.

Complete the Security Analytics installation.

## Step 5 – Login Issues

During my initial testing I encountered repeated **Authentication Error** messages when attempting to log in with the default credentials.

My original workaround involved booting into a root shell by modifying the GRUB kernel parameters.

```text
rw init=/bin/bash
```

After booting:

```bash
mount -n -o remount,rw /
passwd root
```

However, additional testing later revealed the actual cause.

> **Field Note**
>
> The login failures were caused by allocating **insufficient virtual disk space** during installation—not by an authentication issue. Once additional storage was allocated, the appliance accepted the default credentials normally. The GRUB recovery procedure is preserved here only because it may still be useful for recovering a lab appliance.

## Step 6 – Configure Networking

Configure the temporary management interface.

```bash
sudo ifconfig bond0 <IP_ADDRESS> netmask <SUBNET_MASK>
sudo route add default gw <DEFAULT_GATEWAY>
```

In my environment, I also configured `eth0` using the same settings.

```bash
sudo ifconfig eth0 <IP_ADDRESS> netmask <SUBNET_MASK>
```

> **Field Note**
>
> Having a certain friend nearby seemed to magically solve my networking issues. While I can't officially recommend that as a troubleshooting step, every engineer has someone they call when things suddenly start working the moment they arrive.

## Step 7 – Correct the MAC Address

I encountered an issue where the MAC addresses assigned within Proxmox did not match the interface configuration inside Security Analytics.

This prevented the management interface from coming online.

Verify the desired MAC address configured in Proxmox.

Then update:

```text
/etc/sysconfig/network-scripts/ifcfg-eth0
```

and

```text
/etc/sysconfig/network-scripts/ifcfg-bond0
```

Replace:

```text
HWADDR=
```

with

```text
MACADDR=
```

if necessary.

Ensure both files contain the same MAC address configured within Proxmox.

## Verification

After completing the installation:

- Verify the management interface is online.
- Confirm `bond0` has the expected IP address.
- Verify the web interface is reachable.
- Confirm both virtual NICs report link status.
- Verify Proxmox firewall rules are not blocking management access.

## Troubleshooting

If the web interface is unreachable:

- Verify the Proxmox virtual NIC MAC addresses.
- Confirm the firewall is disabled on the virtual NIC.
- Verify `bond0` has the expected IP configuration.
- Confirm the virtual machine has sufficient allocated storage.
- Verify both network adapters report an active link.

> **Field Note**
>
> This guide documents what ultimately worked in my own lab after a considerable amount of experimentation. If you're attempting this several years after it was written, expect that some workarounds may no longer be necessary—or that new ones may have emerged. If I revisit this project in the future, I'll update the guide accordingly.
