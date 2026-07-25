---
title: "Troubleshooting Follow TCP Stream Failures"
project: "Security Analytics"
category: "Troubleshooting"
description: "Resolve Follow TCP Stream failures caused by an unexpected duplicate /pfs directory."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Troubleshoot/Follow_TCP_Stream_Issues.md"
---

## Introduction

The **Follow TCP Stream** feature within **Packet Analyzer** reconstructs captured TCP conversations from stored packet data. If the underlying packet storage is inaccessible or incorrectly structured, the feature may fail to display stream data even though packets are successfully captured.

During one deployment, I encountered an unusual filesystem issue after installation and storage configuration. The `/pfs` directory unexpectedly contained another `/pfs` directory within itself, preventing **Follow TCP Stream** from functioning correctly.

This guide documents the symptoms, verification steps, and resolution that restored normal Packet Analyzer functionality.

> **Important**
>
> This issue appears to be uncommon and may not occur in every deployment. Verify the filesystem structure carefully before making any changes.

> **Warning**
>
> Do **not** remove directories unless you have confirmed they are unintended duplicates. Deleting the wrong directory could result in loss of packet data or require rebuilding packet storage.

## Symptoms

You may observe one or more of the following:

- **Follow TCP Stream** produces no output.
- Packet captures appear normal.
- Searches return expected packets.
- Other Packet Analyzer functions continue to operate normally.
- No obvious application errors are reported.

## Step 1 – Verify the Packet Filesystem

Log in to the appliance as `root`.

Navigate to the packet storage directory.

```bash
cd /pfs
```

List the directory contents.

```bash
ls -l
```

A normal installation should resemble:

```text
flows
packets
```

If you instead observe something similar to:

```text
flows
packets
pfs
```

then an unexpected duplicate directory may exist.

## Step 2 – Verify the Duplicate Directory

Inspect the unexpected directory before removing it.

For example:

```bash
ls -l /pfs/pfs
```

Confirm that the directory is not part of your intended storage layout.

> **Important**
>
> Compare the directory structure with a known-good Security Analytics appliance whenever possible before making changes.

## Step 3 – Remove the Duplicate Directory

If you have confirmed the nested `/pfs` directory is unintended, remove it.

```bash
rmdir /pfs/pfs
```

This command removes the duplicate directory only if it is empty.

If the directory contains files, stop and investigate further before deleting anything.

## Step 4 – Reboot the Appliance

After removing the duplicate directory, reboot the appliance.

```bash
reboot
```

Allow the appliance to complete startup before testing Packet Analyzer again.

## Verification

After the appliance has restarted:

- Open **Packet Analyzer**.
- Locate a TCP session.
- Select **Follow TCP Stream**.
- Verify the TCP conversation is reconstructed successfully.
- Confirm packet searches continue to function normally.

## Troubleshooting

If **Follow TCP Stream** still does not function:

- Verify the duplicate directory was actually removed.
- Confirm packet storage is mounted correctly.
- Verify both the `flows` and `packets` directories exist.
- Compare the `/pfs` directory structure against a known-good appliance.
- Review application and system logs for storage-related errors.

> **Field Note**
>
> This issue was discovered after installing Security Analytics and creating new storage partitions. Comparing the appliance against another working deployment quickly revealed that `/pfs` had somehow become nested inside itself. Removing the unintended directory and rebooting immediately restored **Follow TCP Stream** functionality. Although I never determined what caused the duplicate directory to be created, documenting the symptom and resolution may save someone else a considerable amount of troubleshooting time.
