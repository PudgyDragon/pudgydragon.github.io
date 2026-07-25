---
title: "Resolve Application Errors When Grouping Searches"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve QRadar application errors caused by duplicate custom event property names that conflict with built-in event properties."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/ApplicationError.md"
---

# Introduction

QRadar may display application errors or fail to group search results when a custom event property shares the same name as a built-in event property.

This issue was encountered after importing custom DSM content from a third-party application. A custom event property named **Count** conflicted with QRadar's default **Count** property, preventing searches from grouping correctly.

Although this guide uses **Count** as the example, the same process can be used to resolve conflicts involving any duplicated event property.

> **Symptoms**
>
> - Application errors while grouping search results.
> - Searches fail when grouping by an event property.
> - Custom DSM content introduces event properties with names matching existing QRadar properties.

## Identify the Conflicting Event Property

Locate the custom event property in the QRadar database.

The following example searches for any property containing the word **Count**.

```bash
psql -U qradar -c "SELECT id, propertyname FROM ariel_regex_property WHERE propertyname ILIKE '%count%';"
```

Example output:

```text
 id | propertyname
----+--------------------
 42 | Count
 73 | Count
```

If multiple properties are returned, identify the custom property that conflicts with the built-in event property.

Record the **ID** of the custom property before continuing.

## Rename the Custom Event Property

Update the custom property's name so it no longer conflicts with the built-in property.

Replace `<property_id>` with the ID identified in the previous step.

```bash
psql -U qradar -c "UPDATE ariel_regex_property SET propertyname = 'System Event Count' WHERE id = '<property_id>';"
```

> **Note**
>
> Choose a descriptive name that clearly distinguishes the custom property from QRadar's default event properties.

## Restart Tomcat

Restart the QRadar Tomcat service to apply the change.

```bash
systemctl restart tomcat
```

Allow the service to fully initialize before testing.

## Verify the Resolution

After Tomcat has restarted:

- Clear the browser cache.
- Log back into the QRadar web interface.
- Repeat the search that previously generated the error.
- Verify that grouping now completes successfully.
- Confirm the renamed custom property appears with its new name.

## Additional Troubleshooting

If the issue persists:

- Verify that no additional custom properties use the same name.
- Review recently imported DSMs or content extensions for duplicate event properties.
- Repeat the database query using the affected property's name instead of **Count**.
- Restart Tomcat again if additional property changes were made.

## Additional Resources

- IBM QRadar Custom Event Properties documentation
- IBM QRadar DSM Editor documentation
