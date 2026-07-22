---
title: "Internal Server Error"
project: "Security Analytics"
category: "Troubleshooting"
description: "A practical troubleshooting for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Troubleshoot/Internal_Server_Error.md"
---

# Troubleshooting Internal Server Error
After a while, spikes of traffic would cause the `/var` partition to go above the 80% threshold and fill up to 100%, causing an
Internal Server Error. There are several guides that may help you fix this issue, but none of them were ones that helped us
to not get this error again. Here are some of the articles found:

Error "Internal Server Error" on Security Analytics (Solera) login page or from the widgets on the summary page
- https://knowledge.broadcom.com/external/article/168502/error-internal-server-error-on-security.html

/var is full due to large audit.log files
- https://knowledge.broadcom.com/external/article?articleId=168496

/var partition is filling up or is 100% utilized
- https://knowledge.broadcom.com/external/article/168963/var-partition-is-filling-up-or-is-100-ut.html


After troubleshooting and comparing the device to devices that were provided by SSA themselves, I realized that when
the install was done, certain partitions and volume groups weren't created. This is a guide for creating the correct
partitions and volume groups for SSA on your own physical hardware. Please note, you will probably have different
hardware sizes than us, and you will need to adjust accordingly.

Determine what partitions you currently have, and what are missing:
```
lsblk
```
Your partitions should look similar to this:
```
Name----------------------------Size---------Type----------Mountpoint
sda-----------------------------x------------disk
---sda1-------------------------x------------part
---sda2-------------------------x------------part----------/boot
---sda3-------------------------x------------part----------/var
---sda4-------------------------x------------part
---sda5-------------------------x------------part----------/
---sda6-------------------------x------------part----------/ds
---sda7-------------------------x------------part----------/gui
---sda8-------------------------x------------part----------/home
sdb-----------------------------x------------disk
---indexVG-indexLV--------------x------------lvm-----------/var/lib/solera/meta
sdc-----------------------------x------------disk
---captureVG-captureLV----------x------------lvm-----------/pfs
```
If your partitions don't look somewhat similar to this, you may need to follow this guide. Our device only has sda and sdb,
so take that into account when following this guide. If you have sdc as well, you should be able to modify the guide
for your needs fairly easy.

At the beginning, our sdb only had `captureVG` and was missing `indexVG`, so we needed to create partitions to allow
both `captureVG` and `indexVG` to exist on sdb.

First, you need to delete all partitions on storage device you are working on (sdb for the purpose of this guide):
```
fdisk /dev/sdb
d (delete)
w (write)
```
Check for any volume groups and remove them:
```
vgdisplay
vgremove indexVG
vgremove captureVG
```
When creating partitions, it wasn't allowing for a larger than 2T size. This is how I changed that:
```
parted /dev/sdb
mklabel gpt
yes
unit TB
mkpart primary 0 0
print
quit
```
Create two new partitions in sdb:
```
fdisk /dev/sdb
n (new)
Leave all defaults except for the second prompt for partition size, which will be:
+4T (this is the size we used)
t (type)
8e
(sdb1 is created)
n (new)
Leave all defaults except for the second prompt for partition size, which will be:
+36T (this is the size we used)
t (type)
8e
(sdb2 is created)
w (write)
```
Now, create two new volume groups:
```
vgcreate indexVG /dev/sdb1
vgcreate captureVG /dev/sdb2
vgdisplay (to make sure they were created)
```
Create two new logical volumes
```
lvcreate -L 3.9T -n indexLV indexVG
lvcreate -L 36T -n captureLV captureVG
```
Make two new directories
```
mkdir /captureVG
mkdir /indexVG
```
Run the following commands to map and mount the logical volumes
```
mkfs.xfs /dev/mapper/indexVG-indexLV
mkfs.xfs /dev/mapper/captureVG-captureLV
mount /dev/mapper/indexVG-indexLV /var/lib/solera/meta
mount /dev/mapper/captureVG-captureLV /pfs
```
Edit the `/etc/fstab` file to make sure you have all the components. Compared to our original box,
this install was missing these ones:
```
tmpfs-------------------------/dev/shm------------------tmpfs-----defaults----------------------------------------------------------------------------0-0
devpts------------------------/dev/pts------------------devpts----defaults----------------------------------------------------------------------------0-0
sysfs-------------------------/sys----------------------sysfs-----defaults----------------------------------------------------------------------------0-0
proc--------------------------/proc---------------------proc------defaults----------------------------------------------------------------------------0-0
/dev/captureVG/captureLV------/pfs----------------------xfs-------defaults,noatime,nodiratime,nobarrier,noauto,nosuid,nodev,allocsize=64m,nofail------0-0
/dev/indexVG/indexLV----------/var/lib/solera/meta------xfs-------defaults,noatime,nodiratime,nobarrier,noauto,nosuid,nodev,allocsize=8m,nofail-------0-0

:wq! (save and quit)
```
Run the mount command, and reboot the system to finish your changes:
```
mount
reboot
```
After reboot, check that your partitions and volume groups are persisting:
```
lsblk
vgdisplay
```
Please note, after the reboot our sda and sdb switched names. If your system is similar to ours, the partitions should come out similar to this:
```
Name----------------------------------Size------------Type----------------Mountpoint
sda-----------------------------------x---------------disk
---sda1-------------------------------x---------------part
------indexVG-indexLV-----------------x---------------lvm-----------------/var/lib/solera/meta
---sda2-------------------------------x---------------part
------captureVG-captureLV-------------x---------------lvm-----------------/pfs
sdb-----------------------------------x---------------disk
---sdb1-------------------------------x---------------part
---sdb2-------------------------------x---------------part----------------/boot
---sdb3-------------------------------x---------------part----------------/var
---sdb4-------------------------------x---------------part
---sdb5-------------------------------x---------------part----------------/
---sdb6-------------------------------x---------------part----------------/ds
---sdb7-------------------------------x---------------part----------------/gui
---sdb8-------------------------------x---------------part----------------/home
```

I hope this guide helps you.
