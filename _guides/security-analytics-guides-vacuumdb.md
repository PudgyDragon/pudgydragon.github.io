---
title: "Vacuuming PostgreSQL Databases"
project: "Security Analytics"
category: "Engineering Guide"
description: "Perform PostgreSQL database maintenance using vacuumdb as part of troubleshooting disk space issues on Broadcom Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/vacuumdb.md"
---

## Introduction

Broadcom Security Analytics relies on PostgreSQL to store various application data and system information. Over time, routine database activity can leave behind dead tuples that consume disk space and reduce database efficiency.

Running `vacuumdb` performs routine PostgreSQL maintenance by reclaiming space from deleted or updated records and updating optimizer statistics. While this is normal database maintenance, it can also be useful when troubleshooting situations where the `/var` filesystem is filling unexpectedly.

> **Important**
>
> Running `vacuumdb` does **not** reduce the size of every database file on disk. Instead, it reclaims space for future database use and improves database performance. If immediate disk space recovery is required, additional investigation may be necessary.

> **Warning**
>
> This procedure temporarily modifies PostgreSQL authentication settings to allow local maintenance operations. Be sure to restore the original configuration when finished.

## Prerequisites

Before beginning:

- Log in to the appliance as `root`.
- Ensure PostgreSQL is running normally.
- Schedule the maintenance during a maintenance window if possible.
- Record the original PostgreSQL authentication configuration before making changes.

## Step 1 – Modify PostgreSQL Authentication

Edit the PostgreSQL host-based authentication file.

```bash
vim /var/lib/pgsql/data/pg_hba.conf
```

Locate the following entry.

```text
local   all   postgres   peer
```

Temporarily change it to:

```text
local   all   postgres   trust
```

Save the file.

> **Warning**
>
> The `trust` authentication method allows local connections without requiring authentication. This change should only remain in place for the duration of the maintenance procedure.

## Step 2 – Restart PostgreSQL

Restart the PostgreSQL service so the authentication changes take effect.

```bash
systemctl restart postgresql
```

Verify the service restarted successfully before continuing.

## Step 3 – Vacuum All Databases

Run the PostgreSQL maintenance command.

```bash
vacuumdb --all --username=postgres --no-password
```

This command performs a standard vacuum operation against every PostgreSQL database on the appliance.

Depending on the size of the databases and appliance performance, the process may take several minutes to complete.

> **Field Note**
>
> This command performs a standard vacuum operation. It does **not** use `VACUUM FULL`, which requires significantly more time, locks tables during execution, and should generally only be performed when specifically required.

## Step 4 – Restore Authentication

After the vacuum completes, edit the PostgreSQL authentication file again.

```bash
vim /var/lib/pgsql/data/pg_hba.conf
```

Restore the original setting.

```text
local   all   postgres   peer
```

Save the file.

Restart PostgreSQL once more.

```bash
systemctl restart postgresql
```

## Verification

After completing the maintenance:

- Verify PostgreSQL is running normally.
- Confirm the authentication method has been restored to `peer`.
- Verify applications can connect successfully.
- Monitor `/var` usage to determine whether database maintenance improved the situation.

## Troubleshooting

If `vacuumdb` fails:

- Verify PostgreSQL is running.
- Confirm the authentication method was temporarily changed to `trust`.
- Review PostgreSQL logs for connection or permission errors.
- Ensure sufficient free disk space remains for normal database operation.

If `/var` continues to fill after running `vacuumdb`:

- Identify which directories are consuming space.
- Review application logs for abnormal growth.
- Verify no runaway processes are generating excessive log files.
- Confirm database growth is actually the source of the disk usage.

> **Field Note**
>
> `vacuumdb` is often recommended when troubleshooting PostgreSQL-related disk usage, but it should not be viewed as a universal fix for a full `/var` filesystem. Before running database maintenance, determine what is actually consuming the disk space. In many cases, large log files, core dumps, or other application data—not PostgreSQL itself—may be responsible.
