---
title: "Resolve Cisco ISE pxGrid Configuration Errors"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve Cisco ISE pxGrid application configuration errors caused by stale browser data when configuring the QRadar Cisco ISE pxGrid application."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Cisco%20ISE%20pxGrid%20Failed"
---

## Introduction

While configuring the Cisco ISE pxGrid application, you may encounter errors that prevent the application from saving its configuration. Although these messages appear to indicate an application or deployment problem, the underlying cause may simply be stale browser data.

This guide explains how to verify the issue and resolve it.

> **Symptoms**
>
> - **Failed to save QRadar settings - App Settings are already configured**
> - **Failed to save deployment settings - 'app_id'**
> - QRadar refuses to save Cisco ISE pxGrid configuration changes.
> - Configuration appears correct, but the application continues to return HTTP 400 errors.

## Cause

During application configuration, cached browser data may cause the Cisco ISE pxGrid application to submit outdated or invalid information. This can result in misleading configuration errors even though the application itself is functioning correctly.

## Resolution

Log in to the QRadar Console as the `root` user.

Locate the Cisco ISE pxGrid application ID.

```bash
/opt/qradar/store/recon ps
```

Identify the application instance for Cisco ISE pxGrid and note its ID.

View the application startup log.

```bash
tail -f /store/docker/volumes/qapp-<APP_ID>/log/startup.log
```

If the log repeatedly reports errors similar to:

```text
POST /app_settings/clusters HTTP/1.1" 400
POST /app_settings HTTP/1.1" 400
```

clear your web browser's cache.

After clearing the cache, close the browser, reconnect to the QRadar Console, and attempt the configuration again.

> **Field Note**
>
> This issue can easily be mistaken for an application, deployment, or API problem. In our case, several hours were spent reviewing logs and configuration before discovering that clearing the browser cache immediately resolved both errors.

## Verification

After clearing the browser cache:

- Reopen the QRadar web interface.
- Return to the Cisco ISE pxGrid application.
- Save the configuration again.
- Verify that the configuration completes without errors.
- Confirm the HTTP 400 messages no longer appear in the application log.

## If the Problem Persists

If the issue continues after clearing the browser cache:

- Verify you are configuring the correct Cisco ISE pxGrid application instance.
- Review the application startup log for additional errors.
- Confirm communication between QRadar and Cisco ISE.
- Verify the Cisco ISE certificates, service account, and pxGrid configuration are valid.
- Restart the application if configuration changes were recently made.

## Additional Resources

- IBM QRadar App Framework Documentation
- IBM QRadar Cisco ISE pxGrid Application Documentation
- Cisco Identity Services Engine (ISE) pxGrid Documentation
