---
title: "Interimfixupdateguide"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/InterimFixUpdateGuide.md"
---

# General Interim Fix Update Guide
Getting lazy and don't want to keep finding the guide for Interim Fixes when they come out so just doing a general one here. Skipping a few steps.

## Procedure
1. Download the software from IBM Fix Central
2. SSH into your Console as root
3. Create /media/updates directory if you don't have one
   - `mkdir -p /media/updates`
4. SCP the SFS file to `/storetmp`
5. Change directory to /storetmp
   - `cd /storetmp`
6. Mount the patch file
   - `mount -o loop -t squashfs /storetmp/<sfs_file> /media/updates`
7. Run patch installer
   - `/media/updates/installer`
8. Using the patch installer, select `all`

## Wrap-up
1. After the patch is complete, unmount using:
   - `umount /media/updates`
2. Clear browser cache
3. Delete SFS file from all appliances

## Verify Fix Number
You can run the following command to verify that all servers have been brought up to the Interim Fix you have applied:
```
/opt/qradar/support/all_servers.sh -C "/opt/qradar/bin/myver -v | grep Interim"
```
