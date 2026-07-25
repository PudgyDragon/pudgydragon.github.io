---
title: "Gigamon Command Reference"
project: "Gigamon"
category: "Engineering Guide"
description: "Reference commonly used CLI commands for administering and troubleshooting Gigamon appliances."
source_url: "https://github.com/PudgyDragon/Gigamon/blob/main/MISC/commands.md"
---

## Introduction

This document provides a collection of commonly used Gigamon CLI commands for administration, configuration, and troubleshooting. The commands included here are intended as a quick reference for day-to-day operational tasks and may vary between software releases.

## Configure Port Filters

Port filters can be used to drop traffic based on the source or destination port before forwarding traffic to downstream tools.

### Create a Source Port Filter

```bash
config filter deny portsrc <port> alias <filter-alias>
```

Example:

```bash
config filter deny portsrc 514 alias DropSRC514
```

### Create a Destination Port Filter

```bash
config filter deny portdst <port> alias <filter-alias>
```

Example:

```bash
config filter deny portdst 514 alias DropDST514
```

### Apply a Port Filter

Assign the filter to the desired monitoring port.

```bash
config port-filter <port> <filter-alias>
```

Example:

```bash
config port-filter 3 DropDST514
```

## Save the Running Configuration

After making configuration changes, save the running configuration to a bootable configuration file.

```bash
config save <filename>.cfg nb
```

Example:

```bash
config save CONFIG24JUNE2024.cfg nb
```

Reboot the appliance to load the newly saved configuration.

```bash
reboot
```

## Additional Resources

- Refer to the Gigamon CLI Reference Guide for the software release running in your environment.
