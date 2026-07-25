---
title: "Gigamon Upgrade Guide"
project: "Gigamon"
category: "Engineering Guide"
description: "Upgrade Gigamon Fabric Manager and GigaVUE appliances to a newer software release."
source_url: "https://github.com/PudgyDragon/Gigamon/blob/main/Guides/UpgradeGuide.md"
---

## Introduction

Gigamon software can be upgraded using image files stored locally rather than downloading them directly from an external image server. This approach is useful in environments without internet connectivity or where software images are distributed through an internal software repository.

This guide explains how to upgrade both Gigamon Fabric Manager and standalone GigaVUE appliances using locally staged image files.

## Prerequisites

Before beginning the upgrade:

- Download the appropriate `.img` files from Gigamon.
- Ensure the image files are accessible from your workstation.
- Install a file transfer utility such as WinSCP or an equivalent SCP/SFTP client.

## Upgrade Gigamon Fabric Manager

### Upload the Image

Log in to the Fabric Manager web interface.

Navigate to:

- **Settings**
- **System**
- **Images**
- **Internal Image Files**
- **Upload**

Upload the desired Fabric Manager image.

> **Note:** The Internal Image Server can also be used to store images for managed Gigamon nodes.

### Start the Upgrade

Select the profile icon in the upper-right corner of the Fabric Manager interface, then choose:

- **Upgrade**

Configure the following settings:

- **Image Server Type:** Internal Image Server
- **Version:** Select the uploaded image
- **Start Upgrade**

Allow the upgrade to complete without refreshing or closing the browser window.

When the upgrade finishes, Fabric Manager will prompt you to return to the dashboard.

## Upgrade Standalone Gigamon Nodes

If a node is not managed by Fabric Manager, the software image can be staged manually.

### Upload the Image

Using WinSCP or another SCP/SFTP client, connect to the node.

Open the following directory:

```text
/var/opt/tms/images
```

Upload the desired `.img` file.

> **Note:** Remove any obsolete image files before uploading the new image to avoid confusion during the upgrade process.

### Install the Image

Connect to the node CLI.

Run the following commands:

```bash
image install gigamon.img

image boot next

write memory

reload
```

These commands perform the following actions:

- Install the software image.
- Configure the new image as the next boot image.
- Save the running configuration.
- Reboot the appliance.

## Verification

After the appliance restarts:

- Verify the expected software version is running.
- Confirm the appliance returns to a healthy operational state.
- Verify management connectivity through the CLI and web interface.
- If the appliance is managed by Fabric Manager, confirm it reconnects successfully.

## Additional Resources

- [Gigamon Fabric Manager Installation and Upgrade Guide (v6.8)](https://docs.gigamon.com/pdf-68/Content/Resources/PDF%20Library/GV-6800-Doc/GigaVUE-FM-InstallUpgradeGuide-v68.pdf)

- [Gigamon GigaVUE OS Upgrade Guide (v6.3)](https://docs.gigamon.com/pdfs/Content/Resources/PDF%20Library/GV-6300-Doc/GigaVUE-OS-UpgradeGuide-v63.pdf)
