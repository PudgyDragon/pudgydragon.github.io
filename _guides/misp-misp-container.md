---
title: "Misp Container"
project: "MISP"
category: "Threat Intelligence"
description: "A practical threat intelligence for MISP."
source_url: "https://github.com/PudgyDragon/MISP/blob/main/MISP_Container.md"
---

# MISP Container
### Updates coming soon

This is a guide for installing MISP on Docker. It assumes that you already have Docker installed. Some of the specs of the environment include:

- Behind a Proxy
- RHEL
- Repurposed Dell Server

The guide repository we used for our MISP install was:
- https://github.com/MISP/docker-misp

The repository we cloned is:
- https://github.com/harvard-itsecurity/docker-misp.git

If you're not sitting behind a proxy, the installation guide from the docker-misp repository is pretty straight forward and you don't need to continue reading this guide.

To clone the repository, navigate to the home directory if you're not already there using:
```
cd ~
```
Use the following syntax to clone with your proxy:
```
git clone https://github.com/harvard-itsecurity/docker-misp.git --config "http.proxy=http://<proxyHost>:<proxyPort>"
```
## Modify build.sh
Once it's been cloned, modify the build.sh file with the recommended changes
```
cd docker-misp
vi build.sh
# Change all passwords (MYSQL, GPG)
# Change at LEAST "MISP_FQDN" to your FQDN (domain)
```
## Add Proxy to Dockerfile
Once that's done, you will need to add your proxy to the Dockerfile
```
cd /docker-misp/container
vi Dockerfile
```
Under the following line:
```
ENV DEBIAN_PRIORITY critical
```
Add the following:
```
ENV HTTP_PROXY="http://<proxyHost>:<proxyPort>"
ENV HTTPS_PROXY="https://<proxyHost>:<proxyPort>"
```
During our installation, we discovered that PIP/PIP3 doesn't like doing things behind a proxy unless specified either in a PIP config or in the commands used. We also discovered that we needed to ensure that the proxy stayed persistent after each use of `sudo`. To do both of these things, the following command was used:
```
sed -i 's/sudo /sudo --preserve-env=HTTP_PROXY,HTTPS_PROXY,http_proxy,https_proxy /g' /docker-misp/container/Dockerfile
```
This will replace all instances of `sudo` in the Dockerfile to preserve the proxy environment. There is one instance of `sudo` that will need to remain the same. You will find it in the following lines:
```
ENV DEBIAN_PRIORITY critical
RUN apt-get update && apt-get install -y supervisor ... sudo ...
```
In that one instance, delete the `--preserve-env=HTTP_PROXY,HTTPS_PROXY,http_proxy,https_proxy` and leave the remaining, saving the file with `:wq!`.

## Run the build
Make sure you're in the right directory and run the the build script:
```
cd /docker-misp
./build.sh
```
This will take a while, and many of the steps may seem like they hang for a while. Don't be discouraged unless you receive an error that exits the build.
## Finishing up
If you got through the build process, you can finish up with the rest of the guide that was provided. If you're lazy like I am at times, I've also provided the rest below:
```
# Make a DB directory
mkdir -p /docker/misp-db

# Initialize the DB
docker run -it --rm \
    -v /docker/misp-db:/var/lib/mysql \
    harvarditsecurity/misp /init-db

# Start the Container
docker run -it -d \
    -p 443:443 \
    -p 80:80 \
    -p 3306:3306 \
    -p 6666:6666 \
    -v /docker/misp-db:/var/lib/mysql \
    harvarditsecurity/misp

# Access Web URL
Navigate to the MISP_FQDN you defined
Login: admin@admin.test
Password: admin
```
## Extra
If you're like my team, it's likely you have other containers you're wanting to run with MISP (like OpenCTI). The guide we followed doesn't tell you how to keep the build persistent in the event you need to restart docker. To do so, you will need to edit an existing `docker-compose.yml` file. The location may vary; `cd` to the location and run `vi docker-compose.yml`. To ensure the build will run with docker compose, add the following information to the `services:` section of the file:
```
misp:
  image: harvarditsecurity/misp
  ports:
    - "80:80"
    - "443:443"
    - "3306:3306"
    - "6666:6666"
  volumes:
    - /docker/misp-db:/var/lib/mysql
  restart: always
```
Before it will work properly (running `docker-compose` may create a second instance) you will need to stop the current docker container of MISP. You can find if MISP is currently running using:
```
docker ps
```
If you see the MISP container `UP`, you will need to run:
```
docker stop <containerID>
```
From the directory your `docker-compose.yml` file is in, run:
```
docker-compose up -d
```
Your MISP container is now part of the docker-compose.yml along with your other containers, and they are all able to be controlled with `docker-compose` together.

## Issues?
If you're still having issues with docker-misp through your proxy, there may be a few other places you need to add proxy settings. I will add those soon.

(more configs coming soon)
