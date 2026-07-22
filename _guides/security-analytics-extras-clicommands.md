---
title: "Clicommands"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Extras/CLICommands.md"
---

# CLI Commands
Repository of commands and what they're used for in SSA.
## Security Analytics Specific Commands
<table>
  <tr>
    <td>
      <h2>Command</h2>
    </td>
    <td>
      <h2>Use</h2>
    </td>
    <td>
      <h2>sudo</h2>
    </td>
  </tr>
  <tr>
    <td>
      <p>atpsa-reserve-cpus</p>
    </td>
    <td>
      <p>Not applicable to virtual machines.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>build-ds-capture</p>
    </td>
    <td>
      <p>Constructions capture file system (partition, format, filesystem, fstab, mount, etc.). Ruby script. Uses a config file.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>build-ds-extras</p>
    </td>
    <td>
      <p>Constructs database/home-apache for JBOD systems (format, filesystem, fstab, mount, etc.). Ruby script.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>build-ds-index</p>
    </td>
    <td>
      <p>Constructs index file system (partition, format, filesystem, fstab, mount, etc.). Ruby script. Uses a config file. Replaces build-deepsee-index.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>carve-lsi</p>
    </td>
    <td>
      <p>Sets up both capture and index on JBODs. For LSI-based systems (carve and other options). Ruby script. Valid in versions 4.1.2+ and later.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>cfg_bond_interface.py</p>
    </td>
    <td>
      <p>A script to set the IP address of bond0.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>check-services</p>
    </td>
    <td>
      <p>Displays the status of known and expected services.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>check_slot_files</p>
    </td>
    <td>
      <p>Replaces dsfsck. Checks the DPDK file system and does limited repairs. Use when directed by Symantec Support.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>csr.sh</p>
    </td>
    <td>
      <p>Collects and concatenates log/config/status files into a single output tarball (Customer Service Report). Used for troubleshooting an appliance. BASH script</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsadduser</p>
    </td>
    <td>
      <p>Creates a new user on the appliance.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dmidecode</p>
    </td>
    <td>
      <p>Intel-based hardware only. Runs to see the appliance serial number or asset tag.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dscapture</p>
    </td>
    <td>
      <p>Instructs the appliance to capture network data.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsfilter</p>
    </td>
    <td>
      <p>Displays filters assigned to a specified interface.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsfirewall</p>
    </td>
    <td>
      <p>Toggles the IPv4 firewall on and off.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsfirewall6</p>
    </td>
    <td>
      <p>Toggles the IPv6 firewall on and off.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsfsck</p>
    </td>
    <td>
      <p>Check the DSFS file system and do limited repairs. Used when directed by Security Analytics Support.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dslc</p>
    </td>
    <td>
      <p>Configures the logging mechanisms (syslog, SNMP, email).</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dslicenseinfo</p>
    </td>
    <td>
      <p>Displays the license key and the features that are enabled on this appliance.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dslogdump</p>
    </td>
    <td>
      <p>Displays the events captured by the system log.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsmigrate</p>
    </td>
    <td>
      <p>Migrates capture data from a 7.x or 8.x appliance to an 8.x appliance.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsmigratedata</p>
    </td>
    <td>
      <p>Migrates capture data from one appliance to another. Not for migration to 8.x.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsmon</p>
    </td>
    <td>
      <p>Monitors the appliance in real time.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsmon-text</p>
    </td>
    <td>
      <p>Text-based specialization of dsmon.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dspcapimport</p>
    </td>
    <td>
      <p>Import PCAP files.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsportmapping</p>
    </td>
    <td>
      <p>Customizes your port-to-application mapping.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsregen</p>
    </td>
    <td>
      <p>Retransmits captured network traffic from a virtual network interface to a physical network interface.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsremoteimport</p>
    </td>
    <td>
      <p>Exists in the CLI; document DE-24421.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsrinfo</p>
    </td>
    <td>
      <p>Lightweight utility for capture file system config data (number of slots, recycle head location, etc.)(.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsseed</p>
    </td>
    <td>
      <p>Generate the weed file used for the license.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsstats</p>
    </td>
    <td>
      <p>Saves statistical information to a specified file.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsview</p>
    </td>
    <td>
      <p>Displays live statistics of your appliance</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsview-text</p>
    </td>
    <td>
      <p>Text-based specialization of dsview.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dsvmswitch</p>
    </td>
    <td>
      <p>Switches VM capture configuration: 2 sizes (1 large, 1 small). For the Security Analytics Virtual Appliance only.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dszap</p>
    </td>
    <td>
      <p>Deletes ALL captured data (including indexes and reports) and reinitializes the data storage. Destroys all existing capture and index data.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dump_slot</p>
    </td>
    <td>
      <p>Displays various data points concerning slots.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dynfilter</p>
    </td>
    <td>
      <p>Displays and manages the dynamic filters created by autonotchd</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>expand-ds-storage</p>
    </td>
    <td>
      <p>Adds new disk storage subsystems without reinstalling Security Analytics.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>fix-iosched</p>
    </td>
    <td>
      <p>Script. Sets I/O scheduler options. Called in first boot.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>getpmap.sh</p>
    </td>
    <td>
      <p>Used by csr.sh. BASH script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>gindiag.sh</p>
    </td>
    <td>
      <p>Gathers relevant information to assist in troubleshooting a GIN connection.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ipmitool</p>
    </td>
    <td>
      <p>Runs ipmitool sensor for a highly detailed list of power levels, fan speeds, temperatures, and so on. For a simplified version run ipmitool sdr.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>lhr_flat_to_qdb</p>
    </td>
    <td>
      <p>Uploads flat-file lists of MD5, SHA1, SHA256 hashes to the Custom Hash List.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>lru_calc.sh</p>
    </td>
    <td>
      <p>Determine the size of the slot cache. BASH script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>lsi-classify</p>
    </td>
    <td>
      <p>Wrapper around the LSI RAID controller classification scheme. Ruby script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>lsi-make-good</p>
    </td>
    <td>
      <p>Helper utility to set physical disk state back to "good" in an LSI JBOD. BASH script</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>lsi-rate-tool</p>
    </td>
    <td>
      <p>Sets, resets, or shows rates as a percentage of CPU load for RAID manipulations such as background initialization, foreground initialization, consistency check, reconstructions, etc. BASH script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>lsi-show</p>
    </td>
    <td>
      <p>Shows LSI RAID controller data in a condensed and summarized form. Ruby script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>lspci</p>
    </td>
    <td>
      <p>Shows all hardware attached to the PCI bus.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>megacli / MegaCli</p>
    </td>
    <td>
      <p>LSI CLI tool</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mkdsfs</p>
    </td>
    <td>
      <p>Builds a DSFS file system.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mkfs.dsfs</p>
    </td>
    <td>
      <p>File-system-creation utility for the capture file system.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mkfs.dsfs.vmware</p>
    </td>
    <td>
      <p>File-system-creation utility for the capture file system, used by the Security Analytics Virtual Appliance.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>oomstat.sh</p>
    </td>
    <td>
      <p>Handles out-of-memory conditions. BASH script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>parted-report</p>
    </td>
    <td>
      <p>Wraps the parted output system-processing for partition size info. Ruby script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>product-matrix-lookup</p>
    </td>
    <td>
      <p>Drive localization file names for the Security Analytics Appliance only (not VM or third-party installations); control product/model-based settings such as IRQ balance, serial-line name, X desktop support, management interface.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scm system health</p>
    </td>
    <td>
      <p>View and configure system health tests.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scm migrator</p>
    </td>
    <td>
      <p>Imported and exported appliance settings as a JSON file.</p>
    </td>
    <td>
      <p></p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scm pivot_only_provider</p>
    </td>
    <td>
      <p>Adds a reputation provider to use for manual submission.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scm solera_acl elevate</p>
    </td>
    <td>
      <p>Restores a GUI account to admin status.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scm solera_acl shell_only</p>
    </td>
    <td>
      <p>Creates a shell-only user.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scm tally</p>
    </td>
    <td>
      <p>Enables user accounts, clears session controls.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scm sessions</p>
    </td>
    <td>
      <p>Clears session controls.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scotus</p>
    </td>
    <td>
      <p>Gracefully stop system-related services prior to performing other tasks.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scsi-devices</p>
    </td>
    <td>
      <p>Wrapper around the SCSI-to-device-name mapping. Ruby script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>solera_enet_config.py</p>
    </td>
    <td>
      <p>Orders Ethernet interfaces during first boot. Python script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>solera-affinity</p>
    </td>
    <td>
      <p>Sets CPU affinities. Called from startup on boot for every boot. BASH script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>update-sysctl</p>
    </td>
    <td>
      <p>Tune SYSCTL settings for optimal performance. BASH script.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
</table>

## Supported Linux Commands
<table>
  <tr>
    <td>
      <h2>Command</h2>
    </td>
    <td>
      <h2>Use</h2>
    </td>
    <td>
      <h2>sudo</h2>
    </td>
  </tr>
  <tr>
    <td>
      <p>awk</p>
    </td>
    <td>
      <p>Combines the functions of grep and sed; allows substitution items from an input file's lines for items in a template, or performs calculations on numbers within a file.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>cat</p>
    </td>
    <td>
      <p>Concatenates files and prints to the standard output.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>chkconfig</p>
    </td>
    <td>
      <p>Updates and queries runlevel information for system services.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>cp</p>
    </td>
    <td>
      <p>Copies files and directories.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>date</p>
    </td>
    <td>
      <p>Prints or sets the system date and time.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>dhclient</p>
    </td>
    <td>
      <p>Enables DHCP on an interface.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ethtool</p>
    </td>
    <td>
      <p>Queries settings of an Ethernet device and changes them.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>grep</p>
    </td>
    <td>
      <p>Searches files for lines containing specified criteria.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>head</p>
    </td>
    <td>
      <p>Prints the first n lines of files to the standard output (default = 10 lines).</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>hwclock</p>
    </td>
    <td>
      <p>Queries and sets the hardware clock.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ifconfig</p>
    </td>
    <td>
      <p>Configures a specified network interface.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ifdown</p>
    </td>
    <td>
      <p>Disables a specified network interface.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ifup</p>
    </td>
    <td>
      <p>Enables a specified network interface.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ip</p>
    </td>
    <td>
      <p>To view and edit routing, devices, policy routing, and tunnels.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>jsondiff</p>
    </td>
    <td>
      <p>Usage: jsondiff left_file.json right_file.json.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>jsondump</p>
    </td>
    <td>
      <p></p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>kill</p>
    </td>
    <td>
      <p>Terminates a process.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>less</p>
    </td>
    <td>
      <p>Enables forward and backware movement while reviewing a text file.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ln</p>
    </td>
    <td>
      <p>Creates links to target files.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ls</p>
    </td>
    <td>
      <p>Lists information such as size, date created, and directory for specified files.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mii-tool</p>
    </td>
    <td>
      <p>View and edit Media-Independent Interface status.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mkdir</p>
    </td>
    <td>
      <p>Creates directories.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mkfs</p>
    </td>
    <td>
      <p>Builds a Linux file system.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mount</p>
    </td>
    <td>
      <p>Mounts a file system.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>mv</p>
    </td>
    <td>
      <p>Renames or moves files.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ngrep</p>
    </td>
    <td>
      <p>Searches for strings across packet data.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>netstat</p>
    </td>
    <td>
      <p>Prints network connections, routing tables, interface statistics, masquerade connections, and multicast memberships on the standard output.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>nice</p>
    </td>
    <td>
      <p>Runs a command at a lower priority level.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>nohup</p>
    </td>
    <td>
      <p>Suppresses a hang-up signal while running a command.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ntpdate</p>
    </td>
    <td>
      <p>Sets a system's clock to match the time published by servers running NTP.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>pam_tally2</p>
    </td>
    <td>
      <p>Manages authentication timeouts.</p>
    </td>
    <td>
      <p></p>
    </td>
  </tr>
  <tr>
    <td>
      <p>passwd</p>
    </td>
    <td>
      <p>Change the root-level password. Initial root password is set on /settings/initial_config.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>ping</p>
    </td>
    <td>
      <p>Uses ICMP to test host connectivity.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>pkill</p>
    </td>
    <td>
      <p>Looks up or signals processes based on name and other attributes.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>reboot</p>
    </td>
    <td>
      <p>Reboots the appliance.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>rm</p>
    </td>
    <td>
      <p>Deletes a file.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>rmdir</p>
    </td>
    <td>
      <p>Deletes a directory.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>route</p>
    </td>
    <td>
      <p>Show or edit the IP routing table.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>scp</p>
    </td>
    <td>
      <p>Securely copies files between hosts on a network.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>sed</p>
    </td>
    <td>
      <p>Replaces or modifies lines with the specified file.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>systemctl</p>
    </td>
    <td>
      <p>Stops, starts, or restars a system service.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>service</p>
    </td>
    <td>
      <p>Stops, starts, or restarts a system service.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>shutdown</p>
    </td>
    <td>
      <p>Shuts down the appliance.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>solo</p>
    </td>
    <td>
      <p>Prevents multiple cron instances from running simultaneously.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>sync</p>
    </td>
    <td>
      <p>Synchronizes data on disk with memory.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>tail</p>
    </td>
    <td>
      <p>Prints the last n lines of files to the standard output (default = 10 lines).</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>top</p>
    </td>
    <td>
      <p>Displays top CPU processes.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>umount</p>
    </td>
    <td>
      <p>Dismounts file systems.</p>
    </td>
    <td>
      <p>Yes</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>uname</p>
    </td>
    <td>
      <p>Prints system information.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>userdel</p>
    </td>
    <td>
      <p>Deletes a user account and related files.</p>
    </td>
    <td>
      <p></p>
    </td>
  </tr>
  <tr>
    <td>
      <p>vim</p>
    </td>
    <td>
      <p>Opens the VIMproved programming text editor.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>whoami</p>
    </td>
    <td>
      <p>Prints the user name/user ID for the current session.</p>
    </td>
    <td>
      <p>No</p>
    </td>
  </tr>
  
</table>
