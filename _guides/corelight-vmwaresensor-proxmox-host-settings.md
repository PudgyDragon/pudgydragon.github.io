---
title: "Proxmox Host Configuration"
project: "Corelight"
category: "Engineering Guide"
description: "Configure a Proxmox VE host to support Corelight virtual appliances."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/Proxmox_Host_Settings.md"
---

# Proxmox Host Settings

If you have your Fleet Manager and Sensor running on two VMs on the same Proxmox host, you will need to make sure you have the appropriate network settings to allow it. Yours may look different than ours, but based on having Fleet Manager and a single Sensor, our settings look like this:

```
Name     | Type            | Active    | Autostart     | VLAN aware     | Ports/Slaves    | Bond Mode    | CIDR         | Gateway
---------|-----------------|-----------|---------------|----------------|-----------------|--------------|--------------|-------------
eno1     | Network Device  | Yes       | Yes           | No             |                 |              |              |
eno2     | Network Device  | Yes       | Yes           | No             |                 |              |              |
vmbr0    | Linux Bridge    | Yes       | Yes           | No             | eno1            |              | <hostIP>/32  | <gatewayIP>
vmbr1    | Linux Bridge    | Yes       | Yes           | No             | eno2            |              | <hostIP>/32  |
```

The `hostIP` will be the IP of your Proxmox host.
