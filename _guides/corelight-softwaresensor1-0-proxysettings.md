---
title: "Corelight Proxy Settings"
project: "Corelight"
category: "Engineering Guide"
description: "Configuring Proxy Settings for Corelight."
source_url: "https://github.com/PudgyDragon/Corelight/blob/main/SoftwareSensor1.0/ProxySettings.md"
---

# Proxy Settings
If your organization is anything like mine, your network is probably set up with a proxy. The Corelight Software Sensor 1.0 guide doesn't have instructions for setting up behind a proxy. Hopefully this guide will help you. Please use these steps in conjunction with the original Corelight Software Sensor 1.0 guide.

## Note
Please note, this installation was done on a server running RHEL 8.8h; I won't be providing the full installation guide, but will be providing snippits of what sections I have modified to include proxy configurations. Also note, before I was able to successfully get it working, we switched over to the VMware version because of a trial period. If I get the chance, I will come back to this and try to get it working fully.

## Section 2.3

### 2.3.1 Set up the Corelight package repository
Use the option to download the script before running it.

```
curl --proxy http://proxy:port -O https://packages.corelight.com/install/repositories/corelight/stable/script.rpm.sh
```
You may need to edit the `script.rpm.sh` file provided by Corelight to add the proxy to a curl command. I did it for good measure.
```
vim script.rpm.sh
curl --proxy "proxy:port" -sSf "${yum_repo_config_url}" > $yum_repo_path     #Near the bottom, above the long list of echo commands
```
If anything fails to download or error out, you may have to opt for the manual installation. If that happens, it's likely you will have to download the EPEL repository to install certain packages. For me, gpgme failed to install.
```
subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
yum install gpgme
```

Finish up the installation of Corelight's stable package repository:
```
chmod +x script.rpm.sh
./script.rpm.sh
```

### 2.3.2 Online installation
You need to make sure yum uses your proxy by changing your `yum.conf` file:
```
vim /etc/yum.conf
no_proxy=*.<domain> #Trusted domains/IPs on your network
proxy=http://<proxy>:<port>
export no_proxy=*.<domain>
```

## Section 3.4

### 3.4.2 Upload and manage rulesets
```
export http_proxy=proxy:port
export https_proxy=proxy:port
pip3 install --proxy proxy:port suricata-update
```

## Section 3.5 Configure local resource monitoring with Grafana

```
yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
vim /etc/yum.repos.d/docker-ce.repo            #Delete all but the first instance, and change RHEL to centos
yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin --allowerasing
vim /usr/lib/systemd/system/docker.service     #Add Environment="HTTP_PROXY=proxy:port" to Service section
pip3 install --proxy proxy:port --upgrade --ignored-installed pip setuptools
pip3 install --proxy proxy:port docker-compose
git config --global http.proxy proxy:port
```
I also added an environment section to the docker-compose.yml, `vim /prometheus-grafana/docker-compose.yml`, for the proxy settings as well that should look something like this:
```
prometheus:
  environment:
    http_proxy: proxy:port
    https_proxy: proxy:port
    no_proxy: proxy:port
grafana:
  environment:
    http_proxy: proxy:port
    https_proxy: proxy:port
    no_proxy: proxy:port
```
I added a `config.json` file to `~/.docker` that should look similar to this:
```
{
        "proxies": {
                "default": {
                        "httpProxy": "proxy:port",
                        "httpsProxy": "proxy:port",
                        "noProxy": "*.domain"
                }
        }
}
```
Lastly, I added `http_proxy.sh` to `/etc/profile.d` with settings like this:
```
export HTTP_PROXY=proxy:port
export HTTPS_PROXY=proxy:port
export NO_PROXY=*.domain
```

With these settings you are able to get to the sensor at port 3000, but still troubleshooting getting to 8989.
