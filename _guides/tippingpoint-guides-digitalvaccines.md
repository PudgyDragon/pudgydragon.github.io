---
title: "Manually Updating Digital Vaccines"
project: "TippingPoint"
category: "Engineering Guide"
description: "Manually update Digital Vaccines and supporting threat databases on Trend Micro TippingPoint SMS."
source_url: "https://github.com/PudgyDragon/TippingPoint/blob/main/Guides/DigitalVaccines.md"
---

## Introduction

This guide documents the process of manually updating **Digital Vaccines (DVs)** and supporting threat databases on a **Trend Micro TippingPoint Security Management System (SMS)**.

Most TippingPoint deployments are configured to automatically download and distribute Digital Vaccine updates directly from Trend Micro. However, some environments operate in isolated or restricted networks where Internet connectivity is unavailable. In these environments, updates must be downloaded manually from the **Trend Micro Customer Licensing Portal (TMC)** and imported into the SMS.

This guide assumes all update files have been downloaded to a workstation before being transferred to the SMS.

> **Important**
>
> Importing an update into the SMS does **not** automatically install it on managed TPS devices. Digital Vaccines must be **distributed** and then **activated** before they begin protecting network traffic.

> **Note**
>
> Depending on your organization's security requirements, manually downloading update packages may require transferring the files through an approved staging process before they are imported into the SMS.

## Prerequisites

Before beginning:

- Administrative access to the SMS
- Access to the Trend Micro Customer Licensing Portal (TMC)
- Appropriate product licensing
- Downloaded update files
- Healthy communication between the SMS and all managed TPS devices

## Step 1 – Download the Update Packages

Log in to the **Trend Micro Customer Licensing Portal (TMC)**.

Download the following update packages.

| Update | TMC Location |
|---------|--------------|
| Digital Vaccine | Releases → Digital Vaccines |
| Auxiliary Digital Vaccine | Releases → ThreatDV → AuxiliaryDV (Malware) |
| ThreatDV URL Reputation | Releases → ThreatDV → SMS URL Reputation Feed |
| ThreatDV IP Reputation | Releases → ThreatDV → SMS Full Reputation Feed |
| Geo Locator Database | Releases → Software → SMS → Geo Location |

> **Field Note**
>
> Not every environment uses every update type. Verify which features are licensed and enabled before downloading unnecessary packages.

## Step 2 – Import the Digital Vaccine

Navigate to:

```text
Profiles
└── Digital Vaccines
```

Select:

```text
Import
```

Choose the downloaded Digital Vaccine package.

After the import completes:

1. Select the newly imported Digital Vaccine.
2. Select **Distribute**.
3. Choose the target TPS devices.
4. Wait for distribution to complete.
5. Select **Activate**.

Activation installs the new Digital Vaccine on the selected TPS appliances and makes it the active inspection package.

## Step 3 – Import the Auxiliary Digital Vaccine

Navigate to:

```text
Profiles
└── Auxiliary DVs
```

Repeat the same workflow.

1. Import
2. Distribute
3. Activate

Auxiliary Digital Vaccines primarily provide supplemental malware detection capabilities.

## Step 4 – Import ThreatDV Reputation Databases

Navigate to:

```text
Profiles
└── Reputation Database
    └── ThreatDV Entries
```

Import both reputation feeds.

### ThreatDV IP Reputation

Select:

```text
Import
```

under:

```text
ThreatDV IP/Domain Reputation
```

Choose the downloaded IP reputation database.

### ThreatDV URL Reputation

Select:

```text
Import
```

under:

```text
ThreatDV URL Reputation
```

Choose the downloaded URL reputation database.

Unlike Digital Vaccines, these databases do not require a distribution and activation workflow.

## Step 5 – Import the Geo Locator Database

Navigate to:

```text
Admin
└── Geo Locator Database
```

Select:

```text
Import
```

If necessary, change the file type displayed in the file selection dialog before selecting the downloaded Geo Locator database.

Complete the import.

## Verification

After all updates have been imported:

- Verify the new Digital Vaccine version appears in the SMS.
- Confirm the Digital Vaccine has been distributed successfully.
- Verify the Digital Vaccine is marked as **Active**.
- Confirm managed TPS devices report the expected Digital Vaccine version.
- Verify the Auxiliary Digital Vaccine version.
- Confirm the ThreatDV reputation databases imported successfully.
- Verify the Geo Locator database reflects the updated version.

## Troubleshooting

If a Digital Vaccine cannot be activated:

- Verify it has been successfully distributed.
- Confirm the TPS appliance is online.
- Verify the appliance is communicating with the SMS.
- Confirm the downloaded update matches your appliance model and software version.

If an import fails:

- Verify the downloaded file is not corrupted.
- Confirm the file was downloaded completely.
- Verify the update package is intended for your SMS version.

If managed devices do not receive the update:

- Verify the devices remain managed by the SMS.
- Confirm there are no communication failures between the SMS and TPS.
- Review SMS task status for any distribution errors.

> **Field Note**
>
> Most organizations never need to perform these updates manually because the SMS retrieves them automatically. In isolated or classified environments, however, manual imports become part of routine maintenance. Keeping a documented workflow for downloading, importing, distributing, and activating updates can make these maintenance windows significantly smoother. A special thanks goes to my friend **SlippyPenguin**, whose experience with TippingPoint deployments helped fill in many of the gaps that official documentation didn't cover.
