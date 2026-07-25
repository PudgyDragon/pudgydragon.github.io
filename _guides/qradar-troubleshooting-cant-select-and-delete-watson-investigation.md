---
title: "Delete Stuck Watson Investigations Using the API"
project: "QRadar"
category: "Troubleshooting"
description: "Delete IBM QRadar Watson investigations that cannot be removed through the user interface by using the built-in REST API."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Can't%20Select%20and%20Delete%20Watson%20Investigation"
---

## Introduction

Occasionally, a Watson investigation may become stuck in the QRadar with Watson application and cannot be selected or deleted through the graphical interface. Although the investigation remains visible, the application is unable to remove it normally.

This guide explains how to delete the investigation using the built-in REST API.

> **Symptoms**
>
> - A Watson investigation cannot be selected.
> - The **Delete** option is unavailable or does not function.
> - The investigation remains visible after repeated attempts to remove it.
> - The issue affects a single investigation while other investigations function normally.

## Cause

Under certain conditions, the QRadar with Watson application may lose the ability to manage an individual investigation through the user interface. The investigation itself still exists and can be removed through the REST API.

This method is intended for individual investigations that cannot be deleted through the application.

## Resolution

Navigate to:

**Admin** → **QRadar with Watson**

Select **API Docs**.

The API documentation page displays the available REST endpoints for the application.

Expand the following section:

```text
investigations -- Offense investigations and Watson searches
```

Locate the **DELETE** endpoint.

Select **Try it out**.

This enables the required input fields and displays the **Execute** button.

Enter the following information:

- **Offense ID** – The ID of the offense associated with the investigation.

Select **Execute**.

If the request completes successfully, the API returns an HTTP status code of:

```text
200 OK
```

The investigation should now be removed from the Watson application.

> **Note**
>
> This procedure deletes only the selected investigation. If multiple investigations are affected, repeat the process for each offense ID.

## Verification

After the API request completes:

- Verify the response returns **HTTP 200 OK**.
- Refresh the QRadar with Watson application.
- Confirm the investigation no longer appears.
- Verify other investigations remain unaffected.

## If the Problem Persists

If the investigation remains after receiving a successful response:

- Refresh the browser.
- Clear the browser cache if necessary.
- Verify the correct offense ID was supplied.
- Review the API response for any additional error messages.
- If multiple investigations are affected, repeat the procedure for each investigation individually.

## Additional Resources

- IBM QRadar with Watson API Documentation
- IBM QRadar REST API Documentation
