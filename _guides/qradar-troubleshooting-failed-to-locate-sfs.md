---
title: "Resolve 'Failed to Locate the SFS Patch File' During an Update"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve the 'Failed to locate the SFS patch file' error by removing stale mounts from the QRadar update directory."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Failed_to_Locate_SFS.md"
---

## Introduction

When installing a QRadar update, the installer may fail with an error similar to:

```text
ERROR: Failed to locate the SFS patch file at...
```

One common cause is that a previous update image is still mounted to `/media/updates`, preventing the new update package from being mounted.

> **Symptoms**
>
> - The installer reports **Failed to locate the SFS patch file**.
> - Mounting the new update package fails.
> - A previous update or patch was recently installed.

## Cause

QRadar mounts update packages to the `/media/updates` directory during the installation process. If a previous update was not properly unmounted, the existing mount prevents the new SFS image from being mounted.

## Resolution

### Verify the Current Mount

Check whether `/media/updates` is already mounted.

```bash
df -h /media/updates
```

If an existing mount is present, unmount it.

```bash
umount /media/updates
```

Verify the mount has been removed.

```bash
df -h /media/updates
```

If the directory is still mounted, repeat the unmount command until no filesystem is attached.

```bash
umount /media/updates
```

> **Field Note**
>
> During one upgrade, a previous update image had not been completely unmounted. Running `umount /media/updates` a second time removed the remaining mount, allowing the new SFS image to mount successfully.

After the mount has been removed, mount the new update package and continue the installation.

## Verification

Verify that:

- `/media/updates` is no longer mounted.
- The new SFS image mounts successfully.
- The QRadar update installer proceeds without reporting the SFS error.

## If the Problem Persists

If the error continues after unmounting `/media/updates`:

- Verify the SFS file exists and is not corrupted.
- Confirm the mount command references the correct SFS file.
- Ensure no other processes are using `/media/updates`.
- Verify sufficient disk space is available for the update.

## Additional Resources

- IBM QRadar Upgrade Documentation
- IBM QRadar Update Package Documentation
