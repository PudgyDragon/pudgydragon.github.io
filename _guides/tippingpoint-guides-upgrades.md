---
title: "Upgrading the SMS and TPS Appliances"
project: "TippingPoint"
category: "Engineering Guide"
description: "Upgrade the Trend Micro TippingPoint Security Management System (SMS) and managed TPS appliances using manually downloaded software packages."
source_url: "https://github.com/PudgyDragon/TippingPoint/blob/main/Guides/Upgrades.md"
---

## Introduction

This guide documents the recommended process for upgrading a **Trend Micro TippingPoint Security Management System (SMS)** and its managed **TPS (Threat Protection System)** appliances using software packages downloaded manually from the **Trend Micro Customer Licensing Portal (TMC)**.

While many environments automatically retrieve software updates, isolated or restricted networks often require administrators to manually download and import upgrade packages. Following the correct upgrade order helps minimize compatibility issues between the SMS and managed TPS devices.

The recommended upgrade sequence is:

1. Upgrade the **SMS**
2. Upgrade **local TPS appliances**
3. Upgrade **remote TPS appliances**

> **Important**
>
> Always upgrade the **SMS before any managed TPS appliances**. Upgrading a TPS to a software version newer than the SMS may prevent normal management and communication until the SMS has also been upgraded.

> **Note**
>
> Before upgrading, review the release notes for both the SMS and TPS software versions. Verify compatibility, supported upgrade paths, and any required intermediate upgrades.

## Prerequisites

Before beginning:

- Administrative access to the SMS
- Appropriate software packages downloaded from TMC
- Current configuration backups
- Console or out-of-band access (recommended)
- Maintenance window approved

## Step 1 – Prepare the TPS Appliances (Optional)

For environments where maintaining network connectivity is more important than maintaining IPS inspection during the upgrade, consider placing each TPS appliance into **Layer 2 Fallback (L2F)** before upgrading.

When enabled, Layer 2 Fallback allows traffic to continue forwarding through the appliance even if IPS inspection is temporarily unavailable.

Navigate to:

```text
Devices
└── <TPS Device>
    └── Device Configuration
        └── Edit
            └── HA (High Availability)
```

Select:

```text
Fallback
```

Then select:

```text
Apply
```

> **Field Note**
>
> Layer 2 Fallback is particularly useful during maintenance windows where preserving network connectivity is more important than active intrusion prevention. Remember to return the appliance to **Normal** mode after the upgrade has completed successfully.

## Step 2 – Upgrade the SMS

Import the SMS software package.

Navigate to:

```text
Admin
└── General
```

Under **SMS Software**:

1. Select **Import**
2. Choose the downloaded software package
3. Wait for the upload to complete
4. Select **Install**

The SMS will begin the upgrade process.

Depending on the software version and appliance hardware, the upgrade may take several minutes.

After the SMS upgrade completes, install the updated SMS client on your workstation.

The latest client can typically be downloaded directly from the SMS web interface.

## Step 3 – Upgrade the TPS Appliances

Once the SMS has been successfully upgraded, begin upgrading the managed TPS appliances.

I recommend upgrading **local appliances first** before moving to remote locations.

If an unexpected issue occurs, it's much easier to troubleshoot equipment that is physically nearby.

Navigate to:

```text
Devices
└── TippingPoint OS
```

Import the new TPS operating system.

After the software has been imported:

1. Select the desired TOS version.
2. Select **Distribute**.
3. Choose the target appliance(s).
4. Confirm the upgrade.

Allow each appliance to complete the upgrade before proceeding.

> **Field Note**
>
> Although the SMS allows multiple TPS appliances to be upgraded simultaneously, I generally recommend upgrading one appliance at a time—especially when deploying a new software version for the first time. If an unexpected issue occurs, troubleshooting a single appliance is considerably easier than recovering multiple devices at once.

## Step 4 – Restore Normal Operation

After all TPS appliances have successfully upgraded, return any appliances configured for Layer 2 Fallback back to normal operating mode.

Navigate to:

```text
Devices
└── <TPS Device>
    └── Device Configuration
        └── Edit
            └── HA
```

Select:

```text
Normal
```

Apply the changes.

## Verification

After completing the upgrade:

- Verify the SMS software version.
- Verify each TPS appliance reports the expected TOS version.
- Confirm all managed devices reconnect to the SMS.
- Verify policy synchronization succeeds.
- Confirm Digital Vaccines remain assigned correctly.
- Verify event logging and management communication are functioning normally.
- Confirm appliances have returned to **Normal** operating mode if Layer 2 Fallback was used.

## Troubleshooting

If a TPS appliance does not reconnect:

- Verify the appliance completed the upgrade successfully.
- Confirm the SMS is running a compatible software version.
- Verify network connectivity between the SMS and TPS.
- Review appliance task status within the SMS.

If policy synchronization fails:

- Confirm the appliance is fully managed.
- Verify the correct TOS version is installed.
- Review the SMS event logs for upgrade or communication errors.

If the SMS client no longer connects after upgrading:

- Download and install the updated SMS client from the upgraded SMS web interface.

> **Field Note**
>
> The software upgrade itself is usually the easiest part of the process. Most upgrade-related issues stem from preparation—verifying backups, reviewing release notes, confirming software compatibility, and following the proper upgrade order. Taking the time to upgrade the SMS first and validating one TPS appliance before upgrading the rest can significantly reduce the risk of widespread outages.
