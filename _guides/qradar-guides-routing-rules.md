---
title: "Routing Rules"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Routing%20Rules"
---

Routing rules can be used in QRadar to specify what you want to do with certain traffic going to the SIEM.

From the Admin page, navigate to the System Configuration section and choose Routing Rules.

Here, you're able to create, edit, delete, and enable/disable rules.

If there is certain traffic that you're not concerned about, and your EPS is getting to the point where
it may be running over your license, you have the option to drop the traffic through routing rules so that
your SIEM doesn't ever get that traffic, and it won't count towards your EPS limit. Routing rules also gives
you the ability to bypass CRE and log only. These options may be good for traffic that is causing your SIEM
to trigger a lot of offenses that are false positives.

Keep in mind, if you have multiple devices (Console, Event Processor) you may need to create a routing rule
for each one, depending on your situation and the type of traffic you're getting.
