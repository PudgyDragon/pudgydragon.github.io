---
title: "Installing Security Analytics 8.2.6 on Dell Hardware"
project: "Security Analytics"
category: "Engineering Guide"
description: "Installing Broadcom Security Analytics 8.2.6 on Dell hardware using the DVD ISO installation media."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/Installation_Guide.md"
---

## Introduction

This guide documents a successful method for installing **Broadcom Security Analytics (SSA) 8.2.6** on Dell server hardware using the official **DVD ISO** installation media.

Several installation methods were evaluated during deployment, including approaches documented elsewhere online, but this was the only consistently successful process in our environment. The procedure below reflects the method ultimately used to complete multiple successful installations.

> **Important**
>
> This guide applies specifically to **Security Analytics 8.2.6** using the **DVD ISO** installation media. Installation procedures may differ for newer software versions.

> **Note**
>
> A USB flash drive is required for this installation method. The official DVD ISO cannot be written directly to a USB drive without first converting it using Broadcom's installation script.

## Prerequisites

Before beginning, ensure you have the following:

- Broadcom Security Analytics 8.2.6 DVD ISO
- USB flash drive
- Supported Dell server
- Root access to a Linux system
- Network connectivity (optional but recommended)
- External storage or SCP/SFTP access for transferring installation files

You will also need Broadcom's USB creation script.

Broadcom originally distributed the script through the following Knowledge Base article:

https://knowledge.broadcom.com/external/article/168296

> **Note**
>
> Broadcom has since removed the script from the article. A copy has been preserved within this repository for archival purposes.

## Step 1 – Transfer the Installation Files

Copy the following files to the target server:

- Security Analytics DVD ISO
- `solera-iso-to-usb.sh`

Place both files in:

```text
/home
```

After the transfer completes, disconnect any temporary storage devices.

## Step 2 – Install Required Packages

Install the packages required by the USB creation script.

```bash
yum install syslinux
yum install dosfstools
yum install rsync
```

> **Field Note**
>
> Depending on the Linux distribution or package versions installed, additional dependencies may be required. If the script reports missing utilities, install the requested packages before continuing.

## Step 3 – Prepare the USB Creation Script

Navigate to the home directory.

```bash
cd /home
```

Make the script executable.

```bash
chmod +x solera-iso-to-usb.sh
```

## Step 4 – Identify the USB Device

Before inserting the USB drive, list the currently attached storage devices.

```bash
fdisk -l
```

Insert the USB flash drive and run the command again.

```bash
fdisk -l
```

Identify the newly detected device.

Example:

```text
/dev/sdc
```

If the operating system automatically mounts the USB drive, unmount it before continuing.

Example:

```bash
umount /dev/sdc1
```

> **Warning**
>
> Verify the correct device before proceeding. Selecting the wrong disk will overwrite its contents.

## Step 5 – Create the Installation USB

Run the Broadcom conversion script.

```bash
./solera-iso-to-usb.sh --force <ISO_FILE> <USB_DEVICE>
```

Example:

```bash
./solera-iso-to-usb.sh --force atpsa-8.2.6-55530-x86_64-DVD.iso /dev/sdc
```

Allow the script to complete before removing the USB drive.

## Step 6 – Configure the BIOS

After creating the installation media:

1. Reboot the server.
2. Enter the BIOS setup.
3. Change the boot mode from **UEFI** to **Legacy BIOS**.
4. Save the configuration.

The server will reboot.

## Step 7 – Boot from the Installation USB

During startup:

1. Open the boot menu.
2. Select the USB drive.
3. Allow the installer to start.

The installer performs several automated tasks before rebooting.

After the reboot, boot from the Security Analytics installation again if prompted.

When installation completes, the login prompt will appear.

## Step 8 – Initial Login

Default credentials:

| Username | Password |
|-----------|----------|
| `admin` | `Solera` |

> **Warning**
>
> Change the default administrator password as soon as the installation is complete.

## Step 9 – Configure Temporary Network Settings

During our deployments, the official installation guide instructed administrators to configure **eth0**.

On our Dell hardware, this was **not** the correct management interface.

Instead, the management interface was assigned to:

```text
bond0
```

Assign a temporary IP address.

```bash
sudo ifconfig bond0 <IP_ADDRESS> netmask <SUBNET_MASK>
```

Configure the default gateway.

```bash
sudo route add default gw <DEFAULT_GATEWAY>
```

> **Field Note**
>
> Depending on your hardware configuration, the management interface may not be `eth0`. Verify the correct interface assignment before configuring networking.

## Step 10 – Complete the Initial Configuration Wizard

From a workstation, browse to:

```text
https://<IP_ADDRESS>
```

Log in using the default administrator credentials.

After accepting the EULA, the Initial Configuration Wizard should appear automatically.

If it does not, browse directly to:

```text
/settings/initial_config
```

Complete the remaining configuration, including:

- Root password
- Administrator password
- Management IP address
- Default gateway
- DNS servers
- Proxy configuration (if required)
- DHCP settings (if applicable)

After saving the configuration, the appliance is ready for licensing, storage configuration, and capture interface setup.

## Verification

After completing the installation:

- Verify you can access the web interface.
- Confirm the management interface has the correct IP address.
- Verify DNS resolution.
- Confirm the default gateway is reachable.
- Ensure the Initial Configuration Wizard has completed successfully.
- Verify you can log in using the newly configured administrator credentials.

## Troubleshooting

If the installation USB does not boot:

- Verify the BIOS is configured for **Legacy BIOS** mode.
- Confirm the USB was created using Broadcom's conversion script.
- Ensure the correct USB device was selected during USB creation.

If the Initial Configuration Wizard does not appear:

Browse directly to:

```text
/settings/initial_config
```

If the appliance is unreachable after assigning an IP address:

- Verify the management interface is actually `bond0`.
- Confirm the network cable is connected to the correct interface.
- Verify the gateway and subnet mask are correct.

> **Field Note**
>
> The most significant issue encountered during deployment was the management interface assignment. The installation documentation referenced `eth0`, while the actual management interface on our Dell hardware was `bond0`. Identifying the correct interface early in the installation process avoided unnecessary troubleshooting and allowed the deployment to proceed normally.
