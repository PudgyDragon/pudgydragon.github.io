---
title: "Follow Tcp Stream Issues"
project: "Security Analytics"
category: "Troubleshooting"
description: "A practical troubleshooting for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Troubleshoot/Follow_TCP_Stream_Issues.md"
---

# Issue Using Follow TCP Stream on Security Analytics
After installation and creating new partitions, I noticed that Follow TCP Stream wasn't working properly 
within Packet Analyzer. Comparing configurations to another device, I noticed that a directory had somehow
duplicated inside itself. You can verify if this is the same issue for you by running:
```
cd /pfs
ls
```
The file system should show flows and packets. In our case, pfs had duplicated itself inside itself,
and we were getting a `/pfs` inside `/pfs`. After running `rmdir` on the duplicate pfs and rebooting the system,
Packet Analyzer > Follow TCP Stream was working properly.
