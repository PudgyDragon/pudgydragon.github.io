---
title: "OpenCTI RSS Feed Reference"
project: "OpenCTI"
category: "Threat Intelligence"
description: "Reference RSS feeds that have been verified to work with OpenCTI."
source_url: "https://github.com/PudgyDragon/OpenCTI/blob/main/Feeds/RSS_feeds.md"
---

## Introduction

RSS feeds provide a simple method for importing cybersecurity news and threat intelligence into OpenCTI without requiring a dedicated connector. By configuring RSS ingestion, OpenCTI can periodically retrieve articles from trusted security sources and convert them into reports for further analysis, enrichment, and correlation with existing intelligence.

This guide maintains a curated list of RSS and Atom feeds that have been verified to function correctly with OpenCTI. Because feed URLs and content may change over time, each feed includes the date it was most recently verified.

## Using These Feeds

The feeds listed below have been successfully tested with the built-in OpenCTI RSS connector.

> **Note:** OpenCTI supports both RSS and Atom feeds. Although some sources provide Atom feeds instead of traditional RSS feeds, both formats are supported.

As feed publishers may modify or discontinue their feeds without notice, periodically verify that each feed remains available if ingestion stops unexpectedly.

## Suggested Starter Feeds

If you're new to RSS ingestion, the following feeds provide a good balance of vulnerability information, threat intelligence, malware research, and industry news.

- CISA Cybersecurity Advisories
- The Hacker News
- SecurityWeek
- Cisco Talos
- The DFIR Report
- SANS Internet Storm Center

## Verified RSS Feeds

### General Cybersecurity News

| Source | RSS Feed | Last Verified |
|---------|----------|:-------------:|
| The Hacker News | https://feeds.feedburner.com/TheHackersNews?format=xml | 2026-03-06 |
| BleepingComputer | http://www.bleepingcomputer.com/feed/ | 2026-03-06 |
| SecurityWeek | https://www.securityweek.com/feed/ | 2026-03-06 |
| HackRead | https://feeds.feedburner.com/hackread | 2026-03-06 |
| Krebs on Security | https://krebsonsecurity.com/feed/ | 2026-03-06 |
| Security Affairs | https://securityaffairs.co/wordpress/feed | 2026-03-06 |

### Threat Intelligence

| Source | RSS Feed | Last Verified |
|---------|----------|:-------------:|
| Cisco Talos | https://blog.talosintelligence.com/rss/ | 2026-03-06 |
| Mandiant | https://feeds.feedburner.com/threatintelligence/pvexyqv7v0v | 2026-03-06 |

### Government Advisories

| Source | RSS Feed | Last Verified |
|---------|----------|:-------------:|
| CISA Cybersecurity Advisories | https://www.cisa.gov/cybersecurity-advisories/cybersecurity-advisories.xml | 2026-03-06 |

### DFIR & Research

| Source | RSS Feed | Last Verified |
|---------|----------|:-------------:|
| The DFIR Report | https://thedfirreport.com/feed/ | 2026-03-06 |
| Hexacorn | https://www.hexacorn.com/blog/feed/ | 2026-03-06 |
| SANS Internet Storm Center | https://isc.sans.edu/rssfeed_full.xml | 2026-03-06 |
| The Register \| Cybercrime | https://www.theregister.com/security/cyber_crime/headlines.atom | 2026-03-06 |
| The Register \| Patches | https://www.theregister.com/security/patches/headlines.atom | 2026-03-06 |
| The Register \| Research | https://www.theregister.com/security/research/headlines.atom | 2026-03-06 |

### Vendor Security Blogs

| Source | RSS Feed | Last Verified |
|---------|----------|:-------------:|
| Palo Alto Networks Blog | https://www.paloaltonetworks.com/blog/feed/ | 2026-03-06 |
| Malwarebytes | https://www.malwarebytes.com/blog/feed/index.xml | 2026-03-06 |

### Microsoft Security

| Source | RSS Feed | Last Verified |
|---------|----------|:-------------:|
| Microsoft Defender XDR | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftThreatProtectionBlog | 2026-03-06 |
| Microsoft Defender for Cloud | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftDefenderCloudBlog | 2026-03-06 |
| Microsoft Defender for Endpoint | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftDefenderATPBlog | 2026-03-06 |
| Microsoft Defender External Attack Surface Management | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=DefenderExternalAttackSurfaceMgmtBlog | 2026-03-06 |
| Microsoft Defender Vulnerability Management | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=Vulnerability-Management | 2026-03-06 |
| Microsoft Defender Threat Intelligence | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=DefenderThreatIntelligence | 2026-03-06 |
| Microsoft Azure Network Security | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=AzureNetworkSecurityBlog | 2026-03-06 |
| Microsoft Security Baselines | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=Microsoft-Security-Baselines | 2026-03-06 |
| Core Infrastructure and Security | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=CoreInfrastructureandSecurityBlog | 2026-03-06 |
| Microsoft Security Experts | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftSecurityExperts | 2026-03-06 |
| Microsoft Sentinel | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftSentinelBlog | 2026-03-06 |
| Microsoft Defender for Office 365 | https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftDefenderforOffice365Blog | 2026-03-06 |
