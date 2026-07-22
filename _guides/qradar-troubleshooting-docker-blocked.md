---
title: "Docker Blocked"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Docker%20Blocked"
---

Troubleshooting QRadar led to the conclusion that McAfee/Trellix agent being installed blocks many of the Docker apps.

The following article shows that the agent is not supported on QRadar, giving you reason to not have it installed:
https://kcm.trellix.com/corporate/index?page=content&id=KB90041

The following article shows commands you can use to uninstall McAfee on all QRadar appliances, and the commands to verify
that it is no longer present on any of the devices:
https://kcm.trellix.com/corporate/index?page=content&id=KB75550

In the event the article no longer exists, the commands are:

/opt/McAfee/agent/scripts/uninstall.sh
rpm -e MFEdx
rpm -e MFEcma
rpm -e MFErt

In the event that the above article and commands don't work for your instance, a guide for a different setup is here:
https://docs.trellix.com/bundle/agent_35_dg/page/UUID-08357b37-554b-a915-183c-213203a0dbef.html
