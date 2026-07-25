---
title: "Legacy IBM QRadar STIG Implementation Guide"
project: "QRadar"
category: "STIG"
description: "Legacy STIG implementation procedures for IBM QRadar 7.5.0 Update 6. Preserved for historical reference and not intended for newer QRadar releases."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/STIG.md"
---

# Introduction

> **Legacy Documentation**
>
> This guide was written for **IBM QRadar 7.5.0 Update 6** and should not be used for newer QRadar releases.
>
> Configuration files, hardening behavior, recovery procedures, and IBM-supported implementation methods have changed since this guide was published. Applying these procedures to a newer release may create an unsupported configuration, prevent the appliance from booting, or require emergency recovery.
>
> For newer deployments, use the current **IBM QRadar STIG Implementation Guide**, which was last verified on **IBM QRadar 7.5 Update Pack 14 (UP14)**.

## Document Status

| Field | Value |
|---|---|
| Status | Legacy |
| Original QRadar Version | IBM QRadar 7.5.0 Update 6 |
| Original Publication Date | June 15, 2023 |
| Original Update Date | July 10, 2023 |
| Original Author | Christian L. Reyes, IBM Federal Sales Engineering |
| Supported for New Deployments | No |
| Purpose | Historical and educational reference |
| Superseded By | IBM QRadar STIG Implementation Guide for newer releases |

## Introduction

This guide preserves the original process used to implement Security Technical Implementation Guide requirements on **IBM QRadar 7.5.0 Update 6**.

The original procedures were provided by **Christian L. Reyes** of **IBM Federal Sales Engineering** and were republished with permission. The presentation has been modernized for GitHub, but the technical workflow remains tied to the QRadar version for which it was written.

This guide covers:

- Creating a non-root administrative account
- Running the IBM QRadar STIG hardening script
- Configuring AIDE
- Disabling packet forwarding on managed hosts
- Forwarding audit logs
- Applying BIOS and UEFI GRUB2 protections
- Configuring password aging for non-system accounts

> **Warning**
>
> This is not a current implementation guide. Do not use these procedures as a substitute for current IBM documentation, current DISA STIG content, or the newer guide in this repository.

## Original Author and Attribution

**Christian L. Reyes**  
IBM Federal Sales Engineering

- Original publication: June 15, 2023
- Original update: July 10, 2023
- Republished with permission

## Advisory

The original guide referenced IBM's QRadar guidance for highly secure environments but documented field experience in which portions of that guidance caused severe system disruption, including extended downtime and factory reinstallation.

GRUB2 modification was identified as a particularly high-risk part of the implementation. Recovery could require:

- Physical access to a hardware appliance
- A bootable QRadar installation USB
- Access to the rack, monitor, and keyboard
- Hypervisor console access for virtual appliances
- A mounted QRadar installation ISO
- Separate disaster-recovery procedures

> **Critical Warning**
>
> Incorrect GRUB2 configuration can prevent QRadar from booting. Do not perform the BIOS or UEFI procedures in this legacy guide on a newer QRadar release.

## Operational Impact

Before implementing the procedures documented in the original guide, administrators were expected to understand the following operational changes.

### Root Login

Direct root login is disabled by the STIG hardening process. Administrators must sign in with a non-root administrative account and elevate privileges with `sudo`.

### AIDE Maintenance

After AIDE is initialized, its baseline must be updated after changes such as:

- Software installation
- Software removal
- System configuration changes
- QRadar deployment actions

Failure to update the baseline can result in expected platform changes being reported as file-integrity violations.

### GRUB2 Authentication

The original implementation required authentication during every system boot. For physical deployments, this could require an administrator to be physically present at the appliance.

### Password Aging

Non-system accounts were required to use:

- A minimum password age of 1 day
- A maximum password age of 60 days

The administrative STIG account therefore required periodic password changes.

## Prerequisites

Complete the following preparation before beginning.

### Recovery Media

For a physical deployment:

1. Obtain the QRadar ISO appropriate for the original deployment.
2. Write it to a USB flash drive using Fedora Media Writer.
3. Confirm that the USB can boot on the target hardware.

For a virtual deployment:

1. Upload the appropriate QRadar ISO to a datastore accessible by the QRadar virtual machine.
2. Confirm that the ISO can be mounted through the hypervisor.
3. Confirm that console access is available without relying on SSH.

> **Legacy Note**
>
> The original guide referenced a QRadar 7.5.0 Update 4 ISO for recovery. That reference is preserved for historical accuracy and should not be treated as valid recovery guidance for newer releases.

### Backup Critical Data

Store backups outside QRadar, such as on a NAS or external storage device.

Preserve the following directories where applicable:

```text
/store/backup
/store/ariel/events
/store/ariel/flows
```

Check the size of each directory before and after copying it.

```bash
du -sh /store/backup
du -sh /store/ariel/events
du -sh /store/ariel/flows
```

Confirm that the copied data size matches the source before proceeding.

### Access Requirements

Confirm that you have:

- Root access before hardening
- Hypervisor or physical console access
- Current backups
- Recovery media
- A maintenance window
- A tested rollback or disaster-recovery procedure
- Network access between the Console and managed hosts

## Create a Non-Root Administrative User

The STIG hardening process prevents direct root login. Create a non-root account before running the hardening script.

The examples in this guide use `stiguser`. Replace it with an organization-approved username where appropriate.

### Create the Account

Sign in to the QRadar Console as `root`, then create the account.

```bash
useradd -c 'Admin User' -d /home/stiguser -m -s /bin/bash stiguser
passwd stiguser
```

### Review Existing Sudo Configuration

Check for uncommented `NOPASSWD` entries.

```bash
more /etc/sudoers | grep NOPASSWD
```

Review any returned entries before continuing.

### Grant Sudo Access

Create a dedicated sudoers file.

```bash
vi /etc/sudoers.d/stiguser
```

Add:

```text
stiguser ALL=(ALL) ALL
```

Save the file and validate its syntax.

```bash
visudo -cf /etc/sudoers.d/stiguser
```

> **Note**
>
> The original guide used `vi` keystrokes such as `i`, `Esc`, and `:wq!`. Those editor-specific instructions have been removed for readability, but the required configuration remains unchanged.

### Verify Privilege Elevation

Close the root session and sign in as `stiguser`.

Verify that the account can elevate to root.

```bash
sudo su -
```

Return to the non-root shell after verification.

```bash
exit
```

### Create and Distribute an SSH Key

Generate a 4096-bit RSA key pair.

```bash
ssh-keygen -b 4096 -t rsa
```

Copy the public key to each managed host.

```bash
ssh-copy-id stiguser@<managed-host-ip> -o StrictHostKeyChecking=no
```

Test the connection.

```bash
ssh stiguser@<managed-host-ip>
```

After validating access, return to the Console.

```bash
exit
```

## Run the STIG Hardening Script

Run the IBM-provided hardening script on the Console first, followed by each managed host.

> **Warning**
>
> This procedure reflects the behavior of QRadar 7.5.0 Update 6. Do not assume that the script location, options, or resulting configuration are valid for newer versions.

### Harden the Console

Sign in to the Console and elevate to root.

```bash
sudo su -
```

Change to the STIG utility directory.

```bash
cd /opt/qradar/util/stig/bin
```

Run the hardening script.

```bash
./stig_harden.sh -a
```

Verify that the script completes successfully, then reboot.

```bash
reboot
```

After the system returns:

1. Confirm that direct root login is denied.
2. Sign in as `stiguser`.
3. Confirm that `sudo` elevation still works.
4. Confirm that the QRadar user interface is available.

### Harden Managed Hosts

From the Console, connect to the managed host.

```bash
ssh stiguser@<managed-host-ip>
```

Elevate to root.

```bash
sudo su -
```

Run the hardening script.

```bash
cd /opt/qradar/util/stig/bin
./stig_harden.sh -a
```

Verify successful completion, then reboot the managed host.

```bash
reboot
```

Wait for the host to return, then reconnect from the Console.

```bash
ssh stiguser@<managed-host-ip>
```

Repeat this process for each managed host.

## Post-Hardening Configuration

The original guide required additional configuration after the hardening script completed.

### Modify the QRadar Firewall Update Script

Back up the original script.

```bash
cp /opt/qradar/bin/iptables_update.pl /home/stiguser/
```

Edit the active file.

```bash
vi /opt/qradar/bin/iptables_update.pl
```

Locate:

```text
INPUT ACCEPT [0:0]
```

Change it to:

```text
INPUT DROP [0:0]
```

Run the script.

```bash
/opt/qradar/bin/iptables_update.pl
```

> **Legacy Warning**
>
> Modifying IBM-owned scripts can be overwritten by updates and may place the system into an unsupported state. This step is preserved because it was part of the original Update 6 procedure, not because it is recommended for newer releases.

### Initialize AIDE

Create the initial AIDE database.

```bash
aide --init
```

Move the newly generated database into the active location.

```bash
mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
```

Update the database.

```bash
aide --update
```

Replace the active database with the updated baseline.

```bash
mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
```

> **Important**
>
> Recreate the AIDE baseline after software installations, removals, QRadar configuration changes, and deployment actions.

### Disable Packet Forwarding on Managed Hosts

Perform this section only on managed hosts.

Disable IPv4 forwarding immediately.

```bash
sysctl -w net.ipv4.ip_forward=0
```

Disable IPv6 forwarding immediately.

```bash
sysctl -w net.ipv6.conf.all.forwarding=0
```

Edit the persistent sysctl configuration.

```bash
vi /etc/sysctl.conf
```

Add:

```text
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0
```

Apply the settings.

```bash
sysctl -p
```

Verify them.

```bash
sysctl net.ipv4.ip_forward
sysctl net.ipv6.conf.all.forwarding
```

Expected values:

```text
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0
```

> **Correction Preserved During Revamp**
>
> The original guide contained the path `/eetc/sysctl.conf`. The corrected path is `/etc/sysctl.conf`.

### Forward Audit Logs to an Event Processor

The original guide configured `syslog-ng` to forward audit-related messages to an Event Processor.

Edit the configuration.

```bash
vi /etc/syslog-ng/syslog-ng.conf
```

Locate the `local4.info` area and add a remote destination.

```text
destination remote_audit { udp("<event-processor-ip>" port(514)); };
log { source(local); filter(local4_info); destination(remote_audit); };
```

Restart `syslog-ng`.

```bash
systemctl restart syslog-ng
```

Verify the service.

```bash
systemctl status syslog-ng
```

> **Security Note**
>
> The original procedure used UDP port 514. UDP syslog does not provide transport encryption or delivery assurance. Current deployments should use the transport and certificate configuration supported by the applicable QRadar release and organizational policy.

## Configure GRUB2 on BIOS Systems

> **Critical Warning**
>
> This procedure was written for BIOS-based QRadar 7.5.0 Update 6 systems.
>
> Incorrect GRUB2 changes can prevent the appliance from booting. Ensure that recovery media and direct console access are available before beginning. Do not use these steps on newer releases without version-specific IBM guidance.

### Back Up GRUB2

Create a backup archive.

```bash
tar -cvf /root/grub2backup.tar /etc/grub.d /etc/default/grub /boot/grub2
```

Verify the archive.

```bash
ls -l /root/grub2backup.tar
```

### Create a GRUB2 Password

Generate a PBKDF2 password hash.

```bash
grub2-mkpasswd-pbkdf2
```

Securely retain the generated hash for use in the following steps.

### Restrict Boot Entries

Edit the Linux menu-entry generator.

```bash
vi /etc/grub.d/10_linux
```

Locate `--unrestricted` and replace it with:

```text
--users stiguser
```

### Configure the GRUB2 Superuser

Edit:

```bash
vi /etc/grub.d/01_users
```

The original file resembled:

```sh
#!/bin/sh -e
cat << EOF
if [ -f \${prefix}/user.cfg ]; then
  source \${prefix}/user.cfg
  if [ -n "\${GRUB2_PASSWORD}" ]; then
    set superusers="root"
    export superusers
    password_pbkdf2 root \${GRUB2_PASSWORD}
  fi
fi
EOF
```

Change the superuser and password owner to `stiguser`.

```sh
set superusers="stiguser"
export superusers
password_pbkdf2 stiguser \${GRUB2_PASSWORD}
```

### Create `user.cfg`

Create the configuration file.

```bash
vi /boot/grub2/user.cfg
```

Add the generated password hash in the format expected by the original configuration.

### Rebuild the GRUB2 Configuration

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
```

Verify the configured superuser.

```bash
grep -iw "superusers" /boot/grub2/grub.cfg
```

### Copy the User Configuration to Recovery

The original guide referenced the recovery partition.

```bash
cp /boot/grub2/user.cfg /recovery/grub2/
```

> **Correction Preserved During Revamp**
>
> The original command used `/recover/grub2`. The expected recovery path was `/recovery/grub2`.

### Modify the Recovery GRUB2 Configuration

Edit:

```bash
vi /recovery/grub2/grub.cfg
```

Locate the `Normal System` and `Factory re-install` menu entries.

The original procedure instructed administrators to add user restrictions similar to:

```text
menuentry "Normal System" --users stiguser
menuentry "Factory re-install" --users root
```

Rebuild the recovery configuration.

```bash
grub2-mkconfig -o /recovery/grub2/grub.cfg
```

### Test the BIOS Configuration

Before rebooting:

- Confirm that physical or hypervisor console access is available.
- Confirm that recovery media is ready.
- Confirm that the GRUB2 credentials are known.
- Confirm that the maintenance window allows for recovery.

Reboot.

```bash
reboot
```

At the console:

1. Confirm that the boot process requests credentials.
2. Enter the configured GRUB2 username and password.
3. Confirm that the system boots normally.
4. Confirm SSH access.
5. Confirm access to the QRadar web interface.

> **Historical Inconsistency**
>
> The original guide configured `stiguser` as the GRUB2 superuser but later stated that the boot prompt would use `root`. This inconsistency is preserved here as a warning rather than silently selecting one behavior. Administrators working with the original release would have needed to validate the generated GRUB2 configuration before rebooting.

## Configure GRUB2 on UEFI Systems

> **Critical Warning**
>
> This procedure was written for UEFI-based QRadar 7.5.0 Update 6 systems. Do not use it on newer releases without supported version-specific instructions.

### Back Up the UEFI GRUB2 Configuration

```bash
tar -cvf /root/grub2backup.tar /etc/grub.d /etc/default/grub /boot/efi/EFI/redhat
```

Verify the archive.

```bash
ls -l /root/grub2backup.tar
```

### Create a GRUB2 Password

```bash
grub2-mkpasswd-pbkdf2
```

Securely retain the generated password hash.

### Restrict Boot Entries

Edit:

```bash
vi /etc/grub.d/10_linux
```

Locate the `CLASS` line and replace:

```text
--unrestricted
```

with:

```text
--users stiguser
```

### Configure the GRUB2 Superuser

Edit:

```bash
vi /etc/grub.d/01_users
```

The original file resembled:

```sh
#!/bin/sh -e
cat << EOF
if [ -f \${prefix}/user.cfg ]; then
  source \${prefix}/user.cfg
  if [ -n "\${GRUB2_PASSWORD}" ]; then
    set superusers="root"
    export superusers
    password_pbkdf2 root \${GRUB2_PASSWORD}
  fi
fi
EOF
```

Change the relevant lines to:

```sh
set superusers="stiguser"
export superusers
password_pbkdf2 stiguser \${GRUB2_PASSWORD}
```

### Create the UEFI `user.cfg`

```bash
vi /boot/efi/EFI/redhat/user.cfg
```

Add the generated GRUB2 password hash.

### Rebuild the UEFI GRUB2 Configuration

```bash
grub2-mkconfig -o /boot/efi/EFI/redhat/grub.cfg
```

Verify the password entry.

```bash
grep -iw grub2_password /boot/efi/EFI/redhat/user.cfg
```

Verify the superuser.

```bash
grep -iw "superusers" /boot/efi/EFI/redhat/grub.cfg
```

### Test the UEFI Configuration

Before rebooting, confirm direct console access and recovery readiness.

```bash
reboot
```

At the console:

1. Enter the configured GRUB2 username.
2. Enter the configured GRUB2 password.
3. Confirm that the appliance boots.
4. Confirm SSH access.
5. Confirm access to the QRadar web interface.

## Configure Password Aging for Non-System Accounts

The original procedure used UID and GID ranges from the platform's `/etc/login.defs` to distinguish user accounts from system accounts.

Example values from the original environment:

```text
# Min/max values for automatic UID selection in useradd
UID_MIN                    1000
UID_MAX                   60000

# System accounts
SYS_UID_MIN                 201
SYS_UID_MAX                 999

# Min/max values for automatic GID selection in groupadd
GID_MIN                    1000
GID_MAX                   60000

# System accounts
SYS_GID_MIN                 201
SYS_GID_MAX                 999
```

Review the active values on the appliance.

```bash
grep -E '^(UID_MIN|UID_MAX|SYS_UID_MIN|SYS_UID_MAX|GID_MIN|GID_MAX|SYS_GID_MIN|SYS_GID_MAX)' /etc/login.defs
```

Review local accounts.

```bash
cat /etc/passwd
```

> **Note**
>
> UID and GID classification can vary by distribution, appliance version, and locally created service accounts. Do not assume that every account with a UID greater than or equal to `1000` is an interactive user without reviewing its purpose.

### Identify Accounts with an Invalid Minimum Password Age

The original guide provided:

```bash
awk -F: '$4 < 1 {print $1 "" $4}' /etc/shadow
```

A more readable equivalent is:

```bash
awk -F: '$4 < 1 {print $1, $4}' /etc/shadow
```

For each applicable non-system account, configure a minimum password age of one day.

```bash
chage -m 1 stiguser
```

### Identify Accounts with an Invalid Maximum Password Age

The original guide provided:

```bash
awk -F: '$5 > 60 {print $1 "" $5}' /etc/shadow
```

A more readable equivalent is:

```bash
awk -F: '$5 > 60 {print $1, $5}' /etc/shadow
```

For each applicable non-system account, configure a maximum password age of 60 days.

```bash
chage -M 60 stiguser
```

### Check Account Database Consistency

```bash
pwck -rq
```

Review and resolve any reported duplicate UIDs or account database issues.

### Verify the Administrative Account

```bash
chage -l stiguser
```

Confirm that the minimum and maximum password ages match the intended policy.

## Verification

Because this is a legacy guide, verification should focus on documenting what the original implementation expected rather than treating these checks as proof of compliance on a current release.

### Administrative Access

Confirm that:

- Direct root SSH login is disabled.
- `stiguser` can sign in.
- `stiguser` can elevate with `sudo`.
- The Console can connect to managed hosts using the administrative account.

Example checks:

```bash
ssh stiguser@<managed-host-ip>
sudo -l
```

### STIG Hardening Script

Confirm that the script completed without reported errors on the Console and managed hosts.

Review relevant logs where available.

### AIDE

Confirm that the database exists.

```bash
ls -l /var/lib/aide/aide.db.gz
```

Run an integrity check if appropriate for the environment.

```bash
aide --check
```

### Packet Forwarding

On managed hosts, verify:

```bash
sysctl net.ipv4.ip_forward
sysctl net.ipv6.conf.all.forwarding
```

Expected values:

```text
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0
```

### Audit Log Forwarding

Confirm that `syslog-ng` is running.

```bash
systemctl status syslog-ng
```

Confirm that messages arrive at the configured Event Processor or external log receiver.

### GRUB2

Confirm that:

- The expected user is configured in the generated GRUB2 configuration.
- The password file exists.
- The appliance boots only after the intended authentication workflow.
- Recovery media remains available.

BIOS example:

```bash
grep -iw "superusers" /boot/grub2/grub.cfg
```

UEFI example:

```bash
grep -iw "superusers" /boot/efi/EFI/redhat/grub.cfg
```

### Password Aging

```bash
chage -l stiguser
pwck -rq
```

Confirm that the intended minimum and maximum ages are applied and that no account database errors remain.

### QRadar Platform Health

After all changes, verify:

- QRadar user interface access
- Console-to-managed-host communication
- Event and flow ingestion
- Deploy Changes functionality
- Application availability
- Backup completion
- Authentication
- System notifications
- HA status, if applicable

## Known Legacy Issues

This guide contains procedures that should be treated cautiously even in the historical context for which they were written.

### IBM-Owned Script Modification

Editing `/opt/qradar/bin/iptables_update.pl` can be overwritten by updates and may not be supported.

### Unencrypted Syslog

The original procedure used UDP port 514, which does not provide encryption or reliable delivery.

### GRUB2 Authentication at Every Boot

The original design could require hands-on intervention after every reboot, creating operational and availability risks.

### GRUB2 Username Inconsistency

The original BIOS instructions changed the superuser to `stiguser` but later referred to authenticating as `root`.

### Recovery Path Typo

The original guide referenced both `/recover/grub2` and `/recovery/grub2`. The revamped guide uses `/recovery/grub2`.

### Sysctl Path Typo

The original guide referenced `/eetc/sysctl.conf`. The revamped guide corrects this to `/etc/sysctl.conf`.

### Compliance Statement

The original guide concluded that the system was STIG compliant after the listed procedures. Completing a technical checklist alone does not establish compliance. Compliance also depends on:

- The applicable STIG release
- Findings and severities
- Organizational implementation statements
- Approved exceptions
- Manual checks
- Evidence
- Continuous monitoring
- Assessor or ISSO review

## Additional Resources

Use current sources when working with a supported QRadar deployment:

- IBM QRadar documentation for highly secure environments
- IBM QRadar STIG responsibilities and exceptions
- Current DISA STIG content
- Organization-specific security policy
- The current IBM QRadar STIG Implementation Guide in this repository

> **Final Reminder**
>
> This guide applies to the historical **IBM QRadar 7.5.0 Update 6** implementation described by the original author. It should not be used for newer QRadar versions.
