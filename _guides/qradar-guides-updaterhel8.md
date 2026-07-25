---
title: "Upgrade IBM QRadar to Update Package 8 (RHEL 8)"
project: "QRadar"
category: "Engineering Guide"
description: "Upgrade IBM QRadar 7.5 Update Package 7 to Update Package 8, including the RHEL 8 migration, prerequisite validation, troubleshooting, and post-upgrade verification."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/UpdateRHEL8.md"
---

## Introduction

IBM QRadar 7.5 Update Package 8 introduces one of the most significant upgrades in the QRadar 7.5 lifecycle by migrating the operating system from Red Hat Enterprise Linux 7 to Red Hat Enterprise Linux 8.

Although IBM provides official upgrade documentation, this guide focuses on the deployment process, prerequisite validation, and common issues encountered during production upgrades.

> **Last Verified**
>
> IBM QRadar 7.5 Update Package 8

> **Important**
>
> This guide supplements the official IBM documentation and should be used alongside the IBM release notes.

## Prerequisites

Before beginning the upgrade, verify the following:

- QRadar 7.5 Update Package 7 Interim Fix 6 is installed.
- Current configuration and data backups exist.
- A maintenance window has been scheduled.
- Console or hypervisor access is available.
- The Update Package 8 SFS image has been downloaded from IBM Fix Central.
- Physical or virtual console access is available if GRUB authentication has been configured.

## Verify the Required Kernel

Update Package 8 requires the kernel included with QRadar 7.5 Update Package 7 Interim Fix 6. Systems running an earlier kernel will not successfully complete the migration to RHEL 8.

Verify the installed kernel packages.

```bash
rpm -qa | grep kernel
```

Verify the running kernel on every appliance.

```bash
/opt/qradar/support/all_servers.sh "uname -a"
```

> **Important**
>
> The running kernel must report **105** before proceeding with the upgrade.

## Temporarily Remove GRUB Authentication

Many STIG-hardened deployments require authentication at the GRUB menu before the operating system can boot.

Because the Update Package 8 installer performs multiple reboots, temporarily removing GRUB authentication can eliminate unnecessary trips to the console during the upgrade.

Navigate to the GRUB configuration directory.

```bash
cd /boot/efi/EFI/redhat
```

Back up the current configuration.

```bash
cp user.cfg /home/stiguser/
```

Remove the active configuration.

```bash
rm user.cfg
```

Rebuild the GRUB configuration.

```bash
grub2-mkconfig -o /boot/efi/EFI/redhat/grub.cfg
```

Reboot the appliance.

```bash
reboot
```

Verify the appliance boots normally without prompting for GRUB authentication.

> **Field Note**
>
> During one upgrade, a server remained on a black screen after rebooting. The system required a hard power cycle through the management controller before the boot process continued.

## Upgrade Procedure

IBM provides complete release notes for Update Package 8.

https://www.ibm.com/support/pages/node/7032144

The following summarizes the deployment process.

### Create the Updates Directory

```bash
mkdir -p /media/updates
```

### Copy the Update Package

Copy the Update Package 8 SFS image to:

```text
/storetmp
```

### Mount the Update

```bash
cd /storetmp
```

```bash
mount -o loop -t squashfs \
750-QRADAR-QRSIEM-2021.6.8.20240302192142.sfs \
/media/updates
```

### Run the LEAPP Precheck

Before beginning the operating system migration, execute the LEAPP validation.

```bash
/media/updates/installer --leapp-only
```

Resolve all reported issues before continuing.

### Install Update Package 8

```bash
/media/updates/installer
```

When prompted, select:

```text
all
```

Allow the installer to complete all upgrade stages.

### Clean Up

Unmount the installation media.

```bash
umount /media/updates
```

After the upgrade completes:

- Clear the browser cache.
- Remove the SFS image from every appliance.

## Troubleshooting

### LEAPP Reports Patch-Sensitive Files

During testing, several appliances failed the LEAPP validation with an error similar to:

```text
Cliniq has detected unresolved patch-sensitive issues.

You must resolve these issues before continuing.

Remediation:
Remove the dump files to avoid issues during the upgrade.
```

The reported files were located in:

```text
/store/jheap
```

Specifically:

```text
ccpp-*
```

Delete only the directories identified by the installer.

After cleanup, rerun the installer.

```bash
/media/updates/installer
```

> **Field Note**
>
> Do not remove every file from `/store/jheap`. Delete only the files or directories specifically identified by the LEAPP validation.

### LEAPP Fails Because Root Login Is Disabled

On STIG-hardened deployments, the LEAPP validation may fail if direct root SSH login has been disabled.

Edit the SSH configuration.

```bash
vi /etc/ssh/sshd_config
```

Change:

```text
PermitRootLogin no
```

to:

```text
PermitRootLogin yes
```

Restart the SSH service.

```bash
systemctl restart sshd
```

Run the LEAPP validation again.

```bash
/media/updates/installer --leapp-only
```

> **Warning**
>
> Restore the original SSH configuration after the upgrade has completed to maintain compliance with your organization's security requirements.

## Verification

After the upgrade completes, verify the following:

- Every appliance upgraded successfully.
- The QRadar Console is accessible.
- Managed Hosts reconnect successfully.
- Deploy Changes completes without errors.
- Event collection resumes.
- Flow collection resumes.
- Installed applications start successfully.
- High Availability status is healthy, if applicable.
- Browser cache has been cleared.
- Temporary installation media has been removed.

Verify the operating system version.

```bash
cat /etc/redhat-release
```

Verify the running kernel.

```bash
uname -r
```

Verify all managed hosts are online.

```bash
/opt/qradar/support/all_servers.sh "hostname"
```

## Additional Resources

- IBM QRadar Update Package 8 Release Notes
- IBM Fix Central
- IBM QRadar Upgrade Documentation
- IBM QRadar STIG Implementation Guide
