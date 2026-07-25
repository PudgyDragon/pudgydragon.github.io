---
title: "Changing the SMS IP Address"
project: "TippingPoint"
category: "Engineering Guide"
description: "Safely change the IP address of the TippingPoint Security Management System (SMS) while preserving managed devices."
source_url: "https://github.com/PudgyDragon/TippingPoint/blob/main/Guides/Change_IP.md"
---

## Introduction

This guide documents the process for changing the management IP address of a **Trend Micro TippingPoint Security Management System (SMS)**.

While changing the SMS management address is relatively straightforward, the SMS uses its management IP to communicate with every managed **TippingPoint TPS** device. Changing the IP without preparing the environment can result in communication failures until the TPS devices are updated.

This guide walks through the recommended preparation, IP address change, and re-establishing management after the migration.

> **Important**
>
> Before changing the SMS IP address, document the current network configuration and verify the new IP address has been approved within your network.

> **Warning**
>
> If your TPS appliances restrict management access using IP filters (ACLs), update those rules before changing the SMS IP. Otherwise, the SMS may be unable to reconnect after the migration.

## Prerequisites

Before beginning:

- Administrative access to the SMS
- Administrative access to each managed TPS
- Approved replacement IP address
- Updated firewall rules (if applicable)
- Updated routing (if applicable)

It is also recommended to perform this procedure during a maintenance window.

## Step 1 – Prepare the TPS Appliances

Before changing the SMS IP address, temporarily remove SMS management from each TPS appliance.

This preserves the devices within SMS while allowing them to reconnect using the new management address later.

### Option 1 – Unmanage from the SMS

Navigate to:

```text
Devices
└── All Devices
    └── Right-click Device
        └── Edit
            └── Unmanage Device
```

### Option 2 – Unmanage from the TPS CLI

```text
sms unmanage
```

## Step 2 – Update TPS Management ACLs (If Used)

If your TPS appliances use management IP filtering, ensure the **new SMS IP address** is allowed before changing the SMS configuration.

Trend Micro provides additional information here:

https://success.trendmicro.com/en-US/solution/KA-0020391

### Configure from the CLI

```text
edit
int mgmt
ip-filter allow ip <NEW_SMS_IP>
exit
commit
exit
save-config
```

### Configure from the GUI

Navigate to:

```text
Devices
└── All Devices
    └── Expand Device
        └── Device Configuration
            └── Edit
                └── Host IP Filters
                    └── New
```

> **Field Note**
>
> If the old SMS IP address is explicitly permitted by an ACL, remember to update or remove it once the migration has been completed successfully.

## Step 3 – Change the SMS IP Address

The SMS management interface can be updated using either the GUI or CLI.

### Option 1 – SMS GUI

Navigate to:

```text
Admin
└── Server Properties
```

Update the following values as required:

- IP Address
- Subnet Mask
- Default Gateway
- IPv6 Address (if applicable)
- Default Router (if applicable)

Select **Apply**.

The SMS will reboot to apply the new network configuration.

### Option 2 – SMS CLI

From the SMS console:

```text
set net
```

The configuration utility will prompt for the required network settings.

After completing the configuration:

```text
reboot
```

The reboot is required before the new management address becomes active.

## Step 4 – Re-establish Management

After the SMS has rebooted and is reachable at its new IP address, re-enable management for each TPS appliance.

### Verify the TPS is Ready

From the TPS CLI:

```text
sms manage
```

### Re-manage from the SMS

Navigate to:

```text
Devices
└── All Devices
    └── Right-click Device
        └── Edit
            └── Manage Device
```

Repeat this process for each managed appliance.

## Verification

After completing the migration:

- Verify the SMS is reachable at its new IP address.
- Confirm all managed TPS devices reconnect successfully.
- Verify device status reports as healthy.
- Confirm policy synchronization succeeds.
- Verify event logging and management communication operate normally.

## Troubleshooting

If a TPS does not reconnect:

- Verify the management ACL includes the new SMS IP.
- Confirm network connectivity between the SMS and TPS.
- Verify routing and firewall rules.
- Confirm the TPS is no longer managed by the old SMS IP.
- Verify DNS (if hostnames are used instead of IP addresses).

If the SMS GUI is unreachable after changing the IP:

- Verify the subnet mask and default gateway.
- Confirm the new IP address is not already in use.
- Access the SMS through the console to review the network configuration.

> **Field Note**
>
> The actual IP address change typically takes only a few minutes. Most migration time is spent preparing the TPS appliances and updating any management ACLs that reference the old SMS IP address. Taking a few minutes to document these dependencies beforehand can prevent unnecessary troubleshooting after the reboot.
