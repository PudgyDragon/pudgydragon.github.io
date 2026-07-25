---
title: "Remapping the Management Interface (eth0)"
project: "Security Analytics"
category: "Engineering Guide"
description: "Move the Security Analytics management interface to a different physical network port on custom hardware."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/eth0_Mapping.md"
---

## Introduction

When Security Analytics is installed on **custom hardware**, the installation process typically assigns the **eth0** management interface to the first detected network adapter. Depending on your hardware configuration, this may result in a high-speed capture interface (such as a 10 GbE port) being used for management instead of packet capture.

On systems equipped with multiple network adapters, it is often desirable to move the management interface to a dedicated **1 GbE** port, leaving all available **10 GbE** interfaces available for packet capture.

This guide walks through the process of remapping the management interface to a different physical NIC.

> **Important**
>
> This guide is intended for **custom hardware deployments** of Security Analytics. Broadcom appliances are factory configured with the appropriate interface mappings and generally should not require this procedure.

> **Warning**
>
> Incorrectly modifying interface mappings can result in the loss of network connectivity. Perform this procedure during an approved maintenance window and ensure you have console or out-of-band access before making changes.

## Prerequisites

Before making any changes:

- Identify the current management interface.
- Identify the interface you want to become the new management interface.
- Record the MAC addresses of both interfaces.
- Ensure console access is available in case network connectivity is lost.

Broadcom provides an official knowledge base article describing this procedure:

https://knowledge.broadcom.com/external/article/168314/eth0-is-being-mapped-to-the-wrong-port-o.html

## Files to Modify

Once you've identified the two interfaces that will be swapped, three configuration files require modification.

```text
/etc/udev/rules.d/70-persistent-net.rules
/etc/sysconfig/network-scripts/ifcfg-eth0
/etc/sysconfig/network-scripts/ifcfg-eth*
```

## Step 1 – Update Persistent Interface Mapping

Edit:

```text
/etc/udev/rules.d/70-persistent-net.rules
```

Locate the entries for:

- `eth0`
- The interface that will become the new management interface

Swap the interface names by modifying the:

```text
NAME="ethX"
```

field for each interface.

For example, if `eth3` will become the new management interface:

- Change the existing `eth0` entry to `eth3`
- Change the existing `eth3` entry to `eth0`

This changes which physical NIC is presented to the operating system as `eth0`.

## Step 2 – Update Network Configuration Files

Next, update the corresponding interface configuration files.

```text
/etc/sysconfig/network-scripts/ifcfg-eth0
/etc/sysconfig/network-scripts/ifcfg-eth3
```

Update the `HWADDR=` value in each file so that it matches the MAC address of its newly assigned interface.

For example:

- `ifcfg-eth0` should contain the MAC address previously assigned to `eth3`
- `ifcfg-eth3` should contain the MAC address previously assigned to `eth0`

This ensures each interface configuration matches the correct physical NIC after the rename.

## Step 3 – Reboot the Appliance

After updating all configuration files, reboot the appliance.

```bash
reboot
```

During startup, Security Analytics will rebuild the network configuration using the updated interface mappings.

## Verification

After the system finishes booting:

- Confirm the management interface is available on the expected physical port.
- Verify the appliance receives the correct IP address.
- Confirm you can access the Security Analytics web interface.
- Verify packet capture interfaces are still available and operating normally.

Finally, move the management network cable to the newly assigned management port if it has not already been relocated.

> **Field Note**
>
> This procedure is commonly performed when repurposing enterprise servers for Security Analytics. Assigning management traffic to a dedicated 1 GbE interface preserves higher-speed interfaces exclusively for packet capture, maximizing available capture bandwidth.
