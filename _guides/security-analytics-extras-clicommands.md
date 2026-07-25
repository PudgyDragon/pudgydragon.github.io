---
title: "CLI Command Reference - Monitoring & Diagnostics"
project: "Security Analytics"
category: "Engineering Guide"
description: "Monitoring, health, and diagnostic commands for Broadcom Security Analytics appliances."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Extras/CLICommands.md"
---

## Introduction

The **Security Analytics CLI Command Reference** is a comprehensive collection of command-line utilities available on Broadcom Security Analytics appliances. It is intended to serve as a practical engineering reference for administrators, support personnel, and security engineers responsible for deploying, maintaining, and troubleshooting Security Analytics environments.

Unlike the original CLI reference, which presents commands as a single alphabetical list, this guide organizes commands into functional categories that mirror common operational workflows. Whether you're investigating an appliance issue, collecting diagnostic data, configuring storage, managing packet capture, administering users, or performing general Linux administration, the goal is to make the appropriate commands easier to discover and understand.

This reference is designed to complement—not replace—the official Broadcom documentation. Where appropriate, additional context, operational guidance, and field notes have been included to help explain when a command is commonly used and any important considerations before executing it.

The reference is organized into the following sections:

- Monitoring & Diagnostics
- Diagnostics & Support
- Storage & Filesystems
- Packet Capture & Migration
- Networking, Users & Licensing
- Hardware & RAID
- Linux Administration (A–M)
- Linux Administration (N–Z)

> **Important**
>
> Commands documented in this reference range from informational utilities to commands capable of modifying system configuration or deleting data. Always review the command's purpose, verify backups when applicable, and perform potentially disruptive operations during an approved maintenance window.

## Common Troubleshooting Workflow

Although every issue is different, a typical troubleshooting workflow is:

1. Verify appliance services are running correctly.
2. Review overall appliance health and hardware status.
3. Examine relevant logs and diagnostic output.
4. Collect a Customer Service Report (CSR) before making significant changes whenever practical.
5. Verify storage, networking, and packet capture functionality as appropriate.
6. Escalate to Broadcom Support if additional analysis or vendor assistance is required.
## Service Monitoring

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `check-services` | Displays the status of expected Security Analytics services. | No |
| `dsmon` | Monitors the appliance in real time. | No |
| `dsmon-text` | Text-based version of `dsmon`. | No |
| `dsview` | Displays live appliance statistics. | No |
| `dsview-text` | Text-based version of `dsview`. | No |
| `dsstats` | Saves appliance statistics to a file for later review. | No |

> **Field Note**
>
> `check-services` should usually be the first command executed when troubleshooting appliance functionality.

## Hardware Health

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `dmidecode` | Displays hardware serial number and asset information on supported Intel platforms. | No |
| `ipmitool` | Displays sensors including temperatures, fan speeds, voltages, and power information. | No |
| `lspci` | Lists PCI devices detected by the operating system. | No |

## Capture Health

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `dump_slot` | Displays capture slot information. | No |
| `dsrinfo` | Displays capture filesystem configuration including slot information and recycle status. | Yes |

## Diagnostics

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `csr.sh` | Generates a Customer Service Report (CSR) archive containing logs, configuration, and appliance state information for Broadcom Support. | No |
| `getpmap.sh` | Helper script used during CSR collection. | No |
| `gindiag.sh` | Collects troubleshooting information for GIN connectivity issues. | No |
| `dslogdump` | Displays events recorded by the appliance logging system. | No |
| `dynfilter` | Displays and manages dynamic filters created by `autonotchd`. | No |
| `check_slot_files` | Validates and performs limited repair of the DPDK filesystem when directed by Broadcom Support. | Yes |
| `dsfsck` | Performs integrity checking and limited repair of the DSFS capture filesystem when directed by Broadcom Support. | No |

> **Warning**
>
> `check_slot_files` and `dsfsck` should generally be executed only under the guidance of Broadcom Support.

## Customer Service Report (CSR)

The Customer Service Report (CSR) is one of the most valuable artifacts when opening a Broadcom Support case.

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `csr.sh` | Support | Collects logs, configuration, status information, and appliance health into a single archive for Broadcom Support. | No |
| `getpmap.sh` | Support | Helper script used internally during CSR generation. | No |

> **Field Note**
>
> Generate a CSR before restarting services or making significant configuration changes whenever possible.

## Logging

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dslogdump` | Logging | Displays events captured by the appliance logging subsystem. | No |
| `dslc` | Logging | Configures appliance logging, including Syslog, SNMP, and email notifications. | Yes |

## Filesystem Validation

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `check_slot_files` | Filesystem | Validates and performs limited repair of the DPDK filesystem. Use only when directed by Broadcom Support. | Yes |
| `dsfsck` | Filesystem | Checks and performs limited repair of the DSFS capture filesystem. Use only when directed by Broadcom Support. | No |

> **Warning**
>
> Filesystem repair utilities should not be considered routine maintenance. Follow Broadcom Support guidance before running repair operations.

## Diagnostic Utilities

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `gindiag.sh` | Diagnostics | Collects troubleshooting information related to GIN connectivity. | No |
| `dynfilter` | Diagnostics | Displays and manages dynamic filters created by `autonotchd`. | No |
| `dump_slot` | Diagnostics | Displays detailed information about capture slots. | No |
| `dsrinfo` | Diagnostics | Displays capture filesystem configuration, slot counts, and recycle information. | Yes |

## Storage Provisioning

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `build-ds-capture` | Capture Storage | Creates and configures the capture filesystem, including partitioning, formatting, mounting, and `/etc/fstab` updates. | Yes |
| `build-ds-index` | Index Storage | Creates and configures the index filesystem. Replaces the legacy `build-deepsee-index` utility. | Yes |
| `build-ds-extras` | Database Storage | Creates the database and home-apache filesystems for JBOD deployments. | Yes |
| `expand-ds-storage` | Storage Expansion | Adds supported storage subsystems without reinstalling Security Analytics. | No |

## Capture Filesystem Utilities

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `mkdsfs` | Capture Filesystem | Builds a DSFS capture filesystem. | No |
| `mkfs.dsfs` | Capture Filesystem | Creates a DSFS capture filesystem on supported hardware. | Yes |
| `mkfs.dsfs.vmware` | Virtual Appliance | Creates a DSFS capture filesystem for the Security Analytics Virtual Appliance. | Yes |
| `check_slot_files` | Validation | Validates and performs limited repair of the DPDK filesystem. | Yes |
| `dsfsck` | Validation | Performs integrity checks and limited repair of the DSFS filesystem. | No |

## JBOD & Storage Initialization

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `carve-lsi` | JBOD | Initializes capture and index storage on supported LSI-based JBOD systems. | Yes |
| `parted-report` | Storage | Reports partition layout and sizing information. | No |
| `scsi-devices` | Storage | Displays SCSI-to-device mappings for attached storage devices. | No |

## Performance & Initialization

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `fix-iosched` | Performance | Configures I/O scheduler settings during appliance initialization. | Yes |
| `update-sysctl` | Performance | Applies recommended Linux kernel tuning parameters. | No |
| `solera-affinity` | Performance | Configures CPU affinity during system startup. | No |
| `atpsa-reserve-cpus` | Performance | Reserves CPUs for supported physical appliances. Not applicable to virtual machines. | No |

> **Field Note**
>
> Storage provisioning commands are typically executed during initial deployment, hardware replacement, or under the direction of Broadcom Support. They are not intended for routine administration.

## Packet Capture

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dscapture` | Capture | Starts or controls network packet capture on the appliance. | No |
| `dspcapimport` | Capture Import | Imports PCAP files into the appliance for analysis. | Yes |
| `dsremoteimport` | Capture Import | Imports capture data from a remote source. Availability depends on platform and version. | Yes |
| `dsregen` | Packet Replay | Replays captured network traffic from a virtual interface to a physical interface. | No |

> **Field Note**
>
> `dspcapimport` is commonly used during investigations to analyze captures collected from external devices without requiring live traffic.

## Capture Management

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dsfilter` | Capture Filters | Displays filters assigned to a specified capture interface. | Yes |
| `dsportmapping` | Configuration | Configures custom port-to-application mappings used during traffic analysis. | No |
| `dump_slot` | Capture Storage | Displays information about capture slots and their utilization. | No |
| `dsrinfo` | Capture Storage | Displays capture filesystem configuration, slot count, and recycle information. | Yes |
| `lru_calc.sh` | Cache | Calculates slot cache sizing used by the capture subsystem. | No |

## Migration

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dsmigrate` | Migration | Migrates capture data from legacy 7.x or 8.x appliances to supported 8.x platforms. | No |
| `dsmigratedata` | Migration | Transfers capture data between compatible Security Analytics appliances. | No |
| `scm migrator` | Configuration Migration | Imports and exports appliance configuration as JSON. | No |

> **Warning**
>
> Migration utilities should be used only after verifying software compatibility, storage capacity, and available maintenance windows.

## Data Management

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dszap` | Data Reset | Deletes all capture, index, and report data before reinitializing appliance storage. | Yes |
| `dsvmswitch` | Virtual Appliance | Switches between supported virtual capture configurations for Security Analytics virtual appliances. | Yes |

> **Warning**
>
> `dszap` permanently destroys all stored capture and index data. Confirm backups and obtain appropriate approval before executing this command.

## Network Configuration

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `cfg_bond_interface.py` | Networking | Configures the IP address assigned to the `bond0` management interface. | No |
| `solera_enet_config.py` | Networking | Orders and configures Ethernet interfaces during the appliance's initial boot process. | No |
| `dsportmapping` | Application Mapping | Configures custom port-to-application mappings used during packet analysis. | No |
| `dsfilter` | Capture Networking | Displays capture filters configured on a specified interface. | Yes |

## Firewall Configuration

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dsfirewall` | Firewall | Enables, disables, or reports the status of the IPv4 firewall. | Yes |
| `dsfirewall6` | Firewall | Enables, disables, or reports the status of the IPv6 firewall. | Yes |

> **Warning**
>
> Verify remote access methods before modifying firewall rules to prevent accidental loss of management connectivity.

## User Management

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dsadduser` | User Management | Creates a local user account on the appliance. | Yes |
| `scm solera_acl elevate` | User Management | Restores a Security Analytics GUI account to administrative privileges. | No |
| `scm solera_acl shell_only` | User Management | Creates a shell-only user account. | No |
| `scm tally` | Authentication | Clears authentication lockouts and re-enables user access. | No |
| `scm sessions` | Session Management | Clears active session controls. | No |

## Licensing

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dslicenseinfo` | Licensing | Displays the installed license and enabled appliance features. | No |
| `dsseed` | Licensing | Generates the appliance seed file required during licensing operations. | No |

## Appliance Administration

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dslc` | Notifications | Configures Syslog, SNMP, and email notification settings. | Yes |
| `scm system health` | Health | Views and configures appliance health tests. | No |
| `scm pivot_only_provider` | Threat Intelligence | Configures a reputation provider used for manual submissions. | No |
| `scotus` | Services | Gracefully stops appliance-related services before maintenance operations. | No |
| `product-matrix-lookup` | Platform | Displays product-specific configuration information for supported appliance models. | No |

## Hardware Discovery

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `dmidecode` | Hardware | Displays appliance hardware information such as serial number, BIOS details, and asset tags on supported Intel platforms. | No |
| `lspci` | Hardware | Lists all PCI devices detected by the operating system. | No |
| `ipmitool` | Hardware Monitoring | Displays system health including temperatures, fan speeds, voltages, and sensor status. | No |
| `scsi-devices` | Hardware | Maps SCSI devices to operating system device names. | No |

## LSI RAID Controller Utilities

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `megacli` / `MegaCli` | RAID | Primary command-line interface for supported LSI RAID controllers. | No |
| `lsi-show` | RAID | Displays summarized LSI RAID controller information. | No |
| `lsi-classify` | RAID | Identifies and classifies attached LSI RAID hardware. | No |
| `lsi-rate-tool` | RAID | Views or adjusts controller background task rates such as initialization, rebuilds, and consistency checks. | No |
| `lsi-make-good` | RAID | Returns a physical disk to the **Good** state after maintenance or replacement. | No |

> **Field Note**
>
> RAID rebuild and consistency check rates can significantly impact capture performance. Consider maintenance windows before modifying controller settings.

## JBOD Administration

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `carve-lsi` | JBOD | Initializes capture and index storage on supported LSI-based JBOD appliances. | Yes |
| `build-ds-extras` | JBOD | Creates database and supplemental filesystems used on JBOD deployments. | Yes |
| `expand-ds-storage` | JBOD | Adds supported storage shelves without reinstalling Security Analytics. | No |

## Platform Optimization

| Command | Category | Purpose | Requires sudo |
| --- | --- | --- | :---: |
| `solera-affinity` | Performance | Configures CPU affinity for optimized packet processing during system startup. | No |
| `fix-iosched` | Performance | Applies recommended Linux I/O scheduler settings. | Yes |
| `update-sysctl` | Performance | Applies Broadcom-recommended kernel tuning parameters. | No |
| `atpsa-reserve-cpus` | Performance | Reserves CPUs for supported physical appliances. Not applicable to virtual appliances. | No |

## Text Processing

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `awk` | Pattern scanning, reporting, and text processing. | No |
| `cat` | Display or concatenate file contents. | No |
| `grep` | Search files for matching text. | No |
| `head` | Display the beginning of a file. | No |
| `jsondiff` | Compare two JSON files. | No |
| `jsondump` | Display JSON data in a readable format. | No |
| `less` | View text files interactively. | No |
| `sed` | Stream editor for modifying text. | No |

## File Management

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `cp` | Copy files and directories. | No |
| `ln` | Create hard or symbolic links. | No |
| `ls` | List directory contents. | No |
| `mkdir` | Create directories. | No |
| `mount` | Mount a filesystem. | No |
| `mv` | Move or rename files and directories. | No |

## System Administration

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `chkconfig` | Configure legacy system service runlevels. | No |
| `date` | Display or modify the system date and time. | No |
| `hwclock` | Display or update the hardware clock. | No |
| `nice` | Start a process with modified scheduling priority. | No |
| `nohup` | Continue running a command after logout. | No |

## Networking

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `dhclient` | Request an IP address using DHCP. | No |
| `ethtool` | Display or configure Ethernet device settings. | No |
| `ifconfig` | Display or configure network interfaces. | No |
| `ifdown` | Disable a network interface. | Yes |
| `ifup` | Enable a network interface. | Yes |
| `ip` | Display or configure IP networking, routing, and interfaces. | Yes |
| `mii-tool` | Display or configure Media Independent Interface information. | Yes |
| `netstat` | Display network connections, routing tables, and interface statistics. | No |

## Process Management

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `kill` | Send a signal to terminate or control a process. | Yes |
| `ngrep` | Search packet payloads for matching strings. | Yes |

## Filesystem Utilities

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `mkfs` | Create a Linux filesystem. | No |

## Networking

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `nslookup` | Query DNS servers for hostname and IP address resolution. | No |
| `ping` | Verify basic network connectivity to a remote host. | No |
| `route` | Display or modify the system routing table. | Yes |
| `scp` | Securely copy files between systems over SSH. | No |
| `ssh` | Connect securely to a remote Linux system. | No |
| `tcpdump` | Capture and analyze network traffic. | Yes |
| `traceroute` | Display the network path to a remote host. | No |
| `wget` | Download files from HTTP, HTTPS, or FTP servers. | No |

## Process & Performance

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `ps` | Display running processes. | No |
| `renice` | Modify the scheduling priority of an existing process. | Yes |
| `sar` | Collect and report system activity statistics. | No |
| `strace` | Trace system calls made by a running process. | Yes |
| `top` | Display real-time process and CPU utilization information. | No |
| `uptime` | Display system uptime and load averages. | No |
| `vmstat` | Report virtual memory and CPU statistics. | No |

## File & Filesystem Management

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `rm` | Remove files and directories. | Yes |
| `tar` | Archive or extract files. | No |
| `touch` | Create an empty file or update timestamps. | No |
| `umount` | Unmount a filesystem. | Yes |
| `vi` | Edit text files using the Vi editor. | No |

## User & Security Administration

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `passwd` | Change a user account password. | Yes |
| `su` | Switch to another user account. | Yes |
| `sudo` | Execute commands with elevated privileges. | Yes |
| `who` | Display currently logged-in users. | No |
| `whoami` | Display the current user account. | No |

## System Information

| Command | Purpose | Requires sudo |
| --- | --- | :---: |
| `uname` | Display kernel and operating system information. | No |
| `yum` | Install, update, or remove software packages on supported RHEL-based systems. | Yes |
| `zip` | Compress files into ZIP archives. | No |

> **Field Note**
>
> Most production troubleshooting requires only a small subset of these commands. Learning `top`, `ps`, `tcpdump`, `tar`, `scp`, `ssh`, and `vmstat` provides an excellent foundation for Security Analytics administration.

## Conclusion

This document completes the eight-part Security Analytics CLI Command Reference. Together, the documents provide a task-oriented reference covering:

- Monitoring & Diagnostics
- Diagnostics & Support
- Storage & Filesystems
- Packet Capture & Migration
- Networking, Users & Licensing
- Hardware & RAID
- Linux Administration (A–M)
- Linux Administration (N–Z)

The reference is intended to complement Broadcom documentation by organizing commands according to common operational workflows while preserving the command inventory from the original CLI reference.
