---
title: "Security Analytics STIG Reference"
project: "Security Analytics"
category: "STIG"
description: "Common Security Analytics settings that assist with meeting Network Device Management STIG requirements."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/STIG_2026.md"
---

## Introduction

This guide provides a reference for Security Analytics settings that commonly assist in meeting **Network Device Management STIG** requirements.

Many STIG controls are already implemented by Security Analytics out of the box. Rather than providing a complete STIG checklist, this guide highlights configuration areas that administrators should verify or customize to align with their organization's security policy.

> **Important**
>
> This guide is **not** a replacement for the official DISA STIG or your organization's security policy. Always validate configuration requirements against the current STIG release and any applicable organizational overlays.

> **Note**
>
> Most settings described in this guide are verification items rather than configuration changes. In many cases, Security Analytics already ships with secure defaults.

## Web Interface

Navigate to:

```text
Settings → Web Interface
```

Verify or configure the following settings.

| Setting | Recommended Value |
|----------|-------------------|
| Inactivity Timeout | 5 Minutes |
| Message of the Day | Organization-approved login banner |

> **Field Note**
>
> The login banner should comply with your organization's approved legal notification or DoD warning banner requirements.

## Communication Settings

Navigate to:

```text
Settings → Communication
```

### Syslog

Verify the following configuration.

```text
Enable Coalescing: Enabled
Syslog Facility: Syslog
Remote Syslog Server: <Your SIEM>
Protocol: TCP
```

### SNMP

If SNMP is required:

```text
Trap Server: <Your SNMP Server>
Port: 162
Authentication: Enabled
Read-Only Username: <SNMP User>
Authentication Password: <Password>
Privacy Password: <Password>
```

### Advanced

Under **Remote Syslog**, verify all required forwarding options are enabled.

> **Important**
>
> Organizations that prohibit SNMP should leave the service disabled rather than configuring unused credentials.

## Date and Time

Navigate to:

```text
Settings → Date & Time
```

Verify the following.

```text
Use NTP: Enabled
Primary NTP Server: <Primary Server>
Secondary NTP Server: <Optional>
Tertiary NTP Server: <Optional>
```

Accurate time synchronization is essential for log correlation, incident response, and forensic investigations.

## Security Settings

Navigate to:

```text
Settings → Security
```

### Web Access

```text
Maximum Login Attempts: 3
Require HTTPS: Enabled
Maximum Concurrent Sessions: 10
```

### Password Policy

Recommended values:

```text
Minimum Length: 15
Require Uppercase Characters
Require Lowercase Characters
Require Numbers
Require Special Characters
Password History: 10
```

### PKI and SSL

Configure:

- Appliance certificate
- Appliance private key
- Certificate Revocation List (CRL)

The CRL should reference the issuing Certificate Authority for the appliance certificate.

## System Settings

Navigate to:

```text
Settings → System
```

Generate a new SSH key pair.

Copy the public key to the remote backup server that will receive automated backups.

After establishing SSH trust, configure automated backups.

Example configuration:

```text
Backup Type:
Reference Configuration or Full System

Backup Frequency:
Weekly (or organizational policy)

Mandatory Backup Interval:
Monthly (or organizational policy)

Remote Host:
<Backup Server>

Remote Path:
<Backup Directory>

Remote Username:
<Backup User>
```

> **Field Note**
>
> Backup retention schedules and frequencies should always follow your organization's data retention policy rather than the examples shown above.

## FIPS Verification

Earlier releases of Security Analytics exposed an option to enable or disable FIPS mode.

Broadcom has since removed this capability. According to Broadcom Support, Security Analytics already uses FIPS-approved cryptographic algorithms by default.

You can verify the configured algorithms by reviewing:

```bash
cat /etc/environment
```

and

```bash
cat /etc/sysconfig/httpd
```

Compare the configured algorithms against your current FIPS requirements.

If organizational policy requires different cipher selections, update the configuration files as necessary and restart the affected services.

> **Warning**
>
> Modifying cryptographic settings should be validated in a non-production environment before deployment.

## Verification

After completing the configuration:

- Verify HTTPS is enforced.
- Confirm the login banner is displayed.
- Verify password complexity requirements.
- Confirm NTP synchronization.
- Verify remote syslog forwarding.
- Validate automated backups.
- Verify the appliance certificate is trusted.
- Confirm CRL retrieval succeeds.

## Additional Considerations

Security Analytics satisfies many STIG controls through its default configuration. Other controls, including firewall policy, network segmentation, account management, and centralized logging, depend on your organization's architecture and security requirements.

This guide focuses only on Security Analytics configuration and should be used alongside the official STIG documentation during compliance reviews.

> **Field Note**
>
> Compliance is rarely achieved through product configuration alone. Security Analytics is one component of a larger security architecture, and many STIG findings ultimately depend on enterprise policy, network design, identity management, and operational procedures.
