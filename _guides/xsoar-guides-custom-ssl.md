---
title: "Add Custom SSL Certificate"
project: "XSOAR"
category: "Engineering Guide"
description: "Replace the default Cortex XSOAR SSL certificate with a custom certificate signed by your organization's Certificate Authority."
source_url: "https://github.com/PudgyDragon/XSOAR/blob/main/Guides/custom_ssl.md"
---

## Introduction

By default, Cortex XSOAR is deployed with a self-signed SSL certificate. While suitable for initial setup and testing, production environments typically require a certificate issued by an internal or public Certificate Authority (CA) to eliminate browser warnings and establish trust with users and integrated systems.

This guide walks through replacing the default certificate with a custom SSL certificate.

The process is based on the official Palo Alto Networks documentation while including additional operational notes learned during deployment.

Official documentation:

- https://docs-cortex.paloaltonetworks.com/r/Cortex-XSOAR/6.14/Cortex-XSOAR-Administrator-Guide/Install-or-Renew-a-Custom-Certificate

> **Important**
>
> Replacing the SSL certificate requires restarting the Demisto service. Plan a maintenance window if the appliance is actively being used.

> **Warning**
>
> Before replacing the certificate, ensure you have a backup of the existing `cert.pem` and `cert.key` files. If the new certificate or private key is invalid, restoring the backups will quickly return the appliance to a working state.

## Prerequisites

Before beginning, ensure you have:

- Administrative (`root`) or `sudo` access to the XSOAR server
- A server certificate issued for the XSOAR hostname
- The corresponding private key
- Any required intermediate certificates
- The root CA certificate (if applicable)
- An SCP client capable of transferring files to the server

## Step 1 – Build the Certificate Chain

XSOAR expects the certificate chain to be contained within a single PEM file.

Create a new file using a text editor such as Notepad++ or Visual Studio Code and combine the certificates in the following order:

1. Server (XSOAR) certificate
2. Intermediate CA certificate(s)
3. Root CA certificate

Each certificate must include the complete PEM headers and footers.

Example:

```text
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

Save the completed file with a `.pem` extension.

For example:

```text
cert.pem
```

Transfer both the certificate chain and the matching private key to the XSOAR appliance using SCP.

> **Important**
>
> The certificate order is important. An incorrect certificate chain may cause browsers or integrated systems to report an incomplete or untrusted certificate chain.

## Step 2 – Stop the Demisto Service

Log in to the appliance.

Stop the Demisto service before replacing the certificate files.

```bash
service demisto stop
```

## Step 3 – Back Up the Existing Certificate

Navigate to the XSOAR installation directory.

```bash
cd /usr/local/demisto
```

Create backups of the current certificate and private key.

```bash
cp cert.pem cert.pem.bak
cp cert.key cert.key.bak
```

These backups allow you to quickly restore the previous configuration if necessary.

## Step 4 – Replace the Certificate

Copy the new certificate chain into place.

```bash
cp new_cert_chain.pem /usr/local/demisto/cert.pem
```

Copy the private key.

```bash
cp new_key.key /usr/local/demisto/cert.key
```

> **Important**
>
> XSOAR expects these files to be named exactly:
>
> - `cert.pem`
> - `cert.key`
>
> If different filenames are used, the service will not load the custom certificate.

## Step 5 – Start the Demisto Service

Restart the service.

```bash
service demisto start
```

Allow the service several minutes to initialize before attempting to reconnect.

## Verification

After the service has started:

- Browse to the XSOAR web interface.
- Verify the browser reports a trusted certificate.
- Confirm the certificate subject matches the expected hostname.
- Verify the certificate expiration date.
- Confirm the full certificate chain is presented correctly.
- Test from another workstation if browser caching is suspected.

If the old certificate still appears, clear the browser cache or test using a private/incognito browsing session.

## Troubleshooting

If the XSOAR web interface fails to load after replacing the certificate:

- Verify the private key matches the certificate.
- Confirm the certificate chain is in the correct order.
- Verify the certificate file is valid PEM format.
- Confirm the filenames are `cert.pem` and `cert.key`.
- Restore the backup files if necessary.

If browsers report an incomplete certificate chain:

- Verify all required intermediate certificates are included.
- Ensure the root certificate appears last in the PEM file.

If the browser continues to display the old certificate:

- Clear the browser cache.
- Restart the browser.
- Verify you are connecting to the correct server.

> **Field Note**
>
> In my experience, the majority of SSL issues aren't caused by XSOAR itself—they're caused by an improperly constructed certificate chain. Taking a few extra minutes to verify the certificate order before copying the files to the appliance can save a considerable amount of troubleshooting afterward. Keeping backups of the original `cert.pem` and `cert.key` files also provides a quick recovery path if something goes wrong during the replacement process.
