---
title: "Uninstall Preview Fix"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Uninstall%20Preview%20Fix"
---

Guide for fixing the error: Installation or removal of application fails with the error:
"another preview/install/uninstall task is currently in process"

Guide can be found at:
https://www.ibm.com/support/pages/qradar-installation-or-removal-application-fails-error-another-previewinstalluninstall-task-currently-process#:~:text=Diagnosing%20The%20Problem%201%20Log%20in%20to%20the,task%20is%20currently%20in%20process%20%22%20shows%20up.

Login to console CLI as root
Backup the content_package table with:
mkdir -p /store/IBM_Support/
pg_dump -U qradar -t content_package -inserts -f /store/IBM_Support/content_package.sql-$(date+%F)

Run psql command to determine ID
psql -U qradar -c “select hub_id, content_status, id from content_package where content_status not in (3,6,9);”

Update content_package table and set conflicting IDs in the content_status column to 6 (uninstalled status):
psql -U qradar -c “update content_package set content_status = 6 where id=’<ID>’;”

Rerun psql command to ensure there's no output:
psql -U qradar -c “select hub_id, content_status, id from content_package where content_status not in (3,6,9);”

Clear Browser Cache

Login to GUI and attempt to install application or content package again.
