---
title: "Failed To Locate Sfs"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Failed_to_Locate_SFS.md"
---

# QRadar SIEM: Update Error Failed to Locate the SFS Patch File
When running a patch, the error "ERROR: Failed to locate the SFS patch file at..." occurred. Pretty simple fix.

## Check if something is already mounted to /media/updates
```
df -h /media/updates
```

## Remove the mount
```
umount /media/updates
```

## Double check that something isn't mounted there still
```
df -h /media/updates
```

In my case, a previous patch wasn't unmounted. I had to run `umount /media/updates` twice before mounting the new patch.
