---
title: "Troubleshoot QRadar Email Delivery Issues"
project: "QRadar"
category: "Troubleshooting"
description: "Troubleshoot IBM QRadar email notifications by verifying Postfix configuration, testing email delivery, and reviewing mail logs."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Email%20Server%20Troubleshoot"
---

## Introduction

If QRadar is not sending email notifications, the issue may be caused by an incorrect Postfix configuration, network connectivity, or communication with the configured SMTP server.

This guide walks through several common troubleshooting steps to help identify why email notifications are not being delivered.

> **Prerequisite**
>
> Before troubleshooting, verify that your email server has been configured correctly by following the **Email Server Configuration** guide in this repository.

> **Symptoms**
>
> - Email notifications are not delivered.
> - Test emails fail to send.
> - Scheduled reports are not emailed.
> - Offense email notifications never arrive.

## Cause

QRadar relies on the Postfix mail service to relay email notifications to an SMTP server. If Postfix is misconfigured, unable to communicate with the mail server, or encounters delivery errors, email notifications will fail.

One issue encountered during troubleshooting involved Postfix attempting to use IPv6 in an environment where only IPv4 connectivity was available.

## Resolution

### Verify the Postfix Configuration

Open the Postfix configuration file.

```bash
vi /etc/postfix/main.cf
```

Locate the following setting:

```text
inet_protocols=all
```

If your environment does not support IPv6, update it to:

```text
inet_protocols=ipv4
```

Save the file.

### Restart Postfix

Restart the Postfix service.

```bash
systemctl restart postfix
```

Verify that the service starts successfully.

```bash
systemctl status postfix
```

If you are actively troubleshooting startup issues, monitor the service.

```bash
watch 'systemctl status postfix'
```

### Send a Test Email

Attempt to send a test email from the command line.

```bash
mail -s "QRadar Test Email" <email_address>
```

> **Note**
>
> Depending on your SMTP configuration, this command may not always verify end-to-end email delivery. If the message does not arrive, continue with the remaining troubleshooting steps.

### Test Email Notifications from the QRadar Interface

If command-line testing is inconclusive, send a test email directly from the QRadar web interface.

Navigate to:

```text
Offenses
    └── Actions
            └── Email
```

Complete the required fields and send a test message.

This verifies QRadar's notification workflow rather than only the underlying mail service.

### Review the Mail Log

Monitor the Postfix mail log while sending a test email.

```bash
tail -f /var/log/maillog
```

Look for:

- Authentication failures
- Connection timeouts
- DNS resolution errors
- Relay permission errors
- SMTP communication failures

### Check the Mail Queue

Verify whether messages are waiting to be delivered.

```bash
mailq
```

A growing mail queue often indicates communication problems with the configured SMTP server.

## Verification

After making any configuration changes:

- Verify the Postfix service is running.
- Send a test email from the command line.
- Send a test email from the QRadar web interface.
- Confirm the email is received successfully.
- Verify no new errors appear in `/var/log/maillog`.
- Confirm the mail queue is empty after successful delivery.

## If the Problem Persists

If email delivery still fails:

- Verify the SMTP server address and port.
- Confirm firewall rules allow communication with the mail server.
- Verify DNS resolution from the QRadar Console.
- Review SMTP authentication settings.
- Check the mail server logs for rejected or blocked messages.
- Verify the mail server accepts connections from the QRadar appliance.

## Additional Resources

- IBM QRadar Email Server Configuration Documentation
- IBM QRadar Notification Configuration Documentation
- Postfix Documentation
