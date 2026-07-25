---
title: "Resolve QRadar Apps Missing from the Dashboard"
project: "QRadar"
category: "Troubleshooting"
description: "Restore IBM QRadar applications that are missing from the dashboard by restarting app instances with the qappmanager support utility."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Apps%20Not%20on%20Dashboard"
---

# Introduction

Applications may occasionally disappear from the **Apps** dashboard or fail to load correctly after an upgrade, deployment, or unexpected application failure. In many cases, the application instance has entered an **ERROR** state and must be restarted before it becomes available again.

This guide explains how to use the IBM `qappmanager` support utility to identify, stop, and restart failed application instances.

> **Symptoms**
>
> - One or more applications are missing from the **Apps** dashboard.
> - An application fails to load or displays an error.
> - Applications remain unavailable after an upgrade or deployment.
> - QRadar Assistant or other installed applications fail to start.

## Cause

QRadar applications run as individual application instances managed by the App Framework. If an application encounters an unexpected error during startup or runtime, it may enter an **ERROR** state.

Applications in this state will not appear or function correctly until they have been restarted.

IBM provides additional information about the `qappmanager` utility here:

https://www.ibm.com/support/pages/qradar-about-qappmanager-support-utility

## Resolution

Log in to the QRadar Console as the `root` user.

Launch the `qappmanager` support utility.

```bash
/opt/qradar/support/qappmanager
```

### Stop Failed Application Instances

From the menu, select:

```text
24 - App instance --stop
```

When prompted, select an **Authorized Service**.

> **Field Note**
>
> Any Authorized Service with administrative privileges can be used. In most environments, **QRadar Assistant** is a convenient choice because it already has the required administrative permissions.

A list of application instances will be displayed.

Locate any applications whose **State** is:

```text
ERROR
```

Enter the ID of the application to stop it.

Repeat this process for every application reporting an **ERROR** state.

> **Note**
>
> After stopping an application, the utility returns to the main menu. Select **Option 24** again for each additional application that must be stopped. You will not typically be prompted to select an Authorized Service again during the same session.

### Start the Applications

After all failed applications have been stopped, return to the main menu and select:

```text
23 - App instance --start
```

Enter the ID of each application you previously stopped.

Repeat until every affected application has been restarted.

### Monitor Application Status

To view the current status of every application instance, select:

```text
20 - App instance --list all
```

Wait for each application to complete its startup sequence.

> **Field Note**
>
> Larger applications may take several minutes to initialize. Avoid repeatedly stopping and starting an application while it is still starting.

## Verification

After the applications have restarted:

- Refresh the QRadar web interface.
- Confirm the missing applications appear in the **Apps** dashboard.
- Verify each application opens successfully.
- Confirm no application instances remain in an **ERROR** state.
- Use **Option 20** to verify all application instances report a healthy status.

## If the Problem Persists

If an application immediately returns to an **ERROR** state after restarting:

- Review the application's log files for startup failures.
- Check the QRadar notification messages for related errors.
- Verify the application is compatible with your current QRadar version.
- Restart only after the underlying issue has been resolved.

## Additional Resources

- IBM QRadar qappmanager Support Utility
- IBM QRadar App Framework Documentation
- IBM QRadar Assistant Documentation
