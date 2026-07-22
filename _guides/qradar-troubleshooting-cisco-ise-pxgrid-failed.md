---
title: "Cisco Ise Pxgrid Failed"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Cisco%20ISE%20pxGrid%20Failed"
---

During the configuration of the Cisco ISE pxGrid Application, we kept having two issues occur:

Failed to save QRadar settings - App Settings are already configured
Failed to save deployment settings - 'app_id'

I'll admit, after figuring out the issue, I felt like an idiot.

Login to your QRadar console as root
Find the qapp ID of your pxGrid instance using:

/opt/qradar/store/recon ps

Run the command:

tail -f /store/docker/volumes/qapp-<ID>/log/startup.log

If you're getting the following errors:

"POST /app_settings/clusters HTTP/1.1" 400
"POST /app_settings HTTP/1.1" 400

Clear your browser cache.

If that worked, you'll save yourself the hours I spent trying to figure out what was wrong.
