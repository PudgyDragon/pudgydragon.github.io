---
title: "Installationguide"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/InstallationGuide.md"
---

# IBM QRadar Installation Guide
This is an installation guide for IBM QRadar on your own hardware that is not provided by IBM. Hardware used in this guide uses a combination of SSD and HDD. The initial RHEL install is done on the SSD drives. After which, QRadar partitions are created on the HDD drives and the installation can take place.

Create a USB with a RHEL OS using Fedora Media Writer, which can be downloaded at:
https://fedoraproject.org/workstation/download/

## Follow these initial steps
- Boot the server with the RHEL USB
- Choose a language
- Configure Network and Host Settings
  - IPV6 Settings
    - Ignore
  - IPV4 Settings
    - Manual
    - Address
    - Netmask
    - Gateway
    - DNS Servers
    - Search Domains
    - Save, Done
  - Click "On"
- Configure the Time
  - Wheels Button
    - Uncheck pre-checked NTP Servers
    - Add your NTP Server IPs
    - Save, Done
- Installation Partitions
  - Select both hard drives
  - Select "Manually configure settings"
    - Delete all existing configurations
    - Add volume group "rootrhel" to ssd (sdb)
    - Use the following configuration for partitions
      ```
      SDB
      SDB1: /boot/efi - 1GB (standard partition)
      SDB2: /boot - 1GB (standard partition
      SDB3: /recovery - 8GB (standard partition)
      SDB4: / - 15GB (lvm)
            swap - 24GB (lvm)
            /tmp - 15GB (lvm)
            /storetmp - 15GB (lvm)
            /home - 25GB (lvm)
            /opt - 15GB (lvm)
            /var/log/audit - 10GB (lvm)
            /var/log - 20GB (lvm)
            /var - 5GB (lvm)
      ```
  - "Finish" install partitions
- Root Password
  - Set root password; Done
- User Creation
  - Username
  - Make user Admin
  - Set password; Done

## Installation Starts
Wait for installation to complete and server to reboot.

## Once the installation is complete, the OS will be installed on SDB. 
Store and transient will need to be created manually on SDA with the following commands:
```
lsblk  // If there are multiple partitions on SDA already, you will need to delete them with the next command
fdisk /dev/sda
   d   // Option for deleting partiions; delete all partitions
   w   // Option to write once deleted
fdisk /dev/sda
   n   // New 
   t   // Type
   8e  // The type we'll be using
   w   // Write
lsblk  // Checking to see if all partitions were created
vgcreate storerhel /dev/sda1
vgs    // To check that storerhel has been created
mkdir /store
mkdir /transient
lvcreate -L 31T -n store storerhel
mkfs.xfs /dev/mapper/storerhel-store
mount /dev/mapper/storerhel-store /store
vi /etc/fstab
   shift + G     // Takes you to the end of the document
   i   // Insert
   /dev/mapper/storerhel-store /store   xfs   defaults   0  0
   :wq!
   enter
mount
lvcreate -L 8T -n transient storerhel
mkfs.xfs /dev/mapper/storerhel-transient
mount /dev/mapper/storerhel-transient /transient
vi /etc/fstab
   shift + G
   yy + p   // Copy & pastes the previous line
   //  Edit line to:
       /dev/mapper/storerhel-transient /transient   xfs   defaults   0  0
   :wq!
   enter
mount
reboot
lsblk    // Check that SDA partition remained after reboot
```

The partitions should look similar to this:
```
Name----------------------------Size---------Type---------Mountpoint
sda-----------------------------39.3T--------disk	
---sda1-------------------------39.3T--------part	
------storerhel-store-----------31T----------lvm----------/store
------storerhel-transient-------8T-----------lvm----------/transient
sdb-----------------------------223.5G-------disk	
---sdb1-------------------------1G-----------part---------/boot/efi
---sdb2-------------------------1G-----------part---------/boot
---sdb3-------------------------8G-----------part---------/recovery
---sdb4-------------------------144G---------part	
------rootrhel-root-------------15G----------lvm----------/
------rootrhel-swap-------------24G----------lvm----------[SWAP]
------rootrhel-tmp--------------15G----------lvm----------/tmp
------rootrhel-storetmp---------15G----------lvm----------/storetmp
------rootrhel-home-------------25G----------lvm----------/home
------rootrhel-opt--------------15G----------lvm----------/opt
------rootrhel-var_log_audit----10G----------lvm----------/var/log/audit
------rootrhel-var_log----------20G----------lvm----------/var/log
------rootrhel-var--------------5G-----------lvm----------/var
```

## QRadar ISO
Once RHEL setup and installation is complete, you can move on to installing the QRadar ISO onto the device.

```
mount -o loop /storetmp/<qradar_iso_file> /media/cdrom
/media/cdrom/setup
reboot
```

From here, setup should be fairly straight forward and you should be able to follow the guide provided by IBM at:
- https://www.ibm.com/docs/es/qsip/7.5?topic=installations-installing-qradar-after-rhel-installation




