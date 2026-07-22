---
title: "Yum Updates"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/yum_updates.md"
---

# Yum Updates
Quick guide for updating the yum repo. When trying to do updates, you get errors stating that it cannot find a valid baseurl. This came after trying to create a new USB installation device.

## Files to Change
`cd` into the following folder:
```
/etc/yum.repos.d
```
The following files need to be changed:
```
CentOS-Base.repo
CentOS-CR.repo
CentOS-fasttrack.repo
CentOS-Sources.repo
CentOS-Vault.repo
```
## What to Change
You will need to comment out, using `#`, any line that references `mirrorlist=`, and uncomment out the lines that reference `baseurl=`. Change the url from `mirror.centos.org` to `vault.centos.org`.
Do this for all instances and save the files. You should be able to run `yum` commands in SSA again.
