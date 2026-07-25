---
title: "Install an IBM QRadar Interim Fix"
project: "QRadar"
category: "Engineering Guide"
description: "Install an IBM QRadar Interim Fix (IF) by mounting the update package, applying the installer, and verifying the installed version across all managed hosts."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/InterimFixUpdateGuide.md"
---

## Introduction

IBM periodically releases Interim Fixes (IFs) to address product defects, security issues, and stability improvements between scheduled maintenance releases.

This guide describes how to install an Interim Fix on a QRadar deployment, perform post-installation cleanup, and verify that the update was successfully applied across all managed hosts.

## Prerequisites

Before installing an Interim Fix:

- Download the appropriate `.sfs` update package from IBM Fix Central.
- Ensure the update is compatible with your QRadar version.
- Verify sufficient free space is available in `/storetmp`.
- Schedule an appropriate maintenance window, as services may restart during the installation.

## Install the Interim Fix

1. Download the Interim Fix package from **IBM Fix Central**.

2. Connect to the QRadar Console using SSH as `root`.

3. Create the update mount directory if it does not already exist.

    ```bash
    mkdir -p /media/updates
    ```

4. Copy the `.sfs` update package to the Console.

    Example destination:

    ```text
    /storetmp
    ```

5. Change to the working directory.

    ```bash
    cd /storetmp
    ```

6. Mount the update package.

    ```bash
    mount -o loop -t squashfs /storetmp/<interim_fix>.sfs /media/updates
    ```

7. Launch the installer.

    ```bash
    /media/updates/installer
    ```

8. When prompted, select:

    ```text
    all
    ```

    This applies the Interim Fix to all eligible managed hosts.

## Post-Installation Cleanup

After the installation completes successfully:

1. Unmount the update package.

    ```bash
    umount /media/updates
    ```

2. Clear your web browser cache before logging back into the QRadar user interface.

3. Remove the `.sfs` package from the Console and any managed hosts where it was copied.

## Verify the Installation

Run the following command from the Console to verify the Interim Fix level on all managed hosts.

```bash
/opt/qradar/support/all_servers.sh -C "/opt/qradar/bin/myver -v | grep Interim"
```

Verify that each appliance reports the expected Interim Fix version.

## Additional Resources

- IBM QRadar Fix Central
- IBM QRadar Software Installation and Upgrade Documentation
