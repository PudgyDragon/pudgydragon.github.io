---
title: "QRadar Watson Investigation Cleanup"
project: "QRadar"
category: "Engineering Guide"
description: "Delete Watson investigations from QRadar using the command line."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Delete%20All%20Watson%20Investigations"
---

## Introduction

IBM QRadar Advisor with Watson stores investigations within its application database. During SIEM tuning or testing, a large number of investigations can accumulate over time, making them difficult to manage through the web interface. In some cases, attempting to delete thousands of investigations from the GUI can result in poor performance or browser instability.

This guide documents how to remove Watson investigations directly from the application's SQLite database using the command line.

## Advisory

- This procedure permanently deletes investigation data.
- Ensure you are authorized to perform this action in your environment.
- Consider backing up the application data before making changes.
- Verify that the investigations are no longer required before proceeding.

## Locate the Watson Application

Log in to the QRadar Console as the `root` user.

Identify the Watson application ID:

```bash
/opt/qradar/support/recon ps
```

Locate the Watson application in the output and note its **Application ID**.

> **Note:** The examples below use **1111** as the application ID. Replace this value with the ID from your environment.


## Delete All Investigations

Connect to the Watson application:

```bash
/opt/qradar/support/recon connect 1111
```

Navigate to the application database:

```bash
cd /opt/app-root/store
```

Open the SQLite database:

```bash
sqlite3 big.sqlite3
```

Delete all investigations:

```sql
DELETE FROM investigations;
```

## Delete Investigations by Time

To remove investigations while retaining a specific timestamp, use a SQL `WHERE` clause.

Example:

```sql
DELETE FROM investigations
WHERE analysis_time != <epoch_time>;
```

Replace `<epoch_time>` with the epoch timestamp of the investigation you want to retain.

## Verification

After deleting the investigations:

- Exit the SQLite shell.
- Refresh the QRadar Advisor with Watson application.
- Verify that the expected investigations have been removed.
