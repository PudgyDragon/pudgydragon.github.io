---
title: "Searchqueries"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Extras/SearchQueries.md"
---

# Security Analytics Best Searching Practices
Creating a list of some of the searches that can be used in Security Analytics. Unless otherwise specified, these will be done from the `Analyze > Summary` page. You can find these and more at:
- https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/security-analytics/8-2-7/_analysis_home/bestP_searching.html

The version of Security Analytics used in this guide is 8.2.7

## File Hash
```
application_id=http md5_hash=<hash>
application_id=http md5_hash~<part of hash>
sha1_hash=<hash>
sha1_hash~<part of hash>
sha256_hash=<hash>
sha256_hash~<part of hash>
```
## Find a Filename
```
filename=<filename>
tcp_port=80, application_id=http, ipv4_address!=<subnet_of_non-interest>, filename=<filename>
```
