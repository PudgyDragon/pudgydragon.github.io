---
title: "Gigamon FM IP Configuration"
project: "Gigamon"
category: "Engineering Guide"
description: "Change the management IP address of Gigamon Fabric Manager."
source_url: "https://github.com/PudgyDragon/Gigamon/blob/main/Guides/Change_IP.md"
---

## Introduction

Gigamon Fabric Manager (FM) uses a dedicated management IP address for administrative access and communication with managed nodes. If the management network changes or the appliance is moved to a different environment, the management IP address must be updated accordingly.

This guide walks through changing the management IP address of Gigamon Fabric Manager and reconnecting any previously managed nodes.

## Prerequisites

Before changing the management IP address, it is recommended to temporarily remove any managed nodes from Fabric Manager.

Navigate to:

- **Inventory**
- **Physical**
- **Nodes**

Select the managed node, then choose:

- **Actions**
- **Delete**

> **Note:** Removing a node from Fabric Manager does **not** delete the physical appliance or its configuration. It only removes the management relationship, allowing the node to be re-added after the IP address has been changed.

## Change the Management IP Address

Log in to the Fabric Manager CLI.

Run the following command:

```bash
fmctl set ip static <IPv4>/<CIDR> <gateway>
```

Where:

- `<IPv4>` is the new management IP address.
- `<CIDR>` is the subnet mask in CIDR notation.
- `<gateway>` is the default gateway.

Example:

```bash
fmctl set ip static 10.10.10.14/22 10.10.10.1
```

After the command completes, reboot the appliance.

## Re-Add Managed Nodes

After Fabric Manager has restarted and is reachable using the new management IP address, re-add the managed nodes.

Navigate to:

- **Inventory**
- **Physical**
- **Nodes**

Select:

- **Add**

Follow the prompts to reconnect each Gigamon node to Fabric Manager.

## Verification

- Verify the Fabric Manager web interface is accessible using the new management IP address.
- Verify each managed node reconnects successfully.
- Confirm all managed nodes report a healthy status.

## Additional Resources

- [Initial GigaVUE-FM Configuration](https://docs.gigamon.com/doclib611/Content/GV-FM-Install/Initial_GigaVUE-FM_Configuration__2.html)
- [Add New Physical Node or Cluster to GigaVUE-FM](https://docs.gigamon.com/doclib611/Content/GV-FM-UG/Add_New_Physical_Node_or_Cluster_to_GigaVUE_FM.html)
