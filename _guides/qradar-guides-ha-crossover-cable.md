---
title: "Configure an HA Crossover Cable"
project: "QRadar"
category: "Engineering Guide"
description: "Configure and verify a dedicated crossover interface for IBM QRadar High Availability (HA) pairs."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/HA_Crossover_Cable.md"
---

## Introduction

A dedicated crossover interface provides a direct communication path between QRadar High Availability (HA) hosts. This connection is used for HA synchronization and heartbeat traffic, reducing dependence on the management network and improving resiliency.

This guide demonstrates how to configure a crossover interface using the QRadar user interface and verify connectivity from the command line.

## Configure the Crossover Interface

1. Navigate to **Admin**.
2. Select **System and License Management**.
3. From the **Display** menu, select **System**.
4. Right-click the HA pair to configure and select **Edit HA Host**.
5. Enable **Configure Crossover Cable**.
6. Select the network interface that will be connected directly to the peer appliance.
7. Expand **Advanced Options**.
8. Configure the crossover IP addresses or accept the default non-routable addresses.
9. Configure the appropriate MTU for the interface.
   - For example, use an MTU of **9000** when using a 10 GbE network that supports jumbo frames.
10. Save the configuration.

> **Note:** If multiple HA pairs exist within the environment, consider assigning each pair its own non-routable subnet. Although QRadar can operate with the default addresses, using unique subnets simplifies troubleshooting and reduces the chance of address conflicts.

Example:

| HA Pair | Primary | Secondary |
|---------|----------|-----------|
| Console HA | 10.10.10.1 | 10.10.10.2 |
| Event Processor HA | 10.10.20.1 | 10.10.20.2 |

## Verify Connectivity

After configuring the crossover interface, verify SSH connectivity between both appliances using the crossover IP addresses.

From the primary HA host:

```bash
ssh root@10.10.10.2 -o StrictHostKeyChecking=no
```

From the secondary HA host:

```bash
ssh root@10.10.10.1 -o StrictHostKeyChecking=no
```

> **Note:** During initial setup, SSH host keys may not yet be trusted. Establishing an SSH session in both directions accepts the host keys and verifies that the crossover interface is functioning correctly.

If connectivity issues are encountered, verify communication using both the management interfaces and the crossover interfaces before continuing.

## Enable the Crossover Interface

From the primary HA appliance, enable the crossover interface.

```bash
/opt/qradar/ha/bin/qradar_nettune.pl crossover enable
```

> **Note:** Depending on the QRadar version and deployment, this command may also need to be executed on the secondary appliance. If the crossover interface does not become active, verify the status on both hosts.

## Verify Crossover Status

Check the crossover status from each HA appliance.

```bash
/opt/qradar/ha/bin/qradar_nettune.pl crossover status
```

Verify that:

- The crossover interface is enabled.
- Both HA hosts report the interface as operational.
- Communication is successful across the dedicated crossover network.

## Verification

The configuration is complete when:

- The crossover interface is configured in the QRadar user interface.
- SSH connectivity succeeds using the crossover IP addresses.
- `qradar_nettune.pl crossover status` reports the crossover interface as enabled.
- The HA pair communicates successfully across the dedicated crossover network.
