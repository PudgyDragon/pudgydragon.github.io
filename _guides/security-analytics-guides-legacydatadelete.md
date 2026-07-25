---
title: "Removing Legacy Metadata Before Upgrading to Security Analytics 8.4.1"
project: "Security Analytics"
category: "Engineering Guide"
description: "Remove legacy metadata that blocks upgrades to Broadcom Security Analytics 8.4.1."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/legacydatadelete.md"
---

## Introduction

Beginning with **Broadcom Security Analytics 8.4.1**, legacy metadata is no longer supported. Appliances containing older metadata must either allow that data to age out naturally or remove it manually before the upgrade can proceed.

If waiting for the retention period is not practical, Broadcom provides a supported procedure for manually removing the legacy metadata.

The official Broadcom Knowledge Base article can be found here:

https://knowledge.broadcom.com/external/article?articleNumber=444332

This guide provides a streamlined version of that procedure for administrators who simply need to prepare an appliance for upgrading to **Security Analytics 8.4.1**.

> **Important**
>
> This procedure applies specifically to upgrades to **Security Analytics 8.4.1** where legacy metadata is present. It should not be performed as part of routine maintenance.

> **Warning**
>
> This procedure permanently deletes historical flow metadata. The deleted data cannot be recovered. Ensure any required investigations, exports, or backups have been completed before proceeding.

## Prerequisites

Before beginning:

- Verify the appliance contains legacy metadata.
- Confirm the appliance is being prepared for an upgrade to **Security Analytics 8.4.1**.
- Ensure no users are actively relying on historical flow data.
- Log in to the appliance as the `root` user.

## Step 1 – Stop Required Services

Stop the services that access the legacy metadata.

```bash
service monit stop
service solera-gaugefs stop
```

Stopping these services prevents files from being modified while the metadata is being removed.

## Step 2 – Remove the Legacy Metadata

Delete the legacy flow metadata.

```bash
nohup rm -rf /pfs2/flows &
```

Using `nohup` allows the deletion process to continue even if the SSH session disconnects.

> **Warning**
>
> Verify the command exactly as shown before pressing Enter. The `rm -rf` command permanently deletes data and cannot be undone.

## Step 3 – Monitor Progress

Depending on the amount of stored data, the deletion process may take anywhere from several hours to several days.

Periodically verify whether the directory still exists.

```bash
ls -ld /pfs2/flows
```

or

```bash
du -sh /pfs2/flows
```

Continue monitoring until the directory has been completely removed.

## Step 4 – Restart Services

Once the legacy metadata has been successfully removed, restart the monitoring service.

```bash
service monit start
```

## Verification

Before proceeding with the upgrade:

- Verify the `/pfs2/flows` directory has been removed.
- Confirm `monit` is running normally.
- Ensure no unexpected service errors are present.
- Verify the appliance is ready to begin the **8.4.1** upgrade.

## Troubleshooting

If the deletion appears to stop making progress:

- Verify the deletion process is still running.
- Confirm sufficient system resources are available.
- Ensure the filesystem is not reporting errors.
- Review the Broadcom Knowledge Base article for additional guidance if necessary.

> **Field Note**
>
> The amount of time required to complete this procedure depends entirely on the amount of retained metadata. Small deployments may complete within a few hours, while appliances with long retention periods can require significantly more time. Plan accordingly before scheduling the upgrade.
