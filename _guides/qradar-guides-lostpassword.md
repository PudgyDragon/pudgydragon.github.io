---
title: "Recover a Lost Root Password"
project: "QRadar"
category: "Engineering Guide"
description: "Recover a lost root password on IBM QRadar by booting into the RHEL emergency environment and resetting the password."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/LostPassword.md"
---

## Introduction

This guide describes how to recover a lost `root` password on an IBM QRadar appliance.

IBM provides a root password recovery procedure for QRadar 7.3. This guide follows the same general recovery process while documenting the changes that were required to successfully perform the procedure on newer QRadar deployments.

> **Last Verified:** IBM QRadar 7.5
>
> The steps in this guide were last validated on QRadar 7.5. Although the underlying recovery process relies primarily on standard Red Hat Enterprise Linux recovery methods, newer QRadar releases may introduce changes to the boot menu or storage layout. Review the latest IBM documentation if you are deploying a newer version.

## References

- IBM Support: Reset Forgotten Root Password (QRadar 7.3)
  - https://www.ibm.com/support/pages/qradar-reset-forgotten-root-password

## Boot into the Emergency Environment

1. Reboot the appliance.

2. When the GRUB boot menu appears, highlight the entry you want to boot and press **`e`** to edit the boot parameters.

    > **Note:** Some older IBM documentation refers to a **Factory Re-Install** boot option. In some QRadar 7.5 environments, this option may not be available. If necessary, edit the standard operating system boot entry instead.

3. Locate the line beginning with:

    ```text
    linux
    ```

4. Find the kernel parameter:

    ```text
    ro
    ```

5. Insert the following parameter immediately before `ro`:

    ```text
    rd.break
    ```

6. Boot using the modified parameters.

    ```text
    Ctrl + X
    ```

## Activate the Root Volume

Scan for available volume groups.

```bash
lvm vgscan
```

Activate the volume groups.

```bash
lvm vgchange -ay
```

Display the available logical volumes.

```bash
ls /dev/mapper
```

Create a temporary mount point.

```bash
mkdir -pv /tmp/root
```

Unmount the root logical volume if it is already mounted.

```bash
umount /dev/mapper/rootrhel-root
```

> **Note:** Replace `rootrhel-root` with the appropriate logical volume name if your deployment uses a different naming convention.

Mount the root logical volume.

```bash
mount /dev/mapper/rootrhel-root /tmp/root
```

## Prepare the Chroot Environment

Bind the required virtual file systems.

```bash
mount -o bind /sys /tmp/root/sys
mount -o bind /dev /tmp/root/dev
mount -o bind /proc /tmp/root/proc
```

Enter the installed operating system.

```bash
chroot /tmp/root
```

## Reset the Password

Reset the `root` password.

```bash
passwd
```

To reset another local account, specify the username.

```bash
passwd <username>
```

Mount any remaining file systems.

```bash
mount -a -v
```

Exit the chroot environment.

```bash
exit
```

Reboot the appliance.

```bash
reboot
```

## Verification

Allow the system to boot normally using the default boot entry.

Verify that:

- The appliance boots successfully.
- The modified boot parameters are no longer present.
- The new `root` password works.
- Any additional passwords that were reset authenticate successfully.

## Additional Resources

- IBM QRadar Support Documentation
- IBM QRadar Administration Guide
