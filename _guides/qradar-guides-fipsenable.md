---
title: "Fipsenable"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/FIPSenable.md"
---

# Super quick guide for enabling FIPS
After updating QRadar to RHEL 8, enabling FIPS is very straight forward. 

## Order for enabling
It's recommdned to enable FIPS starting with the lowest needed devices first. We did it in the following order:
1. Data Nodes
2. App Hosts
3. Event Processors
4. Console

## Enabling
After logging into CLI as root, you can run the following commands:
```
fips-mode-setup --enable
```
Once it's complete, it will ask you to `reboot` the device. Afterwards, you can ssh back into the box to verify FIPS is enabled using:
```
fips-mode-setup --check
```
Make sure that you only do one at a time, or stagger them. After fully completing one and making sure it rebooted, I would run the command for one while another
was rebooting.
