---
title: "Corelight Sensor Deployment"
project: "Corelight"
category: "Engineering Guide"
description: "Deploy a Corelight Software Sensor on Proxmox Virtual Environment."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/Sensor.md"
---

## Introduction

Corelight Software Sensors provide network visibility by inspecting network traffic and generating high-fidelity telemetry for threat detection, network monitoring, and forensic analysis.

This guide documents the process of deploying a Corelight Software Sensor on Proxmox Virtual Environment (PVE) by migrating a previously seeded virtual appliance from VMware vSphere. It assumes the initial appliance deployment and activation have already been completed using the official Corelight deployment process.

## Advisory

At the time of writing, the initial deployment and activation of a Corelight Software Sensor requires VMware vSphere to complete the appliance seeding process. During deployment, the appliance must be activated using either a Customer ID or an offline seeding key.

Once the appliance has been successfully seeded, it can be exported from VMware and imported into Proxmox VE for long-term operation.

> **Note:** This guide begins after the initial VMware deployment has been completed.

## Prepare the VMware Appliance

Deploy and activate the Corelight Software Sensor using the official Corelight deployment guide.

After the deployment wizard completes successfully:

- Shut down the virtual machine.
- Export the virtual machine as an OVF template.
- Transfer the exported OVF and VMDK files to the Proxmox host using SCP or another secure file transfer method.

## Import the Virtual Machine

Import the OVF template into Proxmox.

Example:

```bash
qm importovf 105 ./corelightsensor.ovf corerhel --format qcow2
```

Where:

- `105` is the Proxmox virtual machine ID.
- `corerhel` is the target storage pool.

After the import completes, verify that both virtual disks have been imported successfully.

If necessary, detach and reattach the imported disks through the Proxmox web interface as **SCSI** devices.

## Configure the Virtual Machine

### Hardware

The following virtual hardware was used during testing:

- Memory: 64 GiB
- Processors: 4 vCPUs (1 Socket / 4 Cores)
- BIOS: OVMF (UEFI)
- SCSI Controller: VirtIO SCSI
- Primary Disk (`scsi0`): 64 GB
- Secondary Disk (`scsi1`): 500 GB
- Network Adapter (`net0`): VirtIO attached to `vmbr0`
- Network Adapter (`net1`): VirtIO attached to `vmbr1`

### Boot Order

Configure the boot order so that:

- `scsi0` is the primary boot device.

## Configure Firewall Access

If the Proxmox host or guest operating system is protected by a firewall, allow the required management ports before starting the appliance.

Example:

```bash
firewall-cmd --zone=public --permanent --add-service=https

firewall-cmd --zone=public --permanent --add-service=http

firewall-cmd --zone=public --permanent --add-port=1443/tcp

firewall-cmd --zone=public --permanent --add-port=1443/udp

firewall-cmd --reload
```

Port `1443` is used for communication between the Software Sensor and Corelight Fleet Manager.

If Fleet Manager is not being used, allowing HTTP and HTTPS access enables management through the sensor's web interface.

## Verification

After the migration is complete:

- Verify the virtual machine starts successfully.
- Confirm both virtual disks are attached.
- Verify both network adapters are operational.
- Confirm the sensor is accessible through the web interface.
- If Fleet Manager is deployed, verify the sensor successfully connects and reports its status.
