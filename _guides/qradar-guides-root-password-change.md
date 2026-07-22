---
title: "Root Password Change"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Root%20Password%20Change"
---

Guide for changing the root password for QRadar

Open CLI, login as root, and run the following commands:

useradd temp
passwd temp
usermod -aG wheel temp

The above commands will create a temporary user in the event you mess up the password change and lock yourself out of root.

Before doing the next steps, duplicate your session and attempt to login to temp and do a sudo su to verify that you
have root privileges as a backup.

From your root session, run:
passwd root

After changing the password and verifying that you can login with your new password, delete the temporary user with:
userdel -rf temp
