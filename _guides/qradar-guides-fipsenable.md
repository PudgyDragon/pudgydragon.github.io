---
title: "QRadar FIPS Configuration"
project: "QRadar"
category: "Engineering Guide"
description: "Enable FIPS mode on QRadar appliances running Red Hat Enterprise Linux 8."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/FIPSenable.md"
---

## Introduction

Federal Information Processing Standards (FIPS) mode enables the use of FIPS 140-validated cryptographic modules within the operating system. Beginning with QRadar deployments running on Red Hat Enterprise Linux 8 (RHEL 8), enabling FIPS mode is a straightforward process using the native operating system utilities.

This guide outlines the recommended order for enabling FIPS across a QRadar deployment and provides the commands required to enable and verify FIPS mode.

## Recommended Enablement Order

To minimize disruption, enable FIPS mode on lower-tier managed hosts before enabling it on the Console.

The following order is recommended:

1. Data Nodes
2. App Hosts
3. Event Processors
4. Console

Complete the enablement process on each appliance before proceeding to the next.

## Enable FIPS Mode

Log in to the appliance as the `root` user.

Enable FIPS mode:

```bash
fips-mode-setup --enable
```

When prompted, reboot the appliance to complete the configuration.

## Verify FIPS Mode

After the appliance has restarted, reconnect using SSH and verify that FIPS mode is enabled:

```bash
fips-mode-setup --check
```

The command should report that FIPS mode is enabled.

## Deployment Recommendations

When enabling FIPS mode across multiple appliances:

- Enable FIPS on one appliance at a time.
- Wait for the appliance to reboot and return to service before proceeding.
- If desired, begin enabling FIPS on the next appliance while the previous appliance is completing its reboot, provided operational impact has been considered.

Following a staged approach helps reduce the risk of unnecessary service interruptions during maintenance.
