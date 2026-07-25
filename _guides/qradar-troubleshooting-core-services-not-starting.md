---
title: "Resolve QRadar Core Services That Fail to Start After an Upgrade"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve IBM QRadar core services that fail to start after an upgrade due to disk utilization exceeding the supported threshold."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Core%20Services%20Not%20Starting"
---

## Introduction

After installing a QRadar update, you may find that several core services fail to start even though the upgrade itself completed successfully. One common cause is a filesystem exceeding the utilization threshold required for QRadar services to initialize.

This guide explains how to identify the affected partition, determine what is consuming disk space, and free enough space for the services to start successfully.

> **Symptoms**
>
> - Multiple QRadar core services fail to start after an upgrade.
> - The system appears healthy, but QRadar remains unavailable.
> - Services remain in a stopped or failed state after rebooting.
> - The upgrade completes successfully, but QRadar never becomes operational.

## Cause

QRadar requires sufficient free disk space before core services will initialize. If a critical partition exceeds the supported utilization threshold (approximately 95%), services such as **Hostcontext**, **Tomcat**, and various ECS services may fail to start.

In this case, accumulated core dump files consumed enough disk space to prevent the services from starting.

## Resolution

### Check Core Service Status

Begin by monitoring the startup process.

```bash
/opt/qradar/upgrade/util/setup/upgrades/wait_for_start.sh
```

If services continue to fail, verify available disk space.

```bash
df -Th
```

If a critical partition is at or above approximately **95% utilization**, determine what is consuming the available space.

### Identify Large Files

Temporarily bind the root filesystem.

```bash
mount -o bind / /media/cdrom
```

Navigate to the mounted filesystem.

```bash
cd /media/cdrom
```

Review directory sizes.

```bash
du -hs * | less
```

Locate any core dump files.

```bash
ls -l core.*
```

If necessary, gather system information before moving the files.

```bash
dmidecode -t system | less
```

### Move Core Dump Files

Create a directory for the collected core files.

```bash
mkdir -pv /store/ibm_support/<directory_name>
```

Move the core dump files.

```bash
mv -fv core.* /store/ibm_support/<directory_name>
```

> **Field Note**
>
> Rather than deleting the core dump files, move them to the `/store/ibm_support` directory. This preserves the files for future analysis while freeing space on the affected filesystem.

Verify that disk utilization has decreased.

```bash
df -Th
```

Unmount the temporary bind mount.

```bash
cd
umount /media/cdrom
```

Verify disk utilization once more.

```bash
df -Th
```

### Restart QRadar Services

Restart the Hostcontext service.

```bash
systemctl restart hostcontext
```

Verify the status of the primary services.

```bash
systemctl status hostcontext
```

```bash
systemctl status tomcat
```

```bash
systemctl status ecs-ec-ingress
```

```bash
systemctl status ecs-ec
```

```bash
systemctl status ecs-ep
```

Verify Tomcat connectivity.

```bash
/opt/qradar/bin/test_tomcat_connection.sh
```

## Verification

After moving the core dump files and restarting services:

- Verify the affected partition is below the critical utilization threshold.
- Confirm `hostcontext` is running.
- Confirm `tomcat` is running.
- Verify the ECS services have started successfully.
- Confirm `test_tomcat_connection.sh` completes successfully.
- Log in to the QRadar web interface and verify the Console loads normally.

## If the Problem Persists

If services still fail to start:

- Verify no other filesystems exceed the utilization threshold.
- Look for additional large files consuming disk space.
- Review the service logs for startup failures.
- Confirm no new core dump files are being generated due to another underlying issue.
- If services continue to fail, collect the contents of `/store/ibm_support` before opening a case with IBM Support.

## Additional Resources

- IBM QRadar Upgrade Documentation
- IBM QRadar Support Troubleshooting Guides
- IBM QRadar Service Management Documentation
