---
title: "Upgrading Security Analytics"
project: "Security Analytics"
category: "Engineering Guide"
description: "Preparing for and upgrading Broadcom Security Analytics using the official upgrade ISO."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/Upgrade.md"
---

## Introduction

This guide documents the process of upgrading **Broadcom Security Analytics** using the official upgrade ISO.

Broadcom maintains official upgrade documentation, but as Security Analytics approaches End of Life (EOL), documentation availability may change over time. This guide serves as a practical reference for performing upgrades and preserving operational knowledge learned during real-world deployments.

The official Broadcom Knowledge Base article is available here:

https://knowledge.broadcom.com/external/article/167794/upgrading-to-the-latest-version-of-secur.html

> **Important**
>
> Always review the release notes for your target version before upgrading. New releases may introduce additional prerequisites, deprecated features, or required intermediate upgrade paths.

> **Warning**
>
> If you have made custom operating system modifications—such as remapping network interfaces (for example, moving the management interface from `eth0` to another interface)—the upgrade process may restore the original operating system configuration. Be prepared to reapply any customizations after the upgrade.

> **Warning**
>
> Appliances using legacy licensing should verify licensing compatibility before upgrading. Certain legacy license types may be removed during the upgrade process and may not be recoverable without Broadcom assistance.

## Prerequisites

Before beginning:

- Verify the appliance is in a healthy operational state.
- Obtain the correct upgrade ISO for your target version.
- Verify the appliance has a current backup.
- Confirm you have console or out-of-band management access.
- Review the release notes for any version-specific requirements.

## Step 1 – Verify Available Disk Space

Ensure sufficient free space exists to stage the upgrade package.

A minimum of approximately **3 GB** of free space should be available in `/ds`.

Verify available disk space.

```bash
df -h
```

If necessary, remove old upgrade files before continuing.

## Step 2 – Remove Previous Upgrade Files

Delete any files remaining from previous upgrade attempts.

```bash
rm -rf /ds/upgrade/*
```

Removing previous extraction files helps prevent conflicts during the upgrade preparation process.

> **Note**
>
> If old ISO files are still stored under `/ds`, remove or archive them to free additional disk space.

## Step 3 – Stage the Upgrade ISO

Copy the upgrade ISO to the appliance.

For consistency, place the ISO in:

```text
/home
```

Verify the file has transferred successfully before continuing.

## Step 4 – Extract the Upgrade Package

Run the Broadcom upgrade utility.

```bash
run /etc/utils/solera-upgrade.sh /home/<upgrade.iso>
```

Example:

```bash
run /etc/utils/solera-upgrade.sh /home/atpsa-8.x.x-upgrade.iso
```

The script extracts the upgrade package and prepares the appliance for installation.

Depending on appliance performance and storage speed, this process may take several minutes.

## Step 5 – Reboot the Appliance

Once the extraction process completes successfully, reboot the appliance.

```bash
reboot
```

The upgrade itself is performed during the boot process.

Allow sufficient time for the appliance to complete the installation before attempting to reconnect.

> **Important**
>
> Do not interrupt power during the upgrade process. Depending on the version and appliance hardware, the first boot after an upgrade may take significantly longer than a normal reboot.

## Verification

After the appliance comes back online:

- Verify the web interface is accessible.
- Confirm users can authenticate successfully.
- Verify packet capture services have started.
- Confirm metadata collection is functioning.
- Verify all configured network interfaces are operational.
- Confirm system licensing is still valid.
- Review system health for any service failures.

## Post-Upgrade Tasks

Depending on your environment, you may need to:

- Reapply custom operating system modifications.
- Verify management interface assignments.
- Confirm remote syslog forwarding.
- Verify LDAP or Smart Card authentication.
- Validate scheduled backups.
- Review release notes for any manual post-upgrade steps.

## Troubleshooting

If the upgrade fails to start:

- Verify sufficient free disk space.
- Confirm the ISO is not corrupted.
- Verify the correct upgrade ISO was downloaded.

If networking is unavailable after the upgrade:

- Verify interface assignments.
- Confirm any custom network modifications were not reverted.
- Validate IP addressing and routing.

If licensing is missing after the upgrade:

- Verify the appliance licensing status.
- Contact Broadcom Support if legacy licensing is no longer recognized.

> **Field Note**
>
> The upgrade process itself is generally straightforward—the preparation is where most problems occur. Verifying disk space, confirming licensing, documenting custom operating system changes, and ensuring reliable backups before upgrading will save far more time than troubleshooting unexpected issues afterward.
