---
title: "Configure QRadar Routing Rules"
project: "QRadar"
category: "Engineering Guide"
description: "Configure QRadar routing rules to drop events, bypass the Custom Rules Engine (CRE), or forward events for log storage while managing event processing and licensing."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/RoutingRules.md"
---

## Introduction

Routing Rules determine how QRadar processes incoming events before they enter the event pipeline. They can be used to drop events, bypass the Custom Rules Engine (CRE), or allow events to be stored without triggering correlation rules.

Routing Rules are commonly used to reduce unnecessary event processing, minimize false positives, and help manage Event Per Second (EPS) licensing by preventing unwanted events from being ingested.

## Common Use Cases

Routing Rules are frequently used to:

- Drop events that provide little or no security value.
- Reduce Event Per Second (EPS) utilization.
- Prevent noisy log sources from generating excessive offenses.
- Bypass the Custom Rules Engine (CRE) for events that should be retained but not correlated.
- Store events for auditing or compliance without performing correlation.

> **Note:** Events that are dropped by a Routing Rule are not processed by QRadar and do not count toward your licensed EPS.

## Open the Routing Rules Configuration

1. Log in to the QRadar Console.
2. Navigate to **Admin**.
3. Under **System Configuration**, select **Routing Rules**.

From this window, you can:

- Create Routing Rules
- Edit existing rules
- Enable or disable rules
- Delete unused rules

## Create a Routing Rule

1. Select **Add**.
2. Configure the conditions that identify the traffic you want the rule to apply to.
3. Select the desired action.

Depending on your requirements, common actions include:

- **Drop** – Discards the event before it enters the event pipeline.
- **Bypass CRE** – Stores the event but skips Custom Rules Engine processing.
- **Log Only** – Retains the event without generating offenses from correlation rules.

Configure the rule order as necessary and save the configuration.

## Deployment Considerations

In distributed QRadar deployments, Routing Rules may need to be configured on multiple appliances.

For example:

- Console
- Event Processor
- Event Collector

The required configuration depends on where the events enter the deployment and where event processing occurs.

> **Note:** If events are received by multiple Event Processors or Collectors, ensure the appropriate Routing Rules are deployed to each appliance that processes the relevant traffic.

## Verification

After creating a Routing Rule:

- Verify the rule is enabled.
- Confirm the rule order is correct.
- Monitor incoming events to ensure the expected action is occurring.
- Verify EPS utilization decreases if the rule is intended to reduce licensed event volume.
- Confirm offenses are no longer generated for events that bypass the CRE.

## Additional Resources

- IBM QRadar Administration Guide
- IBM QRadar Event Processing Documentation
