---
title: "Ssa Proxmox"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/SSA_Proxmox.md"
---

# * * * Updates coming * * *

# SSA On Proxmox Guide
I wanted to test a few things with SSA and see if it was possible to get it running on Proxmox. 

## Before Starting
Before doing so, you'll need to create Proxmox storage that is type LVM, with content Disk Image, Container. You will be using the Proxmos host to create the installation media. 

## Preparing the Proxmox Host
I was having issues at first because it kept saying I had a volume group on the storage I wanted to use, so (using your storage name in place) run the following:
```
vgs # Find the volume group to delete (mine was captureVG)
vgremove captureVG
wipefs --all --backup /dev/sda # Replace sda with whatever drive you're using
apt-get install parted # Install parted
apt-get install udev # Install udev
cp /bin/udevadm /sbin/udevadm # udevadm wasn't in the right location for me
```
From here, follow the SSA installation guide on my other repo to create the installation media for SSA, replacing the USB with the Proxmox storage node you created just for this. This will create the installation media on your Proxmox storage device. 

## New VM
Create a new proxmox VM with these settings:
- BIOS - Default (SeaBIOS)
- SCSI Controller - VirtIO SCSI
- Network Device (net0) - virtio=<mac>, bridge=vmbr0
- Network Device (net1) - virtio=<mac>, bridge=vmbr1

Don't start the VM yet. Once the installation media is completed, run the following:
```
qm set vmid -virtio0 /dev/sda
# Replace vmid with your VM ID
```
This will add the installation media as a drive to your newly created VM. In the Options tab on Proxmox, set the boot option as the `/dev/sda` (or whatever your drive is that has SSA installed). When the installation is complete, head to the next step.

## Login Issues
For some reason, I wasn't able to login as the default user with the default credentials and kept getting "Authentication Error" even though they were typed correctly. So, to overcome this I had to do some fun stuff with a vulnerability that it appears SSA has. Restart the VM, and watch the screen until it gets to the grub menu where you will need to press `e`. Scroll down the screen until you see the line that has `ro` in it, and replace the line from `ro` to `rw init=/bin/bash`. Then run the command on the screen that allows you to boot the machine (it should be `Ctrl-x`). This will take you straight to a bash terminal as `root`, where you can then run the following:
```
mount -n -o remount,rw /
passwd root
# Change the password for root to whatever you want for now
```
Now you have root access to the device before you're supposed to, and can make necessary changes.
### Update: Turns out I just didn't have enough storage assigned when installing, which was causing the login issues.

## Setting Configs
The next thing I had to do was call my good friend Slippy Penguin, because for some reason my ifconfig settings just weren't persisting. As soon as I called him, they magically worked. So if you have a friend like that, best to just have them on standby for good luck. Run the following commands to set your IP configurations:
```
sudo ifconfig bond0 <ip_address> netmask <subnet_mask>
sudo route add default gw <default_gateway_ip>
sudo ifconfig eth0 <ip_address> netmask <subnet_mask>
# The configs for bond0 and eth0 should be the exact same.
```
## MAC Address
It's possible that your eth0 and bond0 MAC address aren't aligning properly. I'm not sure if it's an issue with Proxmox or just user error on my part. This was causing the link status for both interfaces to be down, not allowing us to have a web GUI. To fix this, you can replicate your desired MAC address to a couple different places. First make sure the MAC address in your Proxmox hardware settings is the one you want to use. Next, you will have to change the following two files to match:
```
vim /etc/sysconfig/network-scripts/ifcfg-eth0
MACADDR=<Your Mac>
vim /etc/sysconfig/network-scripts/ifcfg-bond0
MACADDR=<Your Mac>
```
If `HWADDR` exists in either file, replace it with `MACADDR` instead.

## Finishing Up
That should do it! You should be able to login to your device through the management IP (the bond0 that you set) from your browser. If you're unable to, you may need to make sure you didn't set the Network Device to have a firewall. Luckily, you also now have root access to do any troubleshooting that you couldn't do with the default credentials. Have fun!
