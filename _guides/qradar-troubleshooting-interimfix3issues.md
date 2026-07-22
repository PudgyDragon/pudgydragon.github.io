---
title: "Interimfix3Issues"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/InterimFix3Issues.md"
---

# Troubleshooting guide for a small issue that occurred during Update Package 8 Interim Fix 3
While following the Interim Fix guide, getting to the point where you actually run `/media/updates/installer`, we had a similar issue come up
that came up during the Upgrade to RHEL 8. Something along the lines of:
```
Cliniq has dected unresolved patch-sensitve issues. You must resolve these issues before continuing.
```
This time it had to do with a file in `/store/jheap/` that had a naming convention of `ariel_proxy`. By deleting the `.gz` file, we were able to
successfully run the `/media/updates/installer` without issue.
