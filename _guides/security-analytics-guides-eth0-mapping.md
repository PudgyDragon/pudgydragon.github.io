---
title: "Eth0 Mapping"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/eth0_Mapping.md"
---

# Guide for mapping eth0 to another port
If you have your own hardware for SSA, the initial configuration will setup eth0 on the first port of your NIC. If you have a NIC with 10G interfaces on the first two ports, you may wish to map your management
interface to a 1G interface instead to allow multiple 10G capture interfaces. There's an online guide provided by Broadcom to do this, which is pretty simple to follow and can be found here:

<a href="https://knowledge.broadcom.com/external/article/168314/eth0-is-being-mapped-to-the-wrong-port-o.html">Broadcom: eth0 is being mapped to the wrong port on Security Analytics appliances</a>

## Walkthrough

For simplicity, once you've determined which two interfaces you want to swap, there are three files that you need to modify:
```
/etc/udev/rules.d/70-persistent-net.rules
/etc/sysconfig/network-scripts/ifcfg-eth0
/etc/sysconfig/network-scripts/ifcfg-eth*
```
In the `70-persistent-net.rules` file, you will need to swap the `NAME="eth0"` section of both eth0 and whatever other eth port you're going to swap it with.

In the `/etc/sysconfig/network-scripts/ifcfg-eth*` files, you will need up update the `HWADDR` address to match the MAC address of the swapped ports. For example, `ifcfg-eth0` will need to be modified
to have the address of `ifcfg-eth3`, and vice versa (if that's the port you're swapping it to).

Once you've modified the 3 files, `reboot` the system for the changes to take affect. 

Don't forget to swap the mgmt cable to the new mgmt interface.
