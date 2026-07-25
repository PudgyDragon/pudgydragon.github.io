---
title: "QRadar Email Server Configuration"
project: "QRadar"
category: "Engineering Guide"
description: "Configure an SMTP email server for QRadar notifications and alerts."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Email%20Server%20Setup"
---

## Introduction

QRadar uses an SMTP email server to send notifications, scheduled reports, and rule-generated alerts. Before email notifications can be delivered, an email server must be configured and assigned to the appropriate managed hosts.

This guide walks through configuring an SMTP email server, validating connectivity, and assigning a sender address for outbound email.

## Configure the Email Server

Navigate to:

- **Admin**
- **Email Server Management**

Select **Add** and configure the following settings:

- **Hostname:** Enter the fully qualified domain name (FQDN) of the SMTP server.
  - QRadar requires a hostname and does not accept an IP address.
- **Port:** `25`
  - Your environment may use a different SMTP port (for example, `587` or `465`).
- **Description:** Enter a meaningful description for the server.
- **Username / Password:** Leave blank unless SMTP authentication is required.
- **TLS:** Enable if supported or required by your mail server.

Select **Save** to create the email server.

## Assign the Email Server to a Host

After creating the email server, assign it to the appropriate managed host.

Navigate to:

- **Admin**
- **System and License Management**

Select the desired Console or managed host.

From the **Display** list, ensure **Systems** is selected.

Choose:

- **Actions**
- **View and Manage System**

Open the **Email Server** tab.

Select **Test Connection** to verify connectivity.

> **Note:** If the connection test fails, verify that any required firewall rules allow the QRadar host to communicate with the SMTP server.

If the test succeeds, select **Save**.

## Configure the Sender Address

Configure the email address that QRadar uses as the sender for outbound messages.

Navigate to:

- **Admin**
- **System Settings**

Set **Alert Email From Address** to the desired sender email address.

Save the configuration.

## Verification

Verify the configuration by:

- Successfully completing the **Test Connection**.
- Triggering a test notification or report.
- Confirming that the email is delivered from the configured sender address.

## Additional Resources

- IBM Documentation:
  https://www.ibm.com/docs/en/qradar-on-cloud?topic=hosts-adding-email-server
