---
title: "Update Package 8 Interim Fix 3 Installation Issue"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve a patch-sensitive issue encountered while installing IBM QRadar 7.5 Update Package 8 Interim Fix 3."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/InterimFix3Issues.md"
---

## Introduction

During the installation of **IBM QRadar 7.5 Update Package 8 Interim Fix 3 (UP8 IF3)**, the installer may report unresolved patch-sensitive issues and refuse to continue.

This issue is similar to one that can occur during the RHEL 8 migration, but in this case the offending file was an archived `ariel_proxy` file located in the `/store/jheap` directory.

> **Applies To**
>
> IBM QRadar **7.5 Update Package 8 Interim Fix 3 (UP8 IF3)**

> **Symptoms**
>
> - The installer stops before the update begins.
> - The installer reports unresolved patch-sensitive issues.
> - The installation cannot proceed.

## Cause

The installer validates the system before applying the update. During validation, archived files within `/store/jheap` may be identified as patch-sensitive and prevent the installation from continuing.

An error similar to the following may be displayed:

```text
Cliniq has detected unresolved patch-sensitive issues.
You must resolve these issues before continuing.
```

## Resolution

Inspect the `/store/jheap` directory for archived files matching the `ariel_proxy` naming convention.

```bash
ls -lh /store/jheap/*ariel_proxy*
```

If the installer identifies an archived `ariel_proxy` file, remove the affected `.gz` file.

After removing the file, rerun the installer.

```bash
/media/updates/installer
```

> **Field Note**
>
> During our upgrade to **Update Package 8 Interim Fix 3**, removing the identified `ariel_proxy` archive allowed the installer to complete successfully without any additional remediation.

## Verification

Verify that:

- The installer no longer reports patch-sensitive issues.
- The update proceeds successfully.
- The installation completes without further errors.

## If the Problem Persists

If the installer continues to report patch-sensitive issues:

- Carefully review the installer output to identify the specific file causing the failure.
- Verify there are no additional files in `/store/jheap` reported by the installer.
- Refer to the **Upgrade to RHEL 8** troubleshooting guide if similar `ccpp-*` or other archived files are reported.

## Additional Resources

- IBM QRadar 7.5 Update Package 8 Interim Fix 3 Release Notes
- IBM QRadar Upgrade Documentation
