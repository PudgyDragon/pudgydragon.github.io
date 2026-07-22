---
title: "Xsoar Installation"
project: "XSOAR"
category: "Engineering Guide"
description: "A practical engineering guide for XSOAR."
source_url: "https://github.com/PudgyDragon/XSOAR/blob/main/Guides/XSOAR_Installation.md"
---

# Palo Alto XSOAR Installation
This is a guide for installation of XSOAR on prem. The installation guide and support from Palo wasn't 
very... supportive, so myself and a coworker figured it out through trial and error. The guide assumes you're
installing in a STIG environment, but not with FIPS. The hardware we used will probably differ from yours, 
but it *should* work just the same. If not, well... I'm sorry? I guess. Also, the guide assumes that you
are using root permissions with `sudo su` from the beginning, because what even is best security practices?

### IMPORTANT
If you are installing in a STIG environment, to be 100% compliant, during the RHEL installation do the following:
```
Press e at the grub menu
Add fips=1 after "quiet" or "rhbg"
Ctrl + x to save and boot
```

## Software Versions
For this install, it will be based off using RHEL 9.6 and Palo XSOAR version 6.14

## System Requirements
Based on your type of environment, follow similar recommendations for hardware and RHEL partitioning:

### Production Environment
- CPU: 16 CPU Cores
- Memory: 32GB RAM
- Storage: 1TB SSD with minimum 3k dedicated IOPS
- /var: 900GB
- /tmp: 10GB
- /var/lib/demisto: 1TB
- If Using Podman:
  - /home: 150GB
- If Using Docker:
  - /var/lib/docker: 150GB

### Dev Environment
- CPU: 8 CPU cores
- Memory: 16GB RAM
- Storage: 500GB SSD
- /var: 450GB
- /tmp: 10GB
- /var/lib/demisto: 200GB
- If Using Podman:
  - /home: 70GB
- If Using Docker:
  - /var/lib/docker: 70GB

We installed with the plan of using Podman. Follow whatever guidelines you need to for other RHEL partitioning,
such as DISA STIG requirements, along with the basic necessities for a RHEL install.

## Signed Installer and Key
You will need to contact Palo for the proper signed public key, as they haven't updated it and the URL they provide
in their installation guides are currently wrong. The format for the installers, however, *should* follow this format
in the event they update the signed public key:

### Signed Installer
`https://download.demisto.com/download-params?token=YOURTOKEN&email=REGISTEREDEMAIL&downloadName=signed`
### Signed Public Key
`https://download.demisto.com/download-params?token=YOURTOKEN&email=REGISTEREDEMAIL&downloadName=signed_public_key`

Once you have these, SCP them onto your RHEL device for the installation and run the following from the folder
you placed them in:
```
mkdir /tmp2
mv ./*.sh /tmp2
rpm --import sign_public.key
cd /tmp2
chmod +x signed_demistoserver-6.14-3036535.sh
```

## Proxy
If you live behind a proxy, you will need to edit a couple areas to allow for outbound traffic. For some reason
we had to edit both `/etc/profile` AND `/etc/environment`, probably because I'm not a RHEL expert and don't know
how to properly do things. Regardless, they should be edited to something similar:
```
vim /etc/profile
PROXY_URL="http://proxyserver:port/"
export HTTP_PROXY="$PROXY_URL"
export HTTPS_PROXY="$PROXY_URL"
export FTP_PROXY="$PROXY_URL"
export NO_PROXY="<put all things you don't want proxy to be used for>"
export http_proxy="$PROXY_URL"
export https_proxy="$PROXY_URL"
export ftp_proxy="$PROXY_URL"
export no_proxy="<put all things you don't want proxy to be used for>"
esc
:wq!
enter
```
```
vim /etc/environment
HTTP_PROXY="http://proxyserver:port/"
HTTPS_PROXY="http://proxyserver:port/"
FTP_PROXY="http://proxyserver:port/"
NO_PROXY="<put all things you don't want proxy to be used for>"
http_proxy="http://proxyserver:port/"
https_proxy="http://proxyserver:port/"
ftp_proxy="http://proxyserver:port/"
no_proxy="<put all things you don't want proxy to be used for>"
esc
:wq!
enter
```
Once your proxy settings are set, run
```
systemctl restart NetworkManager
```
and log out and back into the device to make sure the global settings are current for your session.

## RHEL Updates
Assuming you have a have a RHEL Satellite server you use, make sure the EPEL9 content is set to enabled and do
a `yum update`. From there, run the following commands to make sure you have all the dependencies you need
for the installation:
```
yum -y install systemd xmlsec1 xmlsec1-openssl rpm-build libcap dnf-utils file fontconfig expat libpng freetype git slirp4netns fuse-overlayfs dbus-x11 git
rpm --import https://dl.fedoraproject.org/pub/epel/RPM-GPG-KEY-EPEL-9
dnf upgrade
yum -y install makeself
yum -y install container-tools
yum -y install snapd
yum -y install docker
systemctl enable --now snapd.socket
snap set system proxy.http="http://proxyserver:port/"
snap set system.proxy.https="http://proxyserver:port/"
snap install chromium
```
And yes, even if you plan to use Podman, you need to make sure to do a `yum install docker`.

## Podman Account
Before you run the installation script, create a free docker.io account so you can have an increased daily pull
limit, otherwise you may not be able to successfully run the installer. Once you've done so, on your device run:
```
podman login docker.io
```
and enter your username and password when prompted. This will increase your daily pull limit by double.

## Installer
Now you should be able to start the installer:
```
./signed_demistoserver-6.14-3036535.sh --target ./tmp -- -do-not-start-server=true --git=false
```
Make sure to specify that you don't want to auto start the server, and git is set to false at this point in time.
Again, their documentation is lacking, and regardless of what you put for the defaults when prompted (such as
the default HTTPS server you wish to use) it will ACTUALLY default to port 8443. So remember that. But I'll say it
again. For now, go through the prompts, accept the EULA, pretend to accept 443 as the default, whether or
not you plan to use Elasticsearch, and create an admin with username/password.

Once it's done installing, you should have some success messages and it should say that the server
wasn't started yet (which you said not to do in the prompt).

## Things and Stuff
After the installation is complete, there are quite a few commands to be ran that Palo says to do, so we must
follow them in order for the application to actually work properly:
```
# Add gid and uid to demisto user: 
usermod --add-subgids 10000-75535 demisto
usermod --add-subuids 10000-75535 demisto

# Podman things: 
podman system migrate

# I think this gets rid of the possibility of some kind of error?:
mkdir ~/.config/containers
touch ~/.config/containers/mounts.conf

# Modify or add user.max_user_namespaces:
vim /etc/sysctl.d/99-sysctl.conf
user.max_user_namespaces = 50000

# Find the UID of the Demisto user with cat, and replace DEMISTO_UID in the subsequent command:
cat /etc/passwd
loginctl enable-linger DEMISTO_UID

# Modify or add short-name-mode:
vim /etc/containers/registries.conf
short-name-mode="permissive"

# Disable Demisto and reboot:
systemctl disable demisto
reboot

# Once booted and logged back in (I think these commands are to initialize the file system):
sudo -su demisto
cd ~
exit

# Add the following allow line to this file:
vim /etc/fapolicyd/rules.d/21-updaters.rules
allow perm=any exe=/usr/bin/git all : ftype=text/x-perl

# Reboot again:
reboot

# Start Demisto to let the files initialize and wait AT LEAST 2 minutes:
systemctl start demisto

# If you do a status check, it will show it's running, but I think you need to wait for
# it to say the server is running before you stop the server using:
systemctl stop demisto

# Some git things within the Demisto user:
cd /var/lib/demisto/versionControlRepo
git init
git config user.name "DBot"
git config user.email "<>" (left like this with no actual email)
git config core.quotepath "false"
git config advice.skippedCherryPicks "false"
# This next one gave an error that it already exists, but try anwyways just in case?
git remote add origin file:///var/lib/demisto/versionControlRepo
git commit --allow-empty --message="New repository"
exit

# Make Demisto enabled and start it
systemctl enable demisto
systemctl start demisto

# Firewall exceptions
firewall-cmd --add-port=443/tcp --zone=public --permanent
firewall-cmd --add-port=8443/tcp --zone=public --permanent
firewall-cmd --reload
```

I included both 443 and 8443 because I don't know if your system will have the same thing happen where it actually
defaults to 8443, or if you'll have yours act normal. Palo has stated it's a STIG thing.

## Done
That should do it. You should be able to login to the GUI using the admin username and password you were
prompted to create in the installation process when you go to the FQDN and proper port. I hope it works!
I will include future guides for adding custom SSL and other things. Eventually.




