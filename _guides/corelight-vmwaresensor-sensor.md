---
title: "Corelight Sensor Deployment"
project: "Corelight"
category: "Engineering Guide"
description: "Deploy a Corelight Software Sensor on Proxmox Virtual Environment."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/Sensor.md"
---

# Introduction
### Advisory
Please note, I haven't been able to do a fresh install using Corelight's initial OVA files. This is because they use a seeding process that requires the use of ESXi. Unfortunately (in this scenario) they encrypt their drives and only Corelight Support has root access, so it's not really possible to seed it without using ESXi (that I'm aware of). With that said, once you create a VM with ESXi, you are able to migrate it really easily over to Proxmox.

## ESXi
Unfortunately, I haven't figured out how to seed Corelight on Proxmox itself. You will need to use vSphere to seed Corelight with the GUI that gives you the option for Customer ID or offling seedling key. The guide for that is straight forward and there are no alterations that need to be made for that. Once you have it seeded, and have gone through the process of rebooting it as the guide says to do, you will need to shut down the VM and export it as a template. This will give you ovf and vmdk files that you will need to SCP onto your Proxmox host.

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
