---
title: "Aws"
project: "MISP"
category: "Threat Intelligence"
description: "A practical threat intelligence for MISP."
source_url: "https://github.com/PudgyDragon/MISP/blob/main/AWS.md"
---

# MISP on AWS
I wrote a quick guide down when I first did this, but forgot to post it until 6 months later. I'm just going to jot down what I had noted. I hadn't worked with AWS much before, and did this on a whim within a couple days of playing around with it.

At the time that I wrote this, the installation of MISP I used was for Debian 12, which can be found at:
- https://github.com/MISP/MISP/blob/2.5/INSTALL/INSTALL.debian12.sh

## AWS Instance
What I found to work on AWS is using a free instance of Debian 12. Once you have a Debian 12 instance up and running, you will need to create and download a key for authentication for using SSH (I prefer putty, because it's what I know best.

If I remember correctly, the default admin username is just `admin` for Debian 12. Create a new putty session using the IP of the AWS instance, with the username of admin. You should be able to configure the connection to use the auth key you created in AWS by navigating to:
```
connection > ssh > auth > credentials > use private key for auth
```

If you're paranoid like me (or have been burnt before like I have from sessions timing out), feel free to install tmux and start an instance using:
```
apt-get install tmux
tmux new -s pudgy
```

Once you are connected to the AWS instance through putty (and have a tmux session going if you're into that), copy and paste the installation script (found at the link above) into a new script file you'll need to create. The past command for debian is `shift + insert`:
```
vim misp_install.sh
```
Before saving the file, make sure to change the `MISP_DOMAIN` variable to whatever domain you're planning to use (at the time, I ended up buying a Namecheap Domain and using a subdomain for MISP). Next, change the OPENSSL info if no SSL cert is provided, then save by hitting `esc` and pressing `:wq!` and press `enter`. Make the script executable by running `chmod +x misp_install.sh`, and then execute it: `./misp_install.sh`

At the time of jotting things down, I *think* that changing the `MISP_DOMAIN` variable within the script file will negate the need to run this command to change the baseurl:
```
/var/www/MISP/app/Console/cake admin setSetting MISP.baseurl https://<yourURL>
```
I *believe* that the command wasn't working for me, so I changed the script itself beforehand.

## Firewall
Make sure to open Inbound rule for any port 80 on the AWS instance until you have at least been able to set up HTTPS. Open port 443 as well.

## Namecheap Domain
If you would like to buy your own domain and add it to this, the quick and dirty after buying it is by making sure the following is true on the Namecheap Website for your domain:
Domains > Details > Advanced DNS
- Type: A Record, Host: misp, IP Address: <AWS IPv4>, TTL: Automatic
- Type: URL Redirect Record, Host: <AWS Address>, Destination: https://<fqdn>, Unmasked

## LetsEncrypt
If you want to get fancy and make it HTTPS, you can follow the guide for LetsEncrypt at:
-https://certbot.eff.org/instructions?ws=apache&os=pip&tab=standard
If you're lazy and just want to stay on this page, and *pray* that my guide is still correct 6 months after I forgot to write it down:
```
sudo su
apt-get update
apt-get install python3 python3-venv libaugeas0
apt-get remove certbot
python3 -m venv /opt/certbot/
/opt/certbot/bin/pip install --upgrade pip
/opt/certbot/bin/pip install certbot certbot-apache
ln -s /opt/certbot/bin/certbot /usr/bin/certbot
certbot --apache
echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
/opt/certbot/bin/pip install --upgrade certbot certbot-apache
```

## Did it work?
If it didn't, I'm sorry. If it did... hurray! Congratz! Enjoy your AWS MISP instance. Pay attention to the usage alerts!
