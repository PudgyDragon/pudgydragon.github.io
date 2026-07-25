---
title: "Implement DISA STIGs on IBM QRadar"
project: "QRadar"
category: "STIG"
description: "Apply the DISA RHEL 8 and Central Syslog Server STIGs to IBM QRadar using field-tested implementation guidance and QRadar-specific exceptions."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/STIG_2025.md"
---

## Introduction

This guide provides a practical process for implementing the DISA RHEL 8 and Central Syslog Server STIGs on an IBM QRadar deployment. It supplements IBM documentation with field-tested configuration steps, QRadar-specific considerations, and operational notes intended to reduce the risk of service disruption.

> **Last Verified:** IBM QRadar 7.5 Update Pack 14 (UP14)

> **Warning:** STIG hardening changes authentication, boot, filesystem, kernel, audit, cryptographic, and network settings. An incorrect setting can prevent QRadar services from starting, interrupt communication between appliances, or make an appliance inaccessible. Complete this work during an approved maintenance window and confirm that current backups and recovery procedures are available.

## Advisory

IBM provides guidance for configuring QRadar in highly secure environments. During a production implementation, portions of the published procedure resulted in significant service disruption and ultimately required a factory reinstall. The process in this guide reflects the adjustments used to preserve QRadar functionality while addressing applicable STIG requirements.

Review the IBM guidance for background and release-specific updates, but validate every change against your deployment before applying it broadly:

- [QRadar configuration in highly secure environments](https://www.ibm.com/docs/en/qsip/7.5?topic=guide-qradar-configuration-highly-secure-environments)
- [STIG responsibilities and exceptions](https://www.ibm.com/docs/en/qsip/7.5?topic=guide-stig-responsibilities-exceptions)

> **Important:** This guide does not guarantee a fully clean STIG evaluation. QRadar requires documented exceptions and may produce findings that must be addressed through organizational procedures, marked not applicable, or accepted as open risks.

## Prerequisites

Before beginning:

- Schedule an approved maintenance window.
- Confirm that configuration and data backups are current and recoverable.
- Record the current system, SSH, mount, kernel, crypto-policy, and audit configurations.
- Confirm console or out-of-band access to every appliance.
- Identify the administrative user that will replace routine remote root access.
- Identify the centralized syslog destination and whether it accepts TCP 514 or TLS 6514.
- Obtain the applicable CA, host certificate, and private key files when TLS syslog is required.
- Document all HA pairs and the order in which they will be unpaired, hardened, and restored.

Update the CA trust material on the Console and every Managed Host before changing trust-dependent services. Place the required certificates in both locations:

```text
/etc/pki/ca-trust/source/anchors
/opt/qradar/conf/trusted_certificates
```

Apply the operating-system trust update after adding certificates:

```bash
update-ca-trust
```

## High-Availability Requirements

> **Warning:** Unpair every HA pair before running the QRadar STIG hardening script. Run the hardening process independently on both appliances, confirm that each appliance is operational, and then recreate the HA pair.

QRadar HA pairing may temporarily require remote root login. Keep `PermitRootLogin yes` on HA appliances until pairing is complete, and then return the setting to the approved post-hardening value.

See [Enabling remote root login for HA pairing in a STIG-hardened environment](https://www.ibm.com/docs/en/qsip/7.5?topic=qchse-enabling-remote-root-login-ha-pairing-in-stig-hardened-environment).

## Reboot Strategy

This guide retains reboot commands at the points used during validation. The reboot immediately after `stig_harden.sh` is mandatory. Other reboots can often be consolidated into a final reboot, but doing so increases the number of unvalidated changes applied at once.

> **Field Note:** Rebooting at each documented point is the more conservative approach. Consolidating optional reboots can reduce maintenance time, but requires careful verification after the final restart.

# RHEL 8 STIG

## Create an Administrative User

Create a named administrative account before disabling normal remote root access. Replace `pudgy` with the approved account name.

```bash
useradd pudgy
passwd pudgy
usermod -aG wheel pudgy
```

Create a dedicated sudoers file:

```bash
visudo -f /etc/sudoers.d/pudgy
```

Add the following entry:

```text
pudgy ALL=(ALL) ALL
```

Validate the sudoers configuration:

```bash
visudo -c
```

Create an SSH key pair from the administrative workstation and transfer the public key to the appliance:

```bash
ssh-keygen -b 4096 -t rsa
ssh-copy-id pudgy@X.X.X.X -o StrictHostKeyChecking=no
```

> **Security Note:** `StrictHostKeyChecking=no` is convenient during initial provisioning, but it bypasses host-key verification. Confirm the host fingerprint through an independent channel and remove this option from routine administration workflows.

Verify access before proceeding:

```bash
ssh pudgy@X.X.X.X
sudo -i
```

## Run the QRadar STIG Hardening Script

Start with the Console, then repeat the process on each unpaired Managed Host and HA appliance.

```bash
cd /opt/qradar/util/stig/bin
./stig_harden.sh -a
```

Reboot when the script completes or prompts for a restart:

```bash
reboot
```

After the appliance returns, confirm that QRadar services are available before continuing:

```bash
/opt/qradar/support/all_servers.sh -C -k /opt/qradar/support/validate_deployment.sh
```

## Remove Automatic tmux Configuration

The hardening script may configure automatic `tmux` behavior that is not desirable for normal administration. Remove the global configuration and profile script:

```bash
rm -f /etc/tmux.conf /etc/profile.d/tmux.sh
```

## Configure Remote Root Login

The required setting differs by appliance role:

- **Console:** `PermitRootLogin no`
- **Managed Host:** `PermitRootLogin prohibit-password`
- **HA appliance during pairing:** `PermitRootLogin yes`

Edit the SSH daemon configuration:

```bash
vim /etc/ssh/sshd_config
```

Configure the appropriate value:

```text
PermitRootLogin no
```

or:

```text
PermitRootLogin prohibit-password
```

Use the following temporarily on appliances that must be paired for HA:

```text
PermitRootLogin yes
```

Validate and restart SSH:

```bash
sshd -t
systemctl restart sshd
```

> **Important:** Keep an existing privileged session open while validating SSH changes. Confirm a second administrative login before closing the original session.

## Initialize AIDE

AIDE provides file-integrity monitoring required by the RHEL 8 STIG. Initialize the baseline database after hardening:

```bash
aide --init
mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
aide --update
mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
```

> **Operational Note:** Reinitialize or update the AIDE database after every QRadar software update so approved product changes are reflected in the integrity baseline.

Verify the database exists:

```bash
ls -lh /var/lib/aide/aide.db.gz
```

## Disable Packet Forwarding on Managed Hosts

Managed Hosts should not operate as routers. Disable IPv4 and IPv6 forwarding and apply the additional kernel restrictions below.

> **Warning:** Apply this section only to Managed Hosts. Do not disable packet forwarding on the QRadar Console using this procedure.

Apply the settings immediately:

```bash
sysctl -w net.ipv4.ip_forward=0
sysctl -w net.ipv6.conf.all.forwarding=0
sysctl -w kernel.dmesg_restrict=1
sysctl -w kernel.perf_event_paranoid=2
```

Add the persistent settings to `/etc/sysctl.conf`:

```bash
vim /etc/sysctl.conf
```

```text
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0
kernel.dmesg_restrict = 1
kernel.perf_event_paranoid = 2
```

Verify the active values:

```bash
sysctl net.ipv4.ip_forward
sysctl net.ipv6.conf.all.forwarding
sysctl kernel.dmesg_restrict
sysctl kernel.perf_event_paranoid
```

## Forward Audit and System Logs

Configure QRadar's bundled `syslog-ng` service to forward local logs to the designated Event Processor or centralized log destination.

### Option 1: TCP Syslog on Port 514

Edit the default configuration:

```bash
vim /opt/qradar/syslog-ng/syslog-ng.conf.default
```

Add or adapt the following configuration:

```text
destination remote_audit { tcp("X.X.X.X" port(514)); };
log { source(s_local); filter(authpriv); destination(remote_audit); };
log { source(s_local); filter(local_0_1_info); destination(remote_audit); };
log { source(s_local); filter(cron); destination(remote_audit); };
log { source(s_local); destination(remote_audit); };
```

### Option 2: TLS Syslog on Port 6514

Edit the same configuration file:

```bash
vim /opt/qradar/syslog-ng/syslog-ng.conf.default
```

Add or adapt the following configuration:

```text
destination remote_audit {
    network(
        "X.X.X.X"
        port(6514)
        transport(tls)
        tls(
            peer-verify(yes)
            cert-file("/opt/qradar/conf/trusted_certificates/host.cer")
            key-file("/root/host.key")
        )
    );
};
log { source(s_local); filter(authpriv); destination(remote_audit); };
log { source(s_local); filter(local_0_1_info); destination(remote_audit); };
log { source(s_local); filter(cron); destination(remote_audit); };
log { source(s_local); destination(remote_audit); };
```

The certificate and key must be owned by `root`. Apply restrictive permissions to the private key; use permissions appropriate for the certificate:

```bash
chown root:root /opt/qradar/conf/trusted_certificates/host.cer /root/host.key
chmod 644 /opt/qradar/conf/trusted_certificates/host.cer
chmod 600 /root/host.key
```

Validate and restart `syslog-ng`:

```bash
/opt/qradar/syslog-ng/sbin/syslog-ng --syntax-only -f /opt/qradar/syslog-ng/syslog-ng.conf.default
systemctl restart syslog-ng
systemctl status syslog-ng --no-pager
```

## Configure Filesystem Mount Options

Update `/etc/fstab` so each QRadar filesystem uses the applicable STIG-compatible mount options.

```bash
cp -a /etc/fstab /root/fstab.pre-stig
vim /etc/fstab
```

Use the following options as a reference and preserve the existing device, UUID, and filesystem fields from the appliance:

```text
/boot           xfs   nosuid,nodev                                              0 0
/boot/efi       vfat  nosuid,nodev                                              0 0
/home           xfs   defaults,nosuid,noexec,nodev                              0 0
/opt            xfs   defaults,noatime,nodev                                    0 0
/recovery       xfs   nosuid,nodev                                              0 0
/store          xfs   noatime,nodev                                             0 0
/storetmp       xfs   defaults,noatime,nodev,nosuid                             0 0
/tmp            xfs   rw,nosuid,nodev,noatime,attr2,inode64,logbufs=8,logbsize=256k,noquota  0 0
/transient      xfs   defaults,noatime,nodev,nosuid                             0 0
/var            xfs   defaults,noatime,nodev                                    0 0
/var/log        xfs   noatime,nodev,nosuid,noexec                              0 0
/var/log/audit  xfs   defaults,noatime,nodev,nosuid,noexec                     0 0
/var/tmp        xfs   defaults,nodev,noexec,nosuid                              0 0
```

> **QRadar Exception:** Do not apply `noexec` to `/tmp`. IBM verified that QRadar update prechecks require executable access to this filesystem. Adding `noexec` can cause update validation or installation to fail.

Validate the file before rebooting:

```bash
findmnt --verify --verbose
mount -a
findmnt -o TARGET,FSTYPE,OPTIONS
```

> **Warning:** An invalid `/etc/fstab` entry can prevent the appliance from booting. Do not reboot until `findmnt --verify` and `mount -a` complete without errors.

## Disable Unused Kernel Modules

Create modprobe rules that prevent the following unused modules from loading:

```bash
printf 'install cramfs /bin/false\nblacklist cramfs\n' > /etc/modprobe.d/cramfs.conf
printf 'install firewire-core /bin/false\nblacklist firewire-core\n' > /etc/modprobe.d/firewire-core.conf
printf 'install tipc /bin/false\nblacklist tipc\n' > /etc/modprobe.d/tipc.conf
printf 'install uvcvideo /bin/false\nblacklist uvcvideo\n' > /etc/modprobe.d/uvcvideo.conf
```

Confirm the files:

```bash
grep -R . /etc/modprobe.d/{cramfs,firewire-core,tipc,uvcvideo}.conf
```

## Configure Login Policies

Set the minimum local password length and SHA-512 cryptographic work factor:

```bash
vim /etc/login.defs
```

```text
PASS_MIN_LEN 15
SHA_CRYPT_MIN_ROUNDS 100000
```

Configure idle-session handling:

```bash
vim /etc/systemd/logind.conf
```

```text
StopIdleSessionSec=600
KillUserProcesses=no
```

Restart `systemd-logind` only after considering the effect on active sessions, or apply the change during the next reboot.

## Configure SSH Defaults

Update QRadar's persistent SSH defaults so appliance configuration regeneration does not overwrite the desired setting:

```bash
vim /opt/qradar/conf/ssh/sshd_config.defaults
```

```text
ClientAliveCountMax 1
```

Configure the strong random-number generator source:

```bash
vim /etc/sysconfig/sshd
```

```text
SSH_USE_STRONG_RNG=32
```

Validate the effective SSH configuration:

```bash
sshd -T | grep -E 'clientalivecountmax|permitrootlogin'
```

## Configure Audit Rules

Add monitoring for failed-login records:

```bash
printf '%s\n' '-w /var/log/faillock -p wa -k logins' > /etc/audit/rules.d/faillock.rules
```

Load and verify the audit rules:

```bash
augenrules --load
auditctl -l | grep faillock
```

## Disable the Debug Shell

Prevent the systemd debug shell from being enabled or started:

```bash
systemctl mask --now debug-shell.service
systemctl is-enabled debug-shell.service
```

The expected state is `masked`.

## Configure Kernel Boot Parameters

Back up the current GRUB configuration before making changes:

```bash
cp -a /etc/default/grub /root/grub.pre-stig
```

Edit `/etc/default/grub`:

```bash
vim /etc/default/grub
```

Ensure `GRUB_CMDLINE_LINUX` includes the required QRadar parameters and the following STIG parameters:

```text
GRUB_CMDLINE_LINUX="crashkernel=auto console=ttyS0,9600 console=tty1 rd.driver.blacklist=r8152,dvb-core r8152.blacklist=1 dvb-core.blacklist=1 vsyscall=none page_poison=1 slub_debug=P audit=1 audit_backlog_limit=8192 init_on_free=1 pti=on"
```

Apply the additional arguments to all installed kernels and rebuild GRUB:

```bash
grubby --update-kernel=ALL --args="vsyscall=none page_poison=1 slub_debug=P audit=1 audit_backlog_limit=8192 init_on_free=1 pti=on"
grub2-mkconfig -o /boot/grub2/grub.cfg
reboot
```

After rebooting, verify the active command line:

```bash
cat /proc/cmdline
```

## Protect the GRUB2 Boot Loader

Create a backup of the GRUB configuration:

```bash
tar -cvf /root/grub2backup.tar /etc/grub.d /etc/default/grub /boot/grub2
```

Set the GRUB password:

```bash
grub2-setpassword -o /boot/grub2/
```

Edit the Linux menu-entry template:

```bash
vim /etc/grub.d/10_linux
```

On the line beginning with `CLASS=`, replace `--unrestricted` with:

```text
--users bootuser
```

Edit the user configuration:

```bash
vim /etc/grub.d/01_users
```

Configure:

```text
set superusers="bootuser"
export superusers
password_pbkdf2 bootuser ${GRUB2_PASSWORD}
```

Rebuild GRUB and reboot:

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
reboot
```

> **Important:** Confirm the generated `/boot/grub2/grub.cfg` contains the expected user restrictions before rebooting. Incorrect GRUB syntax can prevent normal boot selection or recovery access.

## Configure the SSSD CA Trust Anchor

Add the trusted root CA certificate used for SSSD authentication to the SSSD CA database:

```bash
vim /etc/sssd/pki/sssd_auth_ca_db.pem
```

Paste the complete PEM-encoded root certificate into the file and save it. Confirm the certificate can be parsed:

```bash
openssl x509 -in /etc/sssd/pki/sssd_auth_ca_db.pem -noout -subject -issuer -dates
```

## Correct Executable Permissions

Search common executable paths for files that are writable by group or other users:

```bash
find -L /bin /sbin /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -perm /022 -exec ls -l {} \;
```

During validation, Evaluate-STIG identified the following files. Set them to mode `0755` when they exist and the permission change is appropriate for the installed QRadar build:

```bash
chmod 755 /bin/tnameserv
chmod 755 /bin/loginmsg
chmod 755 /sbin/ifup-local
chmod 755 /sbin/setkey
```

> **Caution:** Do not run a broad recursive `chmod` against system executable directories. Review every finding and change only the affected files.

## Configure Additional Kernel Parameters

Add the following settings to both the drop-in configuration and the main sysctl configuration used during validation.

```bash
vim /etc/sysctl.d/99-sysctl.conf
```

```text
kernel.dmesg_restrict = 1
kernel.perf_event_paranoid = 2
net.ipv4.conf.all.rp_filter = 1
```

```bash
vim /etc/sysctl.conf
```

```text
kernel.dmesg_restrict = 1
kernel.perf_event_paranoid = 2
net.ipv4.conf.all.rp_filter = 1
```

Apply and verify the configuration:

```bash
sysctl --system
sysctl kernel.dmesg_restrict kernel.perf_event_paranoid net.ipv4.conf.all.rp_filter
```

## Configure Account Lockout with faillock

Edit the faillock policy:

```bash
vim /etc/security/faillock.conf
```

Configure:

```text
deny = 3
fail_interval = 900
unlock_time = 0
silent
audit
even_deny_root
```

> **Warning:** `unlock_time = 0` requires administrative intervention to restore a locked account. Confirm that the organization has an approved recovery process and that console access is available before enabling this setting for root.

Review the effective configuration:

```bash
sed -e '/^[[:space:]]*#/d' -e '/^[[:space:]]*$/d' /etc/security/faillock.conf
```

## Configure USBGuard Audit Logging

Configure USBGuard to send events to the Linux audit subsystem:

```bash
vim /etc/usbguard/usbguard-daemon.conf
```

```text
AuditBackend=LinuxAudit
```

Restart and verify the service when USBGuard is enabled in the deployment:

```bash
systemctl restart usbguard
systemctl status usbguard --no-pager
```

## Configure Chrony

Verify that the approved NTP sources configured during installation remain present. Add or update the server entry as required:

```bash
vim /etc/chrony.conf
```

```text
server ntp.server.name iburst maxpoll 16
cmdport 0
```

`cmdport 0` disables remote command access to the chrony daemon.

Restart and validate time synchronization:

```bash
systemctl restart chronyd
chronyc sources -v
chronyc tracking
```

## Disable Additional Protocol and Storage Modules

Edit the blacklist configuration:

```bash
vim /etc/modprobe.d/blacklist.conf
```

Add:

```text
install atm /bin/false
install can /bin/false
install sctp /bin/false
install usb-storage /bin/false
```

Reboot to ensure the module restrictions are applied:

```bash
reboot
```

After rebooting, confirm the modules are not loaded:

```bash
lsmod | grep -E '^(atm|can|sctp|usb_storage)\b'
```

No output is expected unless an approved exception applies.

## Audit Cron Configuration

Add audit rules for root and privileged-user cron configuration:

```bash
vim /etc/audit/rules.d/cron.rules
```

```text
-w /etc/cron.d/ -p wa -k cronjobs
-w /var/spool/cron/ -p wa -k cronjobs
```

Load and verify the rules:

```bash
augenrules --load
auditctl -l | grep cronjobs
```

## Configure FIPS-Approved SSH Key Exchange and Ciphers

Edit the OpenSSH server crypto-policy backend:

```bash
vim /etc/crypto-policies/back-ends/opensshserver.config
```

Configure the approved key-exchange algorithms and ciphers:

```text
-oKexAlgorithms=ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group-exchange-sha256,diffie-hellman-group14-sha256,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
-oCiphers=aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes128-ctr
```

Reboot:

```bash
reboot
```

## Configure FIPS-Approved SSH MAC Algorithms

Replace the active OpenSSH MAC list with the approved algorithms:

```bash
sed -i -E 's/(-oMACs=)[^ ]*/\1hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256/' "$(readlink -f /etc/crypto-policies/back-ends/openssh.config)"
reboot
```

## Configure FIPS-Approved SSH Client Ciphers and MACs

Edit the OpenSSH crypto-policy backend:

```bash
vim /etc/crypto-policies/back-ends/openssh.config
```

Configure:

```text
Ciphers aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
```

Validate SSH syntax before restarting or rebooting:

```bash
sshd -t
reboot
```

> **Maintenance Note:** Product updates or changes to the system-wide crypto policy may overwrite files under `/etc/crypto-policies/back-ends`. Recheck these settings after every QRadar update.

## Restore HA Pairing

Before pairing HA appliances, confirm that both nodes temporarily use:

```text
PermitRootLogin yes
```

Pair the appliances and verify that the HA relationship becomes healthy. After pairing, return remote root login to the approved value:

```text
PermitRootLogin prohibit-password
```

or:

```text
PermitRootLogin no
```

Restart SSH after the change:

```bash
sshd -t
systemctl restart sshd
```

> **Operational Note:** QRadar commonly requires root communication between appliances during updates. If an update fails because of the hardened SSH setting, temporarily enable the required access during the approved maintenance window and disable it again after validation.

## RHEL 8 STIG Responsibilities and Exceptions

Review IBM's current list of customer responsibilities, known false positives, and product exceptions:

- [STIG responsibilities and exceptions](https://www.ibm.com/docs/en/qsip/7.5?topic=guide-stig-responsibilities-exceptions)

This implementation will not produce a completely clean evaluation in every environment. Work with the ISSO or security control assessor to:

- Mark supported findings as not applicable or not a finding when the required evidence exists.
- Document IBM-recognized product exceptions.
- Record compensating controls for settings that cannot be applied without affecting QRadar.
- Track any remaining open findings through the organization's risk-management process.

# Central Syslog Server STIG

## Enable Event and Flow Hashing

Enable Ariel data hashing to provide integrity verification for stored events and flows.

In the QRadar user interface, navigate to:

```text
Admin > System Settings > Ariel Database Settings
```

Enable:

```text
Flow Log Hashing
Event Log Hashing
```

Deploy changes when prompted.

## Configure Backup Retention

Configure QRadar backups to retain configuration and data according to organizational requirements.

Minimum examples used during validation:

- Non-SAMI environments: at least 7 days.
- SAMI environments: 5 years, when required by the governing policy.

Navigate to:

```text
Admin > System Configuration > Backup and Recovery > Configure > Configuration and Data Backups
```

Configure:

```text
Event and Flow Data
Backup Retention Period (Days)
```

> **Important:** Size local and remote backup storage for the selected retention period. A configured retention value does not guarantee compliance if capacity constraints cause backups to fail or be removed early.

## Configure Multifactor Authentication

Configure the approved authentication method according to organizational policy:

```text
Admin > Authentication > Authentication Module Settings
```

The exact implementation depends on the organization's identity provider, authentication module, and MFA architecture.

## Configure the QRadar Password Policy

Navigate to:

```text
Admin > Authentication > Local Password Policy Configuration
```

Configure:

```text
Minimum Password Length: 15
Use Complexity Rules: Enabled
Number of rules required: 4
Contain an Uppercase Character: Enabled
Contain a Lowercase Character: Enabled
Contain a Digit: Enabled
Not contain repeating characters: Enabled
Password History: Enabled
Unique password count: 8
Days before password will expire: 60
```

> **Note:** The fourth complexity rule can be satisfied by the additional policy controls available in the deployed QRadar version. Confirm the resulting policy against the exact STIG check text and organizational password standard.

## Provide Evidence of Audit Reduction

QRadar includes a system-monitoring dashboard that can be used as supporting evidence for audit-reduction and system-health checks.

Navigate to:

```text
Dashboard > System Monitoring > System Summary Dashboard
```

Capture the required evidence in accordance with the organization's assessment process.

## Monitor Storage Utilization

The 75-percent storage-utilization requirement is addressed through the RHEL 8 STIG implementation and QRadar system monitoring. Verify that disk notifications, system health monitoring, and operational response procedures are enabled.

Useful checks include:

```bash
df -h
/opt/qradar/support/all_servers.sh -C -k 'df -h'
```

## Verify UTC Time

Confirm that each QRadar appliance uses UTC as required by the organization's logging standard.

Navigate to:

```text
Admin > System and License Management > Systems
```

Right-click the appliance and select:

```text
View and Manage System > System Time
```

Also verify from the command line:

```bash
timedatectl
```

## Configure Account Lockout

QRadar does not provide a native option that leaves a GUI account locked indefinitely until an administrator explicitly unlocks it. A far-future block time can be used where the assessment accepts this as an effective indefinite lockout.

Navigate to:

```text
Admin > Authentication > General Authentication Settings > Lockout Management
```

Configure:

```text
Maximum Account Login Failures: 3
Account Login Failure Attempt Window: 15
Account Login Failure Block Time: 150119987579
```

The value above represents approximately 28,000 years and was used to approximate an administrator-reset requirement.

> **Caution:** Validate the accepted unit, maximum value, and user-recovery workflow in the installed QRadar version before using this setting. Document the implementation decision with the ISSO or assessor.

## Configure the DoD Notice and Consent Banner

Navigate to:

```text
Admin > Authentication > General Authentication Settings > Login Page
```

Configure:

```text
Login Message: Approved DoD Notice and Consent Banner
Require explicit consent of this message for login: Enabled
```

Use the exact banner text approved by the organization. Do not paraphrase a legally required notice.

## Configure Session Termination

Navigate to:

```text
Admin > Authentication > General Authentication Settings > Session Management
```

Configure the available idle and session controls to satisfy the organization-defined termination conditions. The operating-system idle-session configuration and QRadar web-session settings should be assessed together.

## Configure Event and Flow Retention

Set retention buckets according to event criticality, event or flow type, legal requirements, and the organization's retention policy.

For events:

```text
Admin > Data Sources > Events > Event Retention
```

For flows:

```text
Admin > Data Sources > Events > Flow Retention
```

Configure each retention bucket for the required period and confirm storage capacity supports the policy.

## Offload Backups to a Remote Server

Use a dedicated backup server to move QRadar backups off the appliance. The example below uses the administrative account `pudgy`; replace it with the approved service or administrative account.

### Prepare the Remote Backup Server

From each QRadar appliance, establish and verify the SSH trust relationship:

```bash
ssh pudgy@X.X.X.X -o StrictHostKeyChecking=no
exit
ssh-copy-id pudgy@X.X.X.X -o StrictHostKeyChecking=no
ssh pudgy@X.X.X.X
```

On the backup server, create and secure the destination directory:

```bash
sudo mkdir -p /backups/qradar
sudo chown -R pudgy:pudgy /backups/qradar
sudo chmod -R 755 /backups/qradar
```

> **Security Note:** Restrict the backup account and destination permissions according to organizational policy. Backup data may contain sensitive configuration, event, flow, and application information.

### Create the QRadar Backup Transfer Script

Create the following script on the Console and Event or Flow Processors, including applicable HA appliances:

```bash
vim /usr/bin/rsync_backup
```

```bash
#!/bin/bash
nohup /usr/bin/rsync -chavzP /store/backup/ pudgy@X.X.X.X:/backups/qradar/ &
```

Set the owner and permissions:

```bash
chown root:root /usr/bin/rsync_backup
chmod 755 /usr/bin/rsync_backup
```

> **Implementation Note:** A shared destination can cause filename collisions when multiple appliances use identical backup names. Consider a separate subdirectory for each QRadar host, such as `/backups/qradar/<hostname>/`.

### Configure App Host Backups

App Hosts use a different local backup directory. First, schedule the QRadar application-volume backup:

```bash
crontab -e
```

Add:

```cron
# Run the QRadar application-volume backup every night at midnight.
0 0 * * * /opt/qradar/bin/app-volume-backup.py backup
```

Create the transfer script:

```bash
vim /usr/bin/rsync_backup
```

```bash
#!/bin/bash
nohup /usr/bin/rsync -chavzP /store/apps/backup/ pudgy@X.X.X.X:/backups/qradar/ &
```

Set the owner and permissions:

```bash
chown root:root /usr/bin/rsync_backup
chmod 755 /usr/bin/rsync_backup
```

### Schedule Backup Offloading

Schedule the transfer for the approved day and time. The following example runs every Friday at 1:00 p.m. local system time:

```bash
crontab -e
```

```cron
# Offload QRadar backups every Friday at 13:00.
0 13 * * 5 /usr/bin/rsync_backup
```

Verify the crontab:

```bash
crontab -l
```

Manually test the script before relying on the schedule:

```bash
/usr/bin/rsync_backup
ps -ef | grep '[r]sync'
```

On the backup server, verify that files arrive and can be read:

```bash
find /backups/qradar -maxdepth 2 -type f -ls
```

> **Recommendation:** Add logging, error handling, host-specific destinations, and monitoring before using this example as a production backup workflow. Periodically perform a restore test; successful file transfer alone does not prove recoverability.

## Verification

Complete the following checks after hardening each appliance and again after the full deployment is restored.

### Verify Appliance and Deployment Health

```bash
/opt/qradar/support/all_servers.sh -C -k /opt/qradar/support/validate_deployment.sh
/opt/qradar/support/all_servers.sh -C -k 'systemctl --failed --no-pager'
```

Confirm that:

- The Console and all Managed Hosts are reachable.
- QRadar services are running.
- Event and flow ingestion has resumed.
- Offenses, searches, applications, and dashboards function normally.
- HA pairs are healthy and synchronized.

### Verify Authentication and SSH

```bash
sshd -t
sshd -T | grep -E 'permitrootlogin|clientalivecountmax'
```

Confirm that:

- The named administrative account can connect with SSH.
- `sudo` works as expected.
- Root login matches the approved appliance role.
- HA-required root access has been removed after pairing.

### Verify Filesystems and Kernel Settings

```bash
findmnt --verify --verbose
findmnt -o TARGET,FSTYPE,OPTIONS
sysctl --system
cat /proc/cmdline
```

Confirm that `/tmp` does not include `noexec` and that all other mount and kernel settings match the approved implementation.

### Verify Audit, AIDE, and Logging

```bash
auditctl -l
aide --check
systemctl status auditd --no-pager
systemctl status syslog-ng --no-pager
```

Generate a controlled test event and verify that it reaches the remote syslog destination.

### Verify Cryptographic and Time Settings

```bash
update-crypto-policies --show
sshd -T | grep -E 'kexalgorithms|ciphers|macs'
chronyc tracking
chronyc sources -v
```

### Verify Backups

Confirm that:

- QRadar creates local backups on schedule.
- App Host volume backups complete successfully.
- Remote `rsync` transfers complete.
- Backup files are retained for the required period.
- A documented restore test has succeeded.

### Run the STIG Assessment

Run the approved Evaluate-STIG or SCAP assessment process against each appliance. Review every result instead of automatically applying remediation. Compare findings with IBM's documented responsibilities and exceptions, and record all evidence and risk decisions in the organization's compliance system.

## Known Caveats and Maintenance Tasks

Recheck the following after every QRadar update or major configuration change:

- AIDE baseline and database.
- `/etc/fstab` mount options, especially `/tmp`.
- SSH daemon defaults and root-login settings.
- Files under `/etc/crypto-policies/back-ends`.
- GRUB kernel arguments and boot-loader protection.
- Audit rules and audit service health.
- `syslog-ng` forwarding configuration.
- Disabled kernel modules.
- HA pairing and synchronization.
- Backup schedules and remote transfer scripts.
- IBM's current STIG responsibilities and exceptions.

## Additional Resources

- [QRadar configuration in highly secure environments](https://www.ibm.com/docs/en/qsip/7.5?topic=guide-qradar-configuration-highly-secure-environments)
- [Enabling remote root login for HA pairing in a STIG-hardened environment](https://www.ibm.com/docs/en/qsip/7.5?topic=qchse-enabling-remote-root-login-ha-pairing-in-stig-hardened-environment)
- [STIG responsibilities and exceptions](https://www.ibm.com/docs/en/qsip/7.5?topic=guide-stig-responsibilities-exceptions)
- [DISA Cyber Exchange STIGs](https://public.cyber.mil/stigs/)
