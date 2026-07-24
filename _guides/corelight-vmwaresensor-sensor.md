---
title: "Corelight Sensor Deployment"
project: "Corelight"
category: "Engineering Guide"
description: "Deploy a Corelight Software Sensor on Proxmox Virtual Environment."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/Sensor.md"
---

# Introduction

Corelight Software Sensors provide network visibility by inspecting traffic and generating high-fidelity security telemetry for threat detection, network monitoring, and forensic analysis. This guide documents the process of deploying a Corelight Software Sensor on Proxmox Virtual Environment (VE), including the migration of a seeded virtual appliance from VMware ESXi.

Because Corelight's initial deployment process relies on VMware ESXi to perform the appliance seeding process, a Software Sensor cannot currently be deployed directly from the original OVA files on Proxmox VE. This guide assumes the sensor has been successfully seeded using VMware vSphere and focuses on migrating the virtual appliance to Proxmox for long-term operation.

## Advisory
At the time of writing, I have not been able to perform the initial Corelight Software Sensor deployment directly on Proxmox VE. The supplied OVA requires an initial seeding process that is performed through VMware ESXi using either a Customer ID or an offline seeding key. Additionally, the appliance uses encrypted disks and root access is restricted to Corelight Support, preventing modifications to the initial deployment process.

Once the appliance has been seeded and the initial setup is complete, it can be shut down, exported from ESXi as an OVF template, and migrated to Proxmox VE without issue.

## ESXi
Complete the initial deployment using VMware vSphere by following the Corelight deployment guide. During the first boot, you will be prompted to activate the appliance using either your Customer ID or an offline seeding key. After the deployment wizard completes and the appliance has rebooted successfully, shut down the virtual machine and export it as an OVF template.

The exported template will contain the OVF and VMDK files required for migration. Transfer these files to your Proxmox VE host using SCP before continuing with the remainder of this guide.

## Proxmox Import
Once your ova files (ovf, vmdk) are on your Proxmox host, you will need to create a new VM with them running the following commands:
```
qm importovf 105 ./corelightsensor.ovf corerhel --format qcow2
```
In our case, 105 is the number we used for our VM and corerhel is the the LVM we'll be using for our sensor.

Once the import is finished, and both disks have been imported, you may have to go to `Hardware` on your Proxmox GUI and detach both disks from the VM and re-attach them as SCSI.

## Proxmox Settings
For the VM to work properly, your settings should look similar to these:
### Hardware
- Memory: 64 GiB
- Processors: 4 (1 sockets, 4 cores)
- BIOS: OVMF (UEFI)
- SCSI Controller: VirtIO SCSI
- Hard Disk (scsi0): corerhel:vm-105-disk-0,size=64G
- Hard Disk (scsi1): corerhel:vm-105-disk-1,size=500G
- Network Device (net0): virtio=<mac>,bridge=vmbr0
- Network Device (net1): virtio=<mac>,bridge=vmbr1

### Options
- Boot Order: scsi0

### Firewall
You will also need to make sure your local firewall will allow traffic to the ports needed. You can play with these settings on the GUI based on your organization needs, but for the initial setup you will need to run the following commands to make sure a couple necessary ports are available:
```
firewall-cmd --zone=public --permanent --add-service=https
firewall-cmd --zone=public --permanent --add-service=http
firewall-cmd --zone=public --permanent --add-port 1443/tcp
firewall-cmd --zone=public --permanent --add-port 1443/udp
```
Allowing `1443` will allow the sensor to be able to talk to your Fleet Manager. If you're not using Fleet Manager, allowing `https/http` will allow you to be able to access your VM from your browser outside of the VM.
