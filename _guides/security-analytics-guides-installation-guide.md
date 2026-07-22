---
title: "Installation Guide"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/Installation_Guide.md"
---

# Security Analytics Installation Guide
This is a guide for the install of SSA 8.2.6 on your own Dell hardware. Please note that it took a lot of trial and error with other methods
that ended up not working for us. This is the only method that ended up working for us using a DVD.iso file type.

**A USB stick is REQUIRED for this method**

Using an external hard drive, or using WinSCP if the device you're going to install this on is still connected to the network, transfer
the .iso file and the solera script file to the /home directory. Once the files are transferred to the home directory, you can remove the
external hard drive. You can find the solera script file here at the bottom of the page:

- https://knowledge.broadcom.com/external/article/168296
- **NOTE** - They removed the script, but it can be found in my repositories

Ensure that syslinux, dosftools, and rsync are installed by running the following commands:
```
yum install syslinux
yum install dosfstools
yum install rsync
```
(There may be other packages that you need to yum install, you won't know until you attempt to run the rest of the commands)

Navigate to the home directory and give the solera script execute permissions:
```
cd /home
chmod +x solera-iso-to-usb.sh
```
Run the following command to determine what drives are already on the server:
```
fdisk -l
```
Unplug the device from the network (if your network doesn't allow USB), and plug in the USB stick. Run the same command again to
determine what the USB drive is labeled as (i.e. /dev/sdc). If it shows that is is mounted, run the mount command to unmount it:
```
(Example): umount /dev/sdc1
```
While in the home directory, execute the script:
```
./solera-iso-to-usb.sh --force <name of ISO file> </dev/device_mapping>
(Example): ./solera-iso-to-usb.sh --force atpsa-8.2.6-55530-x86_64-DVD.iso /dev/sdc
```
After the script has finished, you will need to change the server settings to boot from BIOS instead of UEFI. Restart the server, either by pressing the 
power buttonor by using ctrl+alt+delete. When prompted, press F11 to enter BIOS configuration. Change the settings to boot from BIOS and save the settings.
This will prompt a restart again.

While the device is rebooting, press F11 again when prompted to enter BIOS configuration. You will select the USB drive to boot from. This will
prompt the server to boot Solera, and it will run a few automatic updates before rebooting again and prompting to select Solera to boot from again.
After this reboot, you will then be prompted to login to the server.

The default server credentials are:

- Username - admin
- Password - Solera

From here, you will need to configure network settings. The install guide says that you will need to configure eth0, but this is wrong. You
will need to configure bond0.

Run the following commands:
```
sudo ifconfig bond0 <ip_address> netmask <subnet_mask>
sudo route add default gw <default_gateway_ip>
```
Once you have these settings, from a workstation navigate to the IP address you have given your SSA server and login using the admin credentials
above. After accepting the EULA page, you will be on the initial configuration page. If for some reason you are unable to view the initial
configuration page, append this to the end of the URL:

/settings/initial_config

This is the page where you will be able to configure the network settings for your SSA box, and you will need to re-enter the configurations
you initially gave it into this page as well. The settings included on this page are:

Root credentials
Admin credentials
Proxy settings
DNS settings
DHCP
IP address
Default Gateway
