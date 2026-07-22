---
title: "Email Server Setup"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Email%20Server%20Setup"
---

Guide for setting up an email server on QRadar to allow emails to be sent from the SIEM.

The guide found through IBM doesn't have all the steps that I will outline below:
https://www.ibm.com/docs/en/qradar-on-cloud?topic=hosts-adding-email-server

On the Admin tab, under the System Configuration section, click Email Server Management
Click "Add"
Enter a hostname (it can't be an IP)
Enter the port as 25 (default port may be different)
Add a description
There shouldn't be a need for username or password unless otherwise specified
TLS should be enabled
Click "Save"

After adding and configuring the email server, you need to assign it to your host(s):
On the Admin tab, click System and License Management and select the host/console
Ensure Systems is selected in the Display list
Under Actions, select View and Manage System
On the Email Server tab, click the Test Connection button; you may need to have a rule added to your firewall
    to allow the traffic if the test fails
If the test is successful, click "Save"

Once the email server is properly configured, you can add an address:
On the Admin tab, under the System Configuration section, choose System Settings
Change the Alert Email From Address to the desired email address you wish to use
