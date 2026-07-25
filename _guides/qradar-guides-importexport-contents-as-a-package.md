---
title: "Export and Import QRadar Content Packages"
project: "QRadar"
category: "Engineering Guide"
description: "Export and import custom QRadar content, including reports, DSMs, rules, and reference data, using the Content Management Tool."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/ImportExport_Contents_as_a_Package.md"
---

## Introduction

The QRadar Content Management Tool provides a method for exporting and importing custom content as reusable packages. This is useful when migrating content between deployments, backing up customizations, or transferring content between development, testing, and production environments.

This guide demonstrates how to:

- Export custom content as a package
- Import previously exported packages
- Search for individual content objects before exporting
- Export either specific objects or entire content types

## References

IBM provides documentation for the basic export and import procedures.

- Exporting Content as a Package
  - https://www.ibm.com/docs/en/qsip/7.5?topic=editor-exporting-contents-as-package
- Importing Content Using the Content Management Tool
  - https://www.ibm.com/docs/en/qsip/7.5?topic=content-importing-by-using-management-script

This guide expands on those procedures by demonstrating how to export individual objects, including reports, DSMs, and other custom content.

## Launch the Content Management Tool

Connect to the QRadar Console using SSH.

Launch the Content Management Tool.

```bash
/opt/qradar/bin/contentManagement.pl
```

The tool displays the available content types and their associated identifiers.

Example output:

| Content Type | Content String |
|---------------|----------------|
| Dashboard | dashboard |
| Reports | report |
| Saved Searches | search |
| Custom Rules | customrule |
| Custom Properties | customproperty |
| Log Sources | sensordevice |
| Log Source Types | sensordevicetype |
| Log Source Categories | sensordevicecategory |
| DSM Extensions | deviceextension |
| Reference Data Collections | referencedata |
| Historical Correlation Profiles | historicalsearch |
| Custom Functions | custom_function |
| Custom Actions | custom_action |
| Applications | installed_application |

## Search for Content

If you only need to export specific objects, search the appropriate content type first.

For example, to list every report:

```bash
/opt/qradar/bin/contentManagement.pl \
-a search \
-c 10 \
-r "(.*?)"
```

> **Note:** The numeric content type identifier (`-c`) corresponds to the content type displayed by the Content Management Tool.

The search results include the object IDs required when creating an export package.

## Create an Export Definition

Create a text file that defines the content to export.

```bash
vi reportexport.txt
```

The export definition uses the following format.

Export specific objects:

```text
sensordevicetype,24,26,95
```

Export all objects for a content type:

```text
sensordevicetype,all
```

The first value identifies the content type.

The remaining values specify either:

- Individual object IDs
- `all` to export every object of that content type

Save the file when complete.

## Export the Package

Export the package using the definition file.

```bash
/opt/qradar/bin/contentManagement.pl \
-a export \
-c package \
-f reportexport.txt
```

The export creates a compressed package in the current directory.

Example:

```text
reportexport-ContentExport-20260724101500.tar.gz
```

## Transfer the Package

Transfer the package to another system using your preferred file transfer method.

Common options include:

- WinSCP
- SCP
- SFTP

After verifying the export, remove any temporary files if they are no longer needed.

```bash
rm reportexport.txt
```

## Import a Package

Copy the exported package to the destination QRadar Console.

Import the package.

```bash
/opt/qradar/bin/contentManagement.pl \
--action import \
-f reportexport-ContentExport-20260724101500.tar.gz
```

Replace the filename with the package being imported.

## Verification

After importing the package:

- Verify the Content Management Tool completes without errors.
- Confirm the imported objects appear in the QRadar user interface.
- Validate any dependencies, such as DSMs, custom properties, or reference data.
- If importing rules or reports, verify they function as expected.

## Additional Resources

- IBM QRadar Content Management Documentation
- IBM QRadar Administration Guide
