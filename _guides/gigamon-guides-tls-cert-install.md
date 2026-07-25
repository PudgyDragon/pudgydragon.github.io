---
title: "Gigamon TLS Certificate Installation"
project: "Gigamon"
category: "Engineering Guide"
description: "Install and configure TLS certificates for Gigamon Fabric Manager and Nodes."
source_url: "https://github.com/PudgyDragon/Gigamon/blob/main/Guides/TLS_Cert_Install.md"
---

## Introduction

Transport Layer Security (TLS) certificates secure communication between Gigamon Fabric Manager (FM), managed nodes, and administrative clients. Replacing the default certificates with certificates issued by an internal or public Certificate Authority (CA) helps establish trusted communications and eliminates browser security warnings.

This guide documents the process of installing TLS certificates on both Gigamon Fabric Manager and managed Gigamon nodes.

## Advisory

Before replacing any certificates:

- Back up the existing certificates and private keys.
- Verify the complete certificate chain is available.
- Schedule a maintenance window, as some services or appliances may require a restart.

## Install Certificates on Gigamon Fabric Manager

### Back Up Existing Certificates

Log in to the Fabric Manager CLI and obtain root access.

Back up the existing certificate and private key.

```bash
cd /etc/pki/tls/certs
cp localhost.crt localhost.crt.bak

cd /etc/pki/tls/private
cp localhost.key localhost.key.bak
```

### Build the Certificate Chain

Create a certificate file containing the complete certificate chain in the following order:

- Server Certificate
- Intermediate CA
- Root CA

Retain all certificate headers and footers:

- `-----BEGIN CERTIFICATE-----`
- `-----END CERTIFICATE-----`

Copy the certificate and private key to the Fabric Manager.

```bash
mv FM.crt /etc/pki/tls/certs/

mv FM.key /etc/pki/tls/private/
```

### Configure Apache

Edit:

```bash
vi /etc/httpd/conf.d/ssl.conf
```

Add the following beneath the existing `SSLCertificateFile` directive.

```text
SSLCertificateChainFile /etc/pki/tls/certs/localhost.crt
```

### Replace the Existing Certificate

Replace the default certificate.

```bash
mv FM.crt /etc/pki/tls/certs/localhost.crt
chmod 644 /etc/pki/tls/certs/localhost.crt
```

Replace the private key.

```bash
mv FM.key /etc/pki/tls/private/localhost.key
chmod 600 /etc/pki/tls/private/localhost.key
```

> **Note:** Fabric Manager expects the certificate and key to be named `localhost.crt` and `localhost.key`.

### Create the PEM File

Combine the certificate and private key.

```bash
cat /etc/pki/tls/certs/localhost.crt \
    /etc/pki/tls/private/localhost.key \
    > /etc/pki/tls/certs/localhost.pem
```

> **Note:** Verify that the certificate and private key are separated by a newline within the PEM file.

### Restart Services

```bash
systemctl reload haproxy

systemctl restart httpd
```

Verify the services.

```bash
systemctl status tomcat@cmz

systemctl status haproxy

systemctl status httpd
```

## Install Certificates on Gigamon Nodes

### Advisory

If HTTPS communication fails after installing the certificates, verify that **Secure Cryptography Enhanced** is disabled.

Navigate to:

- **Inventory**
- **Nodes**
- Select the node
- **Settings**
- **Global Settings**

Verify:

- **Secure Cryptography Enhanced** is disabled.

> **Note:** Changing this setting reboots the node.

### Import Certificate Authorities

Import the Root and Intermediate CA certificates.

Navigate to:

- **Settings**
- **System**
- **Certificates**
- **CA List**
- **Add**

Import each certificate in the chain.

### Populate the Trust Store

Add the Root and Intermediate CA certificates.

Navigate to:

- **Settings**
- **System**
- **Certificates**
- **Trust Store**
- **Add**

### Import Custom Certificates

Navigate to:

- **Inventory**
- **Resources**
- **Security**
- **Custom SSL Certificate**
- **Add**

Import the node certificate and private key.

### Verify Certificate Distribution

Connect to the node CLI.

```bash
enable

configure terminal

show crypto certificate ca-list
```

Verify that all expected CA certificates are present.

## Configure the Node Certificate

From configuration mode:

```bash
crypto certificate name pudgy_cert public-cert pem
```

Paste the complete certificate, including the BEGIN and END markers.

Associate the private key.

```bash
crypto certificate name pudgy_cert private-key pem
```

Paste the complete private key.

### Configure the Default Certificate

```bash
crypto certificate default-cert name pudgy_cert

web https certificate name pudgy_cert
```

## Verification

Verify the configured certificate.

```bash
show crypto certificate default-cert public-pem
```

Open the node in a web browser and confirm:

- The expected TLS certificate is presented.
- The certificate chain is trusted.
- HTTPS connections complete successfully.

## Additional Resources

- [Gigamon Documentation - Install Custom SSL Certificates](https://docs.gigamon.com/)
