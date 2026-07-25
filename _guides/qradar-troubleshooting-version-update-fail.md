---
title: "Resolve Failed Yum Transaction Test During QRadar Version Upgrades (RHEL 7)"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve failed yum transaction test errors encountered during QRadar version upgrades on RHEL 7 appliances."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Version%20Update%20Fail"
---

## Introduction

During a QRadar version upgrade on **RHEL 7-based appliances**, the installer may fail during the package validation phase with a failed Yum transaction test.

This issue is caused by an incompatible `yum.conf` configuration and can prevent the upgrade from proceeding until corrected.

> **Version-Specific Issue**
>
> This troubleshooting guide applies **only to QRadar appliances running Red Hat Enterprise Linux 7 (RHEL 7)**.
>
> Systems that have already migrated to **RHEL 8** do **not** use this configuration and are not affected by this issue.

> **Symptoms**
>
> The upgrade fails with an error similar to the following:
>
> ```text
> [ERROR] (-i-testmode) sql pretest errored, halting.
> [6/9] Install & Upgrade Packages failed to complete successfully.
>
> Errors:
> Failed yum transaction test
> ```

## Cause

On some RHEL 7 systems, the `yum` configuration option `clean_requirements_on_remove` is enabled.

When this value is set to `1`, the QRadar upgrade package validation may fail during the Yum transaction test.

## Resolution

### Verify the Current Configuration

Display the current Yum configuration.

```bash
cat /etc/yum.conf
```

If the following setting is present, it is likely causing the issue.

```text
clean_requirements_on_remove=1
```

### Update the Configuration

Edit the Yum configuration file.

```bash
vim /etc/yum.conf
```

Change the setting from:

```text
clean_requirements_on_remove=1
```

to:

```text
clean_requirements_on_remove=0
```

Save the file.

If your deployment includes managed hosts, make the same change on each affected RHEL 7 appliance before continuing the upgrade.

> **Field Note**
>
> In distributed QRadar deployments, all managed hosts participating in the upgrade should have consistent `yum.conf` settings to avoid package validation failures during the upgrade process.

### Retry the Upgrade

After updating the configuration on all applicable hosts, rerun the QRadar upgrade.

## Verification

Verify the following:

- `clean_requirements_on_remove` is set to `0` on all RHEL 7 appliances.
- The Yum transaction test completes successfully.
- The QRadar upgrade proceeds past the package installation phase without errors.

## If the Problem Persists

If the upgrade continues to fail:

- Verify the configuration change was made on every managed host participating in the upgrade.
- Confirm no additional Yum configuration changes have been introduced by your organization.
- Review the upgrade logs for additional package dependency or repository errors.
- Verify that all required repositories are available and synchronized before rerunning the upgrade.

## Additional Resources

- IBM QRadar Upgrade Documentation
- IBM QRadar System Requirements
- Red Hat Enterprise Linux 7 Yum Documentation
