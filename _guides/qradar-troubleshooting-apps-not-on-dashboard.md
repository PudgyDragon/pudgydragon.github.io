---
title: "Apps Not On Dashboard"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Apps%20Not%20on%20Dashboard"
---

If your QRadar apps aren't showing up on your dashboard, they may be errored out and you will need to restart them.

The official solution for this can be found on the IBM site at:
https://www.ibm.com/support/pages/qradar-about-qappmanager-support-utility

Log into QRadar as the root user
Run:

/opt/qradar/support/qappmanager

You will need to choose option 24, "App instance --stop".

You'll be given a list of Authorized Services. It doesn't really matter which one you use, as long as it has
Admin privileges/roles, allowing you to perform admin commands. Typically, I just use QRadar Assistant.

A list of App instances running on QRadar will show up. For any that are showing as "ERROR", you will type the ID
and hit enter. This will stop the app instance. You will have to do this for each app instance that is in an
ERROR state. After stopping one, it should take you back to the list where you will have to choose option 24 again for each
one, but you won't have to choose an Authorized Service like the first time.

After the app instance is fully stopped, you will then complete the above steps again, but instead you will select
option 23, "App instance --start". Following the same process, type in the ID of each app that you need to start.

You can check the progress of applications being stopped and started by choosing options 20,
"App instance --list all".
