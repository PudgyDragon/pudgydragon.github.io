---
title: "Lostpassword"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/LostPassword.md"
---

# Guide for recovering lost root password
The guide by IBM is from 7.3 and hasn't been updated to reflect what changes may have been made in 7.5. This guide follows their guide for the most part, with slight changes. The original guide can be found here:
- https://www.ibm.com/support/pages/qradar-reset-forgotten-root-password

## Guide for 7.5 
- Reboot the system (if you're using the guide you're probably going to have to reboot it with the power button)
- When prompted for what image you want to boot from, navigate to the one below your main boot option and press `e`
  - The guide for 7.3 states that you should use the "Factory Re-Install" version, but that isn't available in our environment. The options to choose from are x86, x64, and Rescue. I chose x64.
- On the line that begins with `linux`, after `vmlinuz` there should be the letters `ro`. Before `ro`, insert the line `rd.break`
- Press `ctrl + x` to start the system with these changes
- Use `lvm vgscan` to find your volume group names
- Use `lvm vgchange -ay` to activate them
- View your mounted volumes using `ls /dev/mapper`
- Make a temporary directory using `mkdir -pv /tmp/root`
- You will need to unmount your `rootrhel-root` or whatever your volume is named using `umount /dev/mapper/rootrhel-root`
- Remount this volume to `/tmp/root` using `mount /dev/mapper/rootrhel-root /tmp/root`
- Mount a few more directories using the following commands:
  - `mount -o bind /sys /tmp/root/sys`
  - `mount -o bind /dev /tmp/root/dev`
  - `mount -o bind /proc /tmp/root/proc`
- Enter bash using `chroot /tmp/root`
- Change your root password using `passwd`
  - If you have another password to change, you can do it here too using `passwd <username>`
- Mount the remaining file systems using `mount -a -v`
- Use `exit` to leave bash
- Reboot the system using `reboot`

## Wrapping Up
When it reboots, let it go through the normal boot using the main boot option. Test your new password out and make sure it works.
