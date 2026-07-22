---
title: "Interimfixissues"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/InterimFixIssues.md"
---

# This is a guide for a few issues that occurred when attempting to do an interim fix for Update Package 7 Interim Fix 6.

## Issues
When logging in to the GUI, I noticed there were undeployed changes, but when I tried to deploy them, I kept getting an error that they couldn't be deployed. 
It didn't really say what logs the error was saved to, but checking the normal locations I couldn't really figure out what was wrong, but a main concern was /var/log/httpd was full.
I used a couple different steps to bypass the issue and clean up the logs.

## /var/log/httpd full
Running the command `df -Th` I noticed that httpd was 100% full. I moved them for the time being to /store/IBM_Support. You may have a better place to store them on your machine.
```
mkdir -pv /store/IBM_Support/
```
Move any archieved/zipped logs from /var/log and /var/log/httpd to whatever location you've deteremined.
One log file in particular was causing the bulk of the issue. Once I copied it over to another location, I used the following command to release the space
```
truncate -s0 /var/log/httpd/<log_file>
```

## Unable to deploy changes on GUI
There were a couple guides I used to solve this issue. I ran the following commands to list the hosts, and view their deployment statuses
```
ls -latr /store/tmp/status | grep deployment
cat /store/tmp/status/deployment.<IP>
```
I moved the deployment statuses to the tmp directory using
```
mv /store/tmp/status/deployment.<IP> /tmp
```
Aftwards, you need to restart the hostcontext with the following command (for 7.3 and above)
```
systemctl restart hostcontext
```
After running these commands, I followed the guide to try to use Deploy Changes on the Admin page, but it still didn't work. I followed another guide to manually deploy the changes from the CLI
```
cd /opt/qradar/upgrade/util/setup/upgrades
./do_deploy.pl
```
The `do_deploy.pl` command manually deployed any changes that I couldn't deploy from the GUI.

## Resolution
After freeing up disk space in /var/log/httpd, and manually deploying changes on CLI, I was finally able to run the interim fix update.
