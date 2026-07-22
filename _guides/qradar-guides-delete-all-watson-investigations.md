---
title: "Delete All Watson Investigations"
project: "QRadar"
category: "STIG"
description: "A practical stig for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Delete%20All%20Watson%20Investigations"
---

**************************************************************************************************************
** I don't recommend using this guide unless you really need to, and you're authorized to do so at your job **
**************************************************************************************************************


This guide will let you delete all Watson investigations from your QRadar instance. We found that while tuning our SIEM,
if you have Watson running automatically and don't keep it in check, Watson will create thousands of investigations
that you will need to manually delete, and doing so from the GUI will crash the client every time.

Login to QRadar as root
Run the following command to find the APP ID of Watson:

/opt/qradar/support/recon ps

(For the sake of this guide, we'll use 1111 as the ID. Please change it to reflect the ID you obtain.)

Run these commands next:

/opt/qradar/support/recon connect 1111
cd /opt/app-root/store
sqlite3 big.sqlite3
delete from investigations;

This will delete all investigations in Watson. You can also choose to delete investigations from a certain
time using the following syntax:

delete from investigations where analysis_time != (epoch time of one of the investigations);
