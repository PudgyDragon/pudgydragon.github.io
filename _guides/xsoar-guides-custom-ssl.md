---
title: "Custom Ssl"
project: "XSOAR"
category: "Engineering Guide"
description: "A practical engineering guide for XSOAR."
source_url: "https://github.com/PudgyDragon/XSOAR/blob/main/Guides/custom_ssl.md"
---

# Add Custom SSL Certificate
Just a quick and dirty guide for adding an SSL certificate to your XSOAR device. Follows the guide from the URL below:
- https://docs-cortex.paloaltonetworks.com/r/Cortex-XSOAR/6.14/Cortex-XSOAR-Administrator-Guide/Install-or-Renew-a-Custom-Certificate

## Certificate Chain
Based on your environment, you need to create a pem file that has all of the certificates bundled together (including the before and end of certificate stuff) and in this order:
1. XSOAR SSL Certificate
2. Intermediate Certificate (if you have one)
3. Root Certificate

Create it in Notepad++ or the likes and make sure to save it as a `.pem` file. Once you have that done, SCP your `.pem` and private `.key` files to your device.

## Swap the Files
Login to the device as root (or sudo su) and run the following command to stop Demisto:
```
service demisto stop
```
Once the service has been stopped, make a backup of the current `.pem` and `.key` files in case you mess something up:
```
cd /usr/local/demisto
cp cert.pem cert.pem.bak
cp cert.key cert.key.bak
```
Once you have a backup, can copy the new `.pem` and `.key` files over to replace the existing ones. The naming conventions *needs* to be the same `cert.pem` and `cert.key`:
```
cp new_cert_chain.pem /usr/local/demisto/cert.pem
cp new_key.key /usr/local/demisto/cert.key
```
Afterwards, start demisto back up using:
```
service demisto start
```
## Fin
And there you have it. Clear your cache, open a browser and your SSL cert should have been applied properly.
