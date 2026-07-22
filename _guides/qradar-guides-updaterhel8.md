---
title: "Updaterhel8"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/UpdateRHEL8.md"
---

# Guide for upgrading to Update Package 8 (RHEL 8)
Pretty straight forward. Had a couple hiccups that prevented it from updating but wasn't a hard thing to fix right away.

## Verify kernel
Before you start, you will need to be on the latest Interim Fix for QRadar, Update Package 7 Interim Fix 6. This will ensure
you have the right kernel before upgrading to RHEL 8. Once you have done so, you can verify you have the right kernel by running
the following commands:
```
rpm -qa | grep kernel
/opt/qradar/support/all_servers.sh "uname -a"
```
The kernel MUST be 105. If it's not 105, you won't be able to successfully upgrade to Update Package 8.

## Grub STIG
If you're like us, you probably have a setting that requires you to login at the physical console every time your Console or
Event Processor reboots. The upgrade reboots several times, so to prevent you having to go back and forth or sit next to your server
you can run the following commands:
```
cd /boot/efi/EFI/redhat/
cp user.cfg /home/stiguser
rm user.cfg
grub2-mkconfig -o /boot/efi/EFI/redhat/grub.cfg
reboot
```
Rebooting will help you verify that the setting is gone. If it's been a while and your screen hasn't come up, a weird issue that
happened to us was that the server was just stuck on a black screen and needed to be hard power cycled.

## Follow release notes
From this point, you should be able to follow the release notes at:
- https://www.ibm.com/support/pages/node/7032144


But, if you're anything like me you don't want to have to scroll through all the fluff and you'd like a quick and dirty, so:
1. Download the software update for QRadar 7.5.0 Update Package 8 from IBM Fix Central
2. SSH into the Console as root
3. Create /media/updates directory if you haven't
   - `mkdir -p /media/updates`
4. SCP the file and place it in `/storetmp`
5. Change directory to `/storetmp`
   - `cd /storetmp`
6. Mount the patch file to `/media/updates`
   - `mount -o loop -t squashfs /storetmp/750-QRADAR-QRSIEM-2021.6.8.20240302192142.sfs /media/updates`
7. Run a Leapp pretest
   - `/media/updates/installer --leapp-only`
8. Run the patch installer
   - `/media/updates/installer`
9. Select `all`
10. Once the patch has completed, unmount the patch
    - `umount /media/updates`
11. Clear browser cache
12. Delete SFS file from all appliances

## Possible issues
### Issue 1
We encountered an issue on some devices. The issue was something along the lines of:
```
Cliniq has detected unresolved patch-sensitive issues. You must resolve these issues before continuing.
Remediation: Remove the dump files to avoid issues during the upgrade.
For each file found, run: rm <dump_file>
```
The dump files for us were in `/store/jheap`, and we needed to completely remove any folder with the naming convention `ccpp-`.
If you have similar issues, make sure to note what folder and what file is causing the issue. Deleting the files/folders
should get you back on track, in which you can run `/media/updates/installer` again to see if it has been resolved.

### Issue 2
When running the `/media/updates/installer --leapp-only`, the STIG preventing root login was causing it to have issues running. You can fix this by changing the sshd_config
```
vim /etc/ssh/sshd_config
PermitRootLogin yes
systemctl restart sshd
```
Changing the config from `no` to `yes` and restarting the service will solve this issue.
