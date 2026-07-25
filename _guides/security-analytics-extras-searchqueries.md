---
title: "Search Queries"
project: "Security Analytics"
category: "Engineering Guide"
description: "Common search queries for Broadcom Security Analytics 8.2.7."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Extras/SearchQueries.md"
---

## Introduction

This guide provides a collection of commonly used search queries for **Broadcom Security Analytics 8.2.7**. The examples are intended to help analysts quickly locate network sessions, files, and other artifacts during investigations.

> **Important**
>
> The search syntax documented in this guide applies specifically to **Security Analytics version 8.2.7**. Newer releases may introduce additional fields, modify existing syntax, or change search behavior. Always verify compatibility when using these searches on later versions.

Unless otherwise noted, all searches are performed from:

```
Analyze → Summary
```

Broadcom's official documentation contains additional examples and search operators beyond those included here. This guide focuses on searches that are commonly useful during investigations and day-to-day operations.

## Search Tips

Before diving into the examples, it helps to understand a few common operators.

| Operator | Description | Example |
| -------- | ----------- | ------- |
| `=` | Exact match | `filename=invoice.pdf` |
| `~` | Partial or wildcard-style match | `filename~invoice` |
| `!=` | Does not equal | `ipv4_address!=192.168.1.0/24` |
| `,` | Logical AND | `application_id=http, filename=test.exe` |

> **Field Note**
>
> Whenever possible, combine multiple search fields to reduce the number of returned sessions and improve search performance.

---

## Searching for File Hashes

Search for files transferred across supported protocols using known cryptographic hashes.

### Exact MD5

```text
application_id=http md5_hash=<hash>
```

### Partial MD5

```text
application_id=http md5_hash~<partial_hash>
```

### Exact SHA-1

```text
sha1_hash=<hash>
```

### Partial SHA-1

```text
sha1_hash~<partial_hash>
```

### Exact SHA-256

```text
sha256_hash=<hash>
```

### Partial SHA-256

```text
sha256_hash~<partial_hash>
```

> **Field Note**
>
> Exact hash searches are useful when investigating indicators of compromise (IOCs) obtained from threat intelligence feeds, malware analysis, or incident response.

---

## Searching for File Names

Search for files observed during network transfers.

### Exact Filename

```text
filename=<filename>
```

### HTTP File Transfer

Search for a file downloaded over HTTP while excluding traffic from a known subnet.

```text
tcp_port=80,
application_id=http,
ipv4_address!=<subnet_of_non_interest>,
filename=<filename>
```

> **Field Note**
>
> Excluding known internal subnets can significantly reduce noise when investigating downloads from external hosts.

---

## Additional Resources

Broadcom maintains an extensive list of supported search operators and examples in the official documentation.

https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/security-analytics/8-2-7/_analysis_home/bestP_searching.html
