---
title: "Ldap Ssl Error"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/LDAP_SSL_Error.md"
---

# Troubleshooting User Analytics User Import through LDAP

After configuring LDAP on QRadar and having it work for a couple weeks, we started getting an error similar to the one below:

```
Failed (Connection error: socket ssl wrapping error: certificate {'subject': ((('countryName', 'US'),),
(('organizationName', '<organizationName>'),), (('organizationalUnitName', '<organizationalName>'),),
(('organizationalUnitName', 'PKI'),), (('organizationalUnitName', '<organizationalUnitName>'),),
(('commonName', '<commonName>'),)), 'issuer': ((('countryName', 'US'),), (('organizationName',
'<organizationName>'),),(('organizationalUnitName', '<organizationalUnitName>'),),
(('organizationalUnitName', 'PKI'),), (('commonName', '<commonName>'),)),'version': 3,
'serialNumber': '<serialNumber>', 'notBefore': '<notBefore> GMT', 'notAfter': '<notAfter> GMT',
'subjectAltName': (('DNS', '<server name>'), ('DNS', '<server FQDN>'), ('othername', '<unsupported>')),
'OCSP': ('<ocsp>',),'caIssuers': ('<caIssuers>',), 'crlDistributionPoints': ('<crlDistributionPoints>',)}
doesn't match any name in ['<ipAddress>']
```

## Issues Found

I was able to determine that there were a couple things wrong that needed to be fixed:

- The root CA was updated recently and we needed to upload the new CA.cer into our `/etc/pki/ca-trust/source/anchors` directory.
- One of the intermediate CAs was updated recently, and we were now missing the correct CA.cer in our `/etc/pki/ca-trust/source/anchors` directory.
- The IP address we had previously given to QRadar wasn't matching what was listed in the new CA. I was able to fix this by replacing the IP address in the LDAP User Import setting to the FQDN of the AD server.

## How to Fix

To update the root and intermediate CA files, you can use this guide by IBM:
- https://www.ibm.com/support/pages/qradar-application-error-cannot-establish-secure-connection-console-check-if-your-qradar-certificates-are-setup-properly

Or if you're lazy:

- Export the root and intermediate CA.cer files from the AD server (or a server that shares the same certs)
- WinSCP (or whatever file transfer software you use) the files to QRadar
- Login to QRadar as the root user
- Copy the CA files to the right directory
  - `cp /<copy from directory> /etc/pki/ca-trust/source/anchors`
- Run the following command to update the truststore
  - `#update-ca-trust`
- Restart docker
  - `systemctl restart docker`
- You can verify the certs are now being used by User Behavior Analytics by using `recon`
  - `/opt/qradar/support/recon ps`
- Find the ID of the app and connect to it
  - `/opt/qradar/support/recon connect <id>`
- Once connected to the docker container, list the CA files to verify the new ones are there
  - `ls -l /etc/pki/ca-trust/source/anchors/`
 

### I hope this guide helps.
