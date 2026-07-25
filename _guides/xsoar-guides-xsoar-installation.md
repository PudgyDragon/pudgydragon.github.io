---
title: "Install Cortex XSOAR on Red Hat Enterprise Linux"
project: "XSOAR"
category: "Engineering Guide"
description: "Deploy Cortex XSOAR 6.14 on Red Hat Enterprise Linux 9.6 in an on-premises environment, including STIG considerations, prerequisite configuration, and post-installation setup."
source_url: "https://github.com/PudgyDragon/XSOAR/blob/main/Guides/XSOAR_Installation.md"
---

## Introduction

This guide documents the installation of **Palo Alto Cortex XSOAR 6.14**
on **Red Hat Enterprise Linux 9.6** in an on-premises environment.

The deployment documented here was completed in a **DISA STIG**
environment (without FIPS enabled). During our deployment, several
required configuration steps were identified through troubleshooting
that were not fully covered by the vendor documentation. This guide
preserves those lessons learned while remaining concise and
deployment-focused.

> **Important**
>
> This guide assumes you are performing the installation as the `root`
> user (for example, after running `sudo su`).

## Enable FIPS During Installation (Optional)

If installing in a STIG environment and FIPS compliance is required,
enable FIPS during the RHEL installation.

``` text
Press e at the GRUB menu
Add fips=1 after "quiet" or "rhgb"
Ctrl + x to save and boot
```

## Software Versions

This guide was validated using:

-   RHEL 9.6
-   Palo Alto Cortex XSOAR 6.14

## System Requirements

The following hardware and partitioning recommendations were used during our deployment. Adjust these values as appropriate for your environment.

| Component | Production | Development |
|-----------|------------|-------------|
| **CPU** | 16 CPU Cores | 8 CPU Cores |
| **Memory** | 32 GB RAM | 16 GB RAM |
| **Storage** | 1 TB SSD (minimum 3k dedicated IOPS) | 500 GB SSD |
| **`/var`** | 900 GB | 450 GB |
| **`/tmp`** | 10 GB | 10 GB |
| **`/var/lib/demisto`** | 1 TB | 200 GB |
| **`/home`** *(Podman)* | 150 GB | 70 GB |
| **`/var/lib/docker`** *(Docker)* | 150 GB | 70 GB |

> **Note**
>
> This deployment used **Podman**. Adjust partition sizes as necessary to meet your organization's storage requirements, RHEL installation standards, and any applicable DISA STIG guidance.


## Signed Installer and Public Key

During our deployment, the signed public key URL referenced by Palo Alto
Networks was outdated. We obtained the correct public key by opening a
support case. If the URLs are corrected in the future, they should
follow the format below.

### Signed Installer

``` text
https://download.demisto.com/download-params?token=YOURTOKEN&email=REGISTEREDEMAIL&downloadName=signed
```

### Signed Public Key

``` text
https://download.demisto.com/download-params?token=YOURTOKEN&email=REGISTEREDEMAIL&downloadName=signed_public_key
```

After downloading both files, copy them to the server and prepare the
installer.

``` bash
mkdir /tmp2
mv ./*.sh /tmp2
rpm --import sign_public.key
cd /tmp2
chmod +x signed_demistoserver-6.14-3036535.sh
```

## Configure a Proxy (Optional)

If your environment requires an outbound proxy, configure both
`/etc/profile` and `/etc/environment`.

> **Field Note**
>
> During our deployment, configuring both files ensured that every
> installer component inherited the proxy configuration correctly.

Edit `/etc/profile`.

``` bash
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

:wq
```

Edit `/etc/environment`.

``` bash
vim /etc/environment

HTTP_PROXY="http://proxyserver:port/"
HTTPS_PROXY="http://proxyserver:port/"
FTP_PROXY="http://proxyserver:port/"
NO_PROXY="<put all things you don't want proxy to be used for>"
http_proxy="http://proxyserver:port/"
https_proxy="http://proxyserver:port/"
ftp_proxy="http://proxyserver:port/"
no_proxy="<put all things you don't want proxy to be used for>"

:wq
```

Restart NetworkManager.

``` bash
systemctl restart NetworkManager
```

Log out and back into the server to ensure the updated environment
variables are applied to your session.

## Update RHEL and Install Dependencies

If you use a Red Hat Satellite server, ensure the **EPEL 9** content is
enabled before continuing.

Update the operating system and install the required dependencies.

``` bash
yum update

yum -y install systemd xmlsec1 xmlsec1-openssl rpm-build libcap dnf-utils file fontconfig expat libpng freetype git slirp4netns fuse-overlayfs dbus-x11 git

rpm --import https://dl.fedoraproject.org/pub/epel/RPM-GPG-KEY-EPEL-9

dnf upgrade

yum -y install makeself
yum -y install container-tools
yum -y install snapd
yum -y install docker

systemctl enable --now snapd.socket

snap set system proxy.http="http://proxyserver:port/"
snap set system proxy.https="http://proxyserver:port/"

snap install chromium
```

> **Important**
>
> Even if you plan to use Podman, install the Docker package. It was
> required for a successful installation during our deployment.

## Authenticate to Docker Hub

Create a free Docker Hub account before running the installer. Logging
in increases the anonymous image pull limit and helps prevent
installation failures caused by rate limiting.

``` bash
podman login docker.io
```

Enter your Docker Hub username and password when prompted.

## Run the Installer

Launch the installer.

``` bash
./signed_demistoserver-6.14-3036535.sh --target ./tmp -- -do-not-start-server=true --git=false
```

During the installation:

-   Accept the EULA.
-   Complete the installation prompts.
-   Create the administrator account.
-   Do **not** automatically start the server.
-   Leave Git disabled during installation.

> **Important**
>
> During our deployment, the installer prompted for HTTPS port **443**,
> but the completed installation defaulted to **8443**. Verify which
> port the service is actually listening on before troubleshooting
> connectivity.

After the installation completes, verify the installer reports success
and indicates that the server was **not** started automatically.

## Configure the `demisto` User

Add the required subordinate UID and GID ranges.

``` bash
usermod --add-subgids 10000-75535 demisto
usermod --add-subuids 10000-75535 demisto
```

## Configure Podman

Run the Podman migration.

``` bash
podman system migrate
```

Create the required container configuration.

``` bash
mkdir ~/.config/containers
touch ~/.config/containers/mounts.conf
```

## Configure User Namespaces

Edit `/etc/sysctl.d/99-sysctl.conf`.

``` bash
vim /etc/sysctl.d/99-sysctl.conf
```

Add or modify:

``` text
user.max_user_namespaces = 50000
```

## Enable User Lingering

Determine the UID of the `demisto` user.

``` bash
cat /etc/passwd
```

Enable lingering using the discovered UID.

``` bash
loginctl enable-linger DEMISTO_UID
```

## Configure Podman Registries

Edit `/etc/containers/registries.conf`.

``` bash
vim /etc/containers/registries.conf
```

Add or modify:

``` text
short-name-mode="permissive"
```

## Disable Demisto and Reboot

``` bash
systemctl disable demisto
reboot
```

## Initialize the Demisto Home Directory

After rebooting:

``` bash
sudo -su demisto
cd ~
exit
```

## Configure `fapolicyd`

Edit the rules file.

``` bash
vim /etc/fapolicyd/rules.d/21-updaters.rules
```

Add:

``` text
allow perm=any exe=/usr/bin/git all : ftype=text/x-perl
```

Reboot once more.

``` bash
reboot
```

## Initialize XSOAR

Start the service.

``` bash
systemctl start demisto
```

Wait **at least two minutes** for initialization.

Stop the service.

``` bash
systemctl stop demisto
```

## Initialize the Git Repository

``` bash
cd /var/lib/demisto/versionControlRepo

git init
git config user.name "DBot"
git config user.email "<>"
git config core.quotepath "false"
git config advice.skippedCherryPicks "false"

git remote add origin file:///var/lib/demisto/versionControlRepo

git commit --allow-empty --message="New repository"

exit
```

> **Field Note**
>
> During our deployment, `git remote add origin` reported that the
> remote already existed. Attempt the command anyway if it has not
> already been configured.

## Enable the Service

``` bash
systemctl enable demisto
systemctl start demisto
```

## Configure the Firewall

``` bash
firewall-cmd --add-port=443/tcp --zone=public --permanent
firewall-cmd --add-port=8443/tcp --zone=public --permanent
firewall-cmd --reload
```

> **Important**
>
> Our installation listened on **8443** even though the installer
> prompted for **443**. Palo Alto indicated this may be related to STIG
> deployments, so verify which HTTPS port your system is using.

## Verification

Verify:

-   `systemctl status demisto`
-   Browse to the server FQDN on the correct HTTPS port.
-   Log in using the administrator account created during installation.
-   Confirm the firewall rules are present.

## Next Steps

The server is now ready for additional post-deployment configuration
such as replacing the default SSL certificate, configuring integrations,
and connecting a remote Git repository.
