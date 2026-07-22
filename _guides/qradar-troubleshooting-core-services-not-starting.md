---
title: "Core Services Not Starting"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Core%20Services%20Not%20Starting"
---

After installing an update, a lot of services weren't starting. Troubleshooting led to the below solution.

View the core services and whether or not they're starting using this command:

/opt/qradar/upgrade/util/setup/upgrades/wait_for_start.sh

Using the following set of commands, it was determined that the core services weren't starting due to a 95% threshold being exceeded:

dh -Th
mount -o bind / /media/cdrom
cd /media/cdrom
du -hs * | less
ls -l core.*
dmidecode -t system | less
mkdir -pv /store/ibm_support/<file_name>
mv -fv core.* /store/ibm_support/<same_file_name>
df -Th
cd
umount /media/cdrom
df -Th
systemctl restart hostcontext
systemctl status tomcat
systemctl status hostcontext
systemctl status ecs-ec-ingress
systemctl status ecs-ec
systemctl status ecs-ep
/opt/qradar/bin/test_tomcat_connection.sh

Moving the core files that had built up to the ibm_support direcotyr reduced the size of the partition that was being
taken up and allowed the core services to start up again.
