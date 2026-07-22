---
title: "Extra Storage"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/Extra_Storage.md"
---

# Extra Storage Array
This is a short guide for adding capture storage if you've added an external storage device to the system

## Note before you start
If you've added an extra storage array to the device, make sure that you configure the RAID for it and create a new virtual disk using the physical disks. I should probably write up a guide for SSA RAID configuration. Some day.

## Walkthrough

View your volumes to see what the new storage is labeled as
```
lsblk
```

View volume groups and logical volumes:
```
vgs
lvs
```

Physical volume is already there, you just need to initialize it (replace the * with whatever letter your new drive is):
```
pvcreate /dev/sd*
```

Extend the capture volume group to the new drive
```
vgextend captureVG /dev/sd*
```

Extend the logical volume to full size
```
lvextend -l +100%FREE -r /dev/captureVG/captureLV
```

All done. Enjoy the extra space you added to capture.
