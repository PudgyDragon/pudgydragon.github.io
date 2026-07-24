---
title: "Proxmox Host Configuration"
project: "Corelight"
category: "Engineering Guide"
description: "Configure a Proxmox VE host to support Corelight virtual appliances."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/Proxmox_Host_Settings.md"
---

# Introduction

When deploying Corelight Fleet Manager and Corelight Software Sensors as separate virtual machines on the same Proxmox VE host, the host's network configuration must be configured to support communication between the virtual appliances. While your environment may differ depending on your hardware and network design, the following configuration provides a recommended baseline for a deployment consisting of one Fleet Manager and one Software Sensor.

## Host Configuration

The following network configuration was used for this deployment:

```
Name     | Type            | Active    | Autostart     | VLAN aware     | Ports/Slaves    | Bond Mode    | CIDR         | Gateway
---------|-----------------|-----------|---------------|----------------|-----------------|--------------|--------------|-------------
eno1     | Network Device  | Yes       | Yes           | No             |                 |              |              |
eno2     | Network Device  | Yes       | Yes           | No             |                 |              |              |
vmbr0    | Linux Bridge    | Yes       | Yes           | No             | eno1            |              | <hostIP>/32  | <gatewayIP>
vmbr1    | Linux Bridge    | Yes       | Yes           | No             | eno2            |              | <hostIP>/32  |
```

The `hostIP` will be the IP of your Proxmox host.
