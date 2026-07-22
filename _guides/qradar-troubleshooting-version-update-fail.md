---
title: "Version Update Fail"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Version%20Update%20Fail"
---

During an upgrade between QRadar versions, the following error may occur based on your organization.






**** RHEL 7 ONLY ****


[ERROR] (-i-testmode) sql pretest errored, halting. [6/9] Install & Upgrade Packages failed to complete successfully.
Errors:
Failed yum transaction test

This error can be solved running the following commands:
cat /etc/yum.conf

If you see the following configuration, this may be your issue:
clean_requirements_on_remove=1

Edit the yum.conf file using:
vim /etc/yum.conf

Change the line to:
clean_requirements_on_remove=0

After saving these changes on all managed hosts, run the upgrade again and the error should no longer occur.
