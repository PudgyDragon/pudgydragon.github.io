---
title: "Restoring Yum Repository Access"
project: "Security Analytics"
category: "Engineering Guide"
description: "Restore yum functionality after CentOS repositories are moved to the CentOS Vault."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/yum_updates.md"
---

## Introduction

As older versions of CentOS reach End of Life (EOL), the standard package repositories are eventually removed from the public mirror network. Since Broadcom Security Analytics is built on CentOS, administrators may encounter repository errors when attempting to install packages or update the operating system.

A common error looks similar to:

```text
Cannot find a valid baseurl for repo: base/7/x86_64
```

or

```text
Cannot prepare internal mirrorlist: No URLs in mirrorlist
```

This typically occurs after attempting to install additional packages, create installation media, or perform other maintenance requiring `yum`.

The solution is to point the appliance at the **CentOS Vault** repositories, which archive packages for unsupported CentOS releases.

> **Important**
>
> This procedure restores access to archived CentOS packages. It does **not** update the operating system to a supported release.

> **Warning**
>
> Security Analytics is a vendor appliance. Installing arbitrary operating system packages should be done carefully and only when necessary. Changes outside Broadcom's supported configuration may complicate future support cases.

## Prerequisites

Before beginning:

- Log in as `root`.
- Verify the appliance is experiencing repository errors.
- Back up the existing repository configuration files.

## Step 1 – Navigate to the Repository Directory

Change to the yum repository directory.

```bash
cd /etc/yum.repos.d
```

The following repository files typically require modification.

```text
CentOS-Base.repo
CentOS-CR.repo
CentOS-fasttrack.repo
CentOS-Sources.repo
CentOS-Vault.repo
```

> **Field Note**
>
> Depending on the Security Analytics version, additional repository files may exist. Apply the same process to any repository still referencing the retired CentOS mirror infrastructure.

## Step 2 – Disable Mirror Lists

Open each repository file using your preferred editor.

Example:

```bash
vim CentOS-Base.repo
```

Locate every line beginning with:

```text
mirrorlist=
```

Comment each line.

Example:

```text
#mirrorlist=http://mirrorlist.centos.org/...
```

Mirror lists no longer function for End of Life CentOS releases because the public mirrors have been retired.

## Step 3 – Enable the Vault Repository

Locate the corresponding `baseurl=` entries.

Uncomment each one.

Example:

```text
baseurl=http://mirror.centos.org/...
```

Change the hostname from:

```text
mirror.centos.org
```

to:

```text
vault.centos.org
```

Repeat this process for each enabled repository.

## Step 4 – Verify Repository Access

After saving the repository files, clean the yum cache.

```bash
yum clean all
```

Rebuild the repository metadata.

```bash
yum makecache
```

If no repository errors are displayed, yum should once again be able to access the archived package repositories.

## Verification

Confirm the repository configuration is functioning.

For example:

```bash
yum repolist
```

or

```bash
yum check-update
```

If the configured repositories are accessible, yum should successfully download repository metadata without reporting base URL errors.

## Troubleshooting

If repository errors continue:

- Verify every `mirrorlist=` entry has been commented out.
- Confirm every `baseurl=` entry references `vault.centos.org`.
- Ensure the appliance has Internet connectivity.
- Verify DNS resolution is functioning correctly.
- Confirm no proxy or firewall is blocking outbound HTTP or HTTPS traffic.

> **Field Note**
>
> I originally encountered this issue while preparing a new Security Analytics installation device. At first it appeared to be related to the installation process itself, but the underlying cause was simply that the standard CentOS mirrors had been retired. Pointing the repositories to the CentOS Vault immediately restored yum functionality.
