---
title: "Configuring Smart Card Authentication"
project: "Security Analytics"
category: "Engineering Guide"
description: "Configure LDAP and Smart Card authentication for Broadcom Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/SmartCardAuth.md"
---

## Introduction

This guide documents the process of configuring **Smart Card authentication** for Broadcom Security Analytics using LDAP over SSL/TLS.

Although Broadcom provides documentation for LDAP authentication, documentation covering Smart Card authentication is limited. This guide summarizes the configuration that successfully enabled Smart Card authentication in our environment.

> **Important**
>
> Smart Card implementations vary between organizations. The LDAP settings and certificate requirements shown in this guide should be treated as a working template rather than a one-size-fits-all configuration.

> **Note**
>
> This guide assumes that LDAP over SSL/TLS is already functioning within your environment and that your Certificate Authority (CA) hierarchy is available.

## Prerequisites

Before beginning, ensure you have:

- Administrative access to the Security Analytics appliance
- Root or sudo access to the operating system
- Your organization's Root CA certificate
- Any Intermediate CA certificates required for Smart Card validation
- LDAP server information
- An LDAP service account for authenticated binds

## Step 1 – Configure Apache

Edit the HTTPD configuration file.

```bash
vim /etc/sysconfig/httpd
```

Add or verify the following settings.

```text
SSLCA="SSLCACertificateFile /etc/pki/tls/certs/client-ca-bundle.crt"
SSL_OCSP_ENABLE="SSLOCSPEnable off"
```

The `SSLCACertificateFile` directive specifies the certificate bundle used to validate client certificates presented during Smart Card authentication.

## Step 2 – Configure LDAP

Edit the LDAP client configuration.

```bash
vim /etc/ldap.conf
```

Configure the CA bundle.

```text
tls_cacertfile /etc/pki/tls/certs/client-ca-bundle.crt
```

This ensures LDAP trusts the same certificate chain used for Smart Card authentication.

## Step 3 – Create the Client CA Bundle

If the file does not already exist, create it.

```bash
vim /etc/pki/tls/certs/client-ca-bundle.crt
```

Copy the certificates into the file.

A typical certificate chain is:

1. Intermediate CA certificate(s)
2. Root CA certificate

> **Field Note**
>
> Many environments place intermediate certificates first and the Root CA last. If your organization's PKI documentation specifies a different order, follow your PKI administrator's guidance.

## Step 4 – Update the Trusted CA Store

Verify your trusted certificate store contains every certificate required for Smart Card validation.

Edit the trusted anchor file if necessary.

```bash
vim /etc/pki/ca-trust/source/anchors/certbundle.cer
```

If certificates were added, rebuild the trust store.

```bash
update-ca-trust
```

## Step 5 – Verify the System CA Bundle

Confirm the system CA bundle contains the required Root and Intermediate certificates.

```bash
vim /etc/pki/tls/certs/ca-bundle.trust.crt
```

If certificates are missing, update the trust store before continuing.

## Step 6 – Configure LDAP Authentication

Navigate to:

```text
Settings → Authentication
```

Enable LDAP Authentication.

The following configuration provides a working template.

### Server Connection

```text
Server: your.ldap.server
Port: 636
```

### Encryption

```text
Encryption Type: SSL/TLS
Verify Server Certificate: Enabled
```

### Authenticated Bind

```text
Bind DN: <LDAP Service Account>
Bind Password: <Password>
```

### Searches

```text
Search Base:
DC=your,DC=company,DC=domain

Scope:
sub

Group DN:
CN=where,OU=your,OU=users,OU=are,DC=and,DC=your,DC=domain

Group Name Attribute:
cn
```

### Smart Cards and Certificates

```text
Use Certificate / Card for Authentication:
Enabled
```

### Schema Configuration

```text
LDAP Schema:
User Defined

User Object Class:
User

Login Name Attribute:
userPrincipalName

Password Change Method:
Active Directory (ADSI)

User ID Number Attribute:
userAccountControl

Home Directory Attribute:
unixHomeDirectory

Shadow Object Class:
User

Group Object Class:
Group

Group ID Number Attribute:
primaryGroupID

Group Membership Attribute:
member
```

> **Field Note**
>
> The exact schema attributes required depend on your LDAP implementation. Active Directory, OpenLDAP, and other directory services may use different object classes and attributes.

## Verification

After completing the configuration:

- Verify LDAP authentication succeeds.
- Verify Smart Card logins are accepted.
- Confirm the certificate chain validates successfully.
- Verify user group membership is resolved correctly.
- Test authentication with a non-administrative account before enabling production use.

## Troubleshooting

If Smart Card authentication fails:

- Verify the complete certificate chain is trusted.
- Confirm the LDAP server certificate validates successfully.
- Verify the user's certificate chains back to a trusted Root CA.
- Confirm the LDAP service account can successfully perform user searches.
- Review Apache and Security Analytics authentication logs for SSL or LDAP errors.

If certificate validation continues to fail after updating the trust store, restart the relevant services or reboot the appliance to ensure the updated CA certificates are loaded.

> **Field Note**
>
> Most Smart Card authentication issues are caused by missing Intermediate CA certificates or incomplete certificate chains rather than LDAP configuration itself. Verifying the certificate chain early in the troubleshooting process can save considerable time.
