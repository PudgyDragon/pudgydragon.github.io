---
title: "Resolve Stuck Application Install or Uninstall Tasks"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve the QRadar error 'another preview/install/uninstall task is currently in process' by clearing stale application installation records."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Uninstall%20Preview%20Fix"
---

## Introduction

When installing or removing a QRadar application or Content Extension, the operation may fail with an error indicating another task is already in progress.

In some cases, a previous installation, preview, or uninstall operation does not exit cleanly, leaving a stale record in the QRadar database that blocks future operations.

> **Symptoms**
>
> - Application installation fails.
> - Application removal fails.
> - Content Extension installation cannot start.
> - The following error is displayed:
>
> ```text
> Another preview/install/uninstall task is currently in process.
> ```

## Cause

QRadar tracks application and Content Extension installation status within the `content_package` database table.

If an installation or removal operation terminates unexpectedly, the package status may never be updated to a completed state. As a result, QRadar believes another installation is still running and prevents new operations from starting.

## Resolution

> **Warning**
>
> This procedure modifies the QRadar PostgreSQL database. Always create a backup before making changes.

### Back Up the Database Table

Log in to the QRadar Console as the `root` user.

Create a directory to store the backup.

```bash
mkdir -p /store/IBM_Support
```

Back up the `content_package` table.

```bash
pg_dump -U qradar -t content_package --inserts \
-f /store/IBM_Support/content_package.sql-$(date +%F)
```

### Identify Stuck Content Packages

Query the database for packages that are not in a completed state.

```bash
psql -U qradar -c \
"SELECT hub_id, content_status, id
FROM content_package
WHERE content_status NOT IN (3,6,9);"
```

Review the output and identify the package ID that is preventing additional operations.

### Mark the Package as Uninstalled

Update the package status to **6 (Uninstalled)**.

```bash
psql -U qradar -c \
"UPDATE content_package
SET content_status = 6
WHERE id='<ID>';"
```

Replace `<ID>` with the package ID identified in the previous step.

### Verify the Database

Run the query again.

```bash
psql -U qradar -c \
"SELECT hub_id, content_status, id
FROM content_package
WHERE content_status NOT IN (3,6,9);"
```

The query should return no results.

### Retry the Installation

Clear your browser cache.

Log back in to the QRadar web interface and retry the application or Content Extension installation.

> **Field Note**
>
> Clearing the browser cache helps ensure the user interface reflects the updated package status after the database change.

## Verification

Verify the following:

- The `content_package` query returns no pending installation records.
- Applications can be installed successfully.
- Applications can be removed successfully.
- Content Extensions install without reporting another operation is already in progress.

## If the Problem Persists

If the error continues:

- Verify no other package IDs remain in a pending state.
- Confirm the database update completed successfully.
- Review the App Framework and QRadar logs for additional errors.
- If multiple package records are affected, investigate why installation tasks are not completing normally before modifying additional database entries.

## Additional Resources

- IBM Support: Installation or removal of an application fails with the error *"another preview/install/uninstall task is currently in process"*
