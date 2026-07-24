---
title: "Corelight Fleet Manager Deployment"
project: "Corelight"
category: "Engineering Guide"
description: "Deploy Corelight Fleet Manager on Proxmox Virtual Environment."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/VMwareSensor/FleetManager.md"
---

# Introduction
As you probably guessed from the title, this is a guide for getting Corelight VMware v27.7 installed and running on Proxmox. There are plenty of guides online to get you up and running with a Proxmox server if you don't already have one, but I will also be creating a guide on getting it set up too in the future. For our installation of Fleet Manager, we installed RHEL 8.8 as a VM on Proxmox. Our servers are also behind a proxy server.

### Please note, we had some issues setting up Fleet Manager using the guide given to us from Corelight. I was able to get it running by changing a few of their settings. It will only be used during testing and not in production.

## Requirements
Make sure that when you have installed RHEL 8 that you make partitions as required by Corelight. I forgot to do this and had to manually create them. Save some time by doing it right the first time! These are the numbers I used:
- /boot: 1G
- /: 44G
- SWAP: 5G
- /tmp: 20G
- /var: 80G

## Proxmox Settings
### Hardware Settings
You should try to use these settings if possible for setting up Fleet Manager:
- Memory: 32 GiB
- Processors: 4 (1 socket, 4 cores)
- Bios: SeaBIOS
- SCSI Controller: VirtIO SCSI single
- Hard Disk (scsi0): 50G
- Hard Disk (scsi1): 100G
- Network Device (net0): virtio=(mac),bridge=vmbr0
### Options
- Boot Order: scsi0

## Corelight Stable Package Repository
Once you have RHEL 8.8 set up on Proxmox, you should be able to follow the guide with minor changes to account for the proxy server. Unfortunately, you can't run the initial script as it; you will need to download it and modify an internal `curl` command.

Add your proxy to the `/etc/yum.conf` file under `[main]`
```
vim /etc/yum.conf
proxy=http://proxy:port
```
Begin downloading the Corelight Stable package repository
```
curl -O --proxy "http://proxy:port" "https://packages.corelight.com/install/repositories/corelight/stable/script.rpm.sh"
vim script.rpm.sh
# The curl command to changes will be near the bottom
curl -sSf --proxy "http://proxy:port" "${yum_repo_config_url}" > $yum_repo_path
# If you're still having issues, you may have to run this to get the stable repository
curl -sSf --proxy "http://proxy:port" "https://packagecloud.io/install/repositories/corelight/stable/config_file.repo?os=rhel&dist=8&source=script"
# Continue the guide
sudo chmod +x script.rpm.sh
sudo ./script.rpm.sh
```
If you're using a local entitlement server for RHEL that you don't need to use the proxy for (because it won't allow it), you can specify which yum repositories to not have a proxy for using a command similar to this:
```
subscription-manager repo-override --repo "rhel....-rpms" --add=proxy:_none_
```
Replacing the "rhel....-rpms" with the name of the repository you don't need to use the proxy for. This will bypass any repositories used through your local entitlement server, allowing the proxy to only be used for external repositories like Corelight.


Some packages may not install because they're not found (we had this issue with pygpgme). We were able to run the following and get it to work fine:
```
yum install gpgme yum-utils
```
Follow the rest of the guide to see if you're able to download Fleet Manager the way it's intended. If you're having issues getting the corelight-fleetd.service to start, come back and try the next steps

## Corelight Service Doesn't Start
If you're reading this, your service probably didn't start. We had this issue because permissions weren't being properly set somewhere. I was able to bypass this by setting some of the values to root. 

***Again, please note this should not be used in a production environment, work with Corelight Support to get it set up properly without having to make my modifications.***

Instead of setting permissions for the certificate file to corelight-fleetd, change it to:
```
chown root:corelight-fleetd /etc/corelight-fleetd.pem
```
You will then need to make two more modifications, the first being:
```
vim /etc/systemd/system/corelight-fleetd.service
# Comment out:
User=corelight-fleetd
Group=corelight-fleetd
# Add:
User=root
Group=root
```
Lastly, make this modification:
```
vim /usr/bin/corelight-fleetd
# Comment out ther first section that looks for root user and switches to corelight-fleetd

#user="$(id -u)"
#if [ "$user" = '0' ]; then
#    script=$(readlink -f "$0")
#    exec sudo -u corelight-fleetd "$script" "$@"
#fi
```
Run the following commands to make sure the daemon and docker are properly configured:
```
systemctl daemon-reload
systemctl restart docker
```
You should be able to start Corelight now and have it working:
```
systemctl start corelight-fleetd
```
