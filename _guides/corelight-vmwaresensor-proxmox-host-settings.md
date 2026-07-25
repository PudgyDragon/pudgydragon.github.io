---
title: "Proxmox Host Configuration"
project: "Corelight"
category: "Engineering Guide"
description: "Configure a Proxmox VE host to support Corelight virtual appliances."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/Proxmox_Host_Settings.md"
---

## Introduction

When deploying Corelight Fleet Manager and Corelight Software Sensors as separate virtual machines on the same Proxmox Virtual Environment (PVE) host, the host networking must be configured to provide connectivity between the virtual appliances and the physical network.

The exact network configuration may vary depending on your infrastructure, switch configuration, and management requirements. The configuration documented below was used for a deployment consisting of one Corelight Fleet Manager and one Corelight Software Sensor and provides a baseline for similar environments.

## Configure the Proxmox Network

The following network configuration was used for this deployment.

| Name | Type | Active | Autostart | VLAN Aware | Bridge Port | CIDR | Gateway |
|------|------|:------:|:---------:|:----------:|-------------|------|---------|
| `eno1` | Network Device | Yes | Yes | No | — | — | — |
| `eno2` | Network Device | Yes | Yes | No | — | — | — |
| `vmbr0` | Linux Bridge | Yes | Yes | No | `eno1` | `<hostIP>/32` | `<gatewayIP>` |
| `vmbr1` | Linux Bridge | Yes | Yes | No | `eno2` | `<hostIP>/32` | — |

Where:

- `<hostIP>` is the management IP address assigned to the Proxmox host.
- `<gatewayIP>` is the default gateway for the management network.

## Network Design

The deployment uses two Linux bridges:

- `vmbr0` provides connectivity for the management network and includes the default gateway.
- `vmbr1` provides a secondary bridge for the additional physical interface.

This configuration separates management traffic from any additional networks required by the Corelight virtual appliances while allowing each bridge to be assigned independently to virtual machines.

## Verification

After configuring the bridges:

- Verify both Linux bridges are active.
- Confirm each bridge is associated with the correct physical interface.
- Verify the Proxmox host can reach the configured gateway.
- Confirm the Corelight virtual machines receive network connectivity through their assigned bridge.
