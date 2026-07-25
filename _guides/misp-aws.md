---
title: "MISP AWS Deployment"
project: "MISP"
category: "Threat Intelligence"
description: "Deploy the Malware Information Sharing Platform (MISP) on Amazon Web Services."
source_url: "https://github.com/PudgyDragon/MISP/blob/main/AWS.md"
---

## Introduction

The Malware Information Sharing Platform (MISP) can be deployed on Amazon Web Services (AWS) using the official Debian installation script. This guide documents a straightforward deployment using a Debian 12 EC2 instance, followed by optional DNS and HTTPS configuration.

At the time of writing, this guide references the official Debian 12 installation script provided by the MISP project.

## Prerequisites

Before beginning, ensure the following are available:

- An AWS account
- A Debian 12 EC2 instance
- An SSH client (PuTTY or another SSH client)
- An EC2 key pair for authentication
- (Optional) A registered domain name
- (Optional) A TLS certificate for HTTPS

## Create the AWS Instance

Deploy a Debian 12 EC2 instance.

After the instance has been created:

- Download the EC2 private key.
- Note the public IPv4 address.
- Verify that SSH access is permitted through the associated Security Group.

If using PuTTY, configure the authentication key under:

```text
Connection
└── SSH
    └── Auth
        └── Credentials
```

## Connect to the Instance

Connect using the default Debian user.

```text
admin
```

> **Note:** The default username may vary depending on the Debian image being used.

For long-running installations, consider using `tmux` so the installation continues if the SSH session disconnects.

```bash
sudo apt update

sudo apt install tmux

tmux new -s misp
```

## Prepare the Installation Script

Download or copy the official Debian 12 installation script from:

- https://github.com/MISP/MISP/blob/2.5/INSTALL/INSTALL.debian12.sh

Create the installation script.

```bash
vim misp_install.sh
```

Before executing the script, update the `MISP_DOMAIN` variable to match the fully qualified domain name that will be used to access MISP.

If a custom TLS certificate will not be used during installation, review the OpenSSL configuration within the script as appropriate for your environment.

Make the script executable.

```bash
chmod +x misp_install.sh
```

Run the installer.

```bash
./misp_install.sh
```

> **Tip:** Setting the `MISP_DOMAIN` variable before running the installer may eliminate the need to manually configure the `MISP.baseurl` setting after installation.

## Configure the AWS Security Group

Ensure the EC2 Security Group allows the required inbound traffic.

| Port | Purpose |
|------|---------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |

Port 80 should remain open until HTTPS has been configured successfully.

## Configure DNS (Example: Namecheap)

If you are using a custom domain, create a DNS record that points your desired MISP hostname to the EC2 instance.

The following example uses **Namecheap**.

Navigate to:

- **Domain List**
- Select your domain
- **Manage**
- **Advanced DNS**

Create an **A Record** with the following values:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | `misp` | `<AWS Public IPv4>` | Automatic |

This creates a hostname similar to:

```text
https://misp.example.com
```

Optionally, create a URL Redirect Record to redirect traffic from the root domain to the MISP hostname.

| Type | Host | Destination | Redirect Type |
|------|------|-------------|---------------|
| URL Redirect Record | `@` | `https://misp.example.com` | Unmasked |

> **Note:** The hostname configured in DNS should match the `MISP_DOMAIN` value configured in the installation script.

## Configure HTTPS with Let's Encrypt

To secure the deployment with a trusted TLS certificate, follow the official Certbot installation instructions:

https://certbot.eff.org/instructions?ws=apache&os=pip&tab=standard

The following commands install Certbot using a Python virtual environment.

```bash
sudo su

apt update

apt install python3 python3-venv libaugeas0

apt remove certbot

python3 -m venv /opt/certbot

/opt/certbot/bin/pip install --upgrade pip

/opt/certbot/bin/pip install certbot certbot-apache

ln -s /opt/certbot/bin/certbot /usr/bin/certbot

certbot --apache

echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null

/opt/certbot/bin/pip install --upgrade certbot certbot-apache
```

## Verification

Verify the deployment by confirming:

- The MISP login page is accessible.
- HTTPS is functioning correctly.
- The TLS certificate is trusted.
- The configured hostname resolves correctly.
- Automatic certificate renewal is configured.

## Additional Resources

- [Official MISP Debian 12 Installation Script](https://github.com/MISP/MISP/blob/2.5/INSTALL/INSTALL.debian12.sh)
- [Certbot Installation Instructions](https://certbot.eff.org/instructions?ws=apache&os=pip&tab=standard)
