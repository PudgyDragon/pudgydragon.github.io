---
title: "Email Server Troubleshoot"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Email%20Server%20Troubleshoot"
---

Troubleshooting guide for emails not being sent out from QRadar

**Please refer to other repository Email Server Configuration before going through this guide**

Login to the console CLI as root
Edit main.cf with the following:
vim /etc/postfix/main.cf
---Update inet_protocols=all to inet_protocols=ipv4

Restart postfix and check the status using:
systemctl restart postfix
systemctl status postfix
watch 'systemctl status postfix'

Send a test email to see if it's working (it may not work with this method):
mail -s "Test email" <email address>

If the above doesn't work, try going to Offenses > Actions> Email, and fill out the fields and send a test email.

Check tail of mail log for errors using:
tail -f /var/log/maillog

Check for any mail in the queue:
mailq
