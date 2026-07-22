---
title: "Stig 2026"
project: "Security Analytics"
category: "STIG"
description: "A practical stig for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/STIG_2026.md"
---

<h1>Security Analytics STIG Guide</h1>
<p>Nothing crazy, just a point in the right direction for where to enable certain things to meet STIG requirements for a Network Device Management STIG checklist. Most of the checks are already standard on Security Analytics, 
  including the ones I'll be posting here. It's mostly to verify that they are enabled.</p>

<h2>Web Interface Settings</h2>
<p>Navigate to the Web Interface settings through the Settings cog. Verify or change the following settings</p>
<pre><code>
  Inactivity Timeout: 5 minutes
  Message of the Day: Paste whatever your organization requires users to see when logging in
  
</code></pre>

<h2>Communication Settings</h2>
<p>Navigate to the Communication settings. Verify or change the following settings</p>
<pre><code>
  Syslog Settings
      Enable Coalescing
      Syslog Facility: Syslog
      Syslog Server: Your SIEM/Syslog Server
      Protocol: TCP
  SNMP Settings
      Trap Servers
          Server: Company SNMP Server
          Port: 162
          Enable Authentication: Enabled (if your SNMP has authenticaiton)
          Read-Only Username: SNMP Credentials
          Authentication Password: SNMP Credentials
          Privacy Encryption Password: SNMP Credentials
  Advanced
      Remote Syslog
          Ensure all boxes are checked
  
</code></pre>

<h2>Date & Time Settings</h2>
<p>Navigate to Date/Time through the settings cog. Add your settings in the following</p>
<pre><code>
  Use NTP: Enabled
  Primary NTP: Your primary NTP server
  Secondary/Tertiary NTP: If you have more than one for redundancy
  
</code></pre>

<h2>Security Settings</h2>
<p>Navigate to the Security settings. Verify or change the following settings</p>
<pre><code>
  Web Access
      Maximum Login Attempts: 3
      Require HTTPS: Enabled
      Maximum Concurrent Sessions: 10
  Password Strength/Settings
      Length: 15
      Require Digits
      Require Other Characters
      Require Uppercase
      Require Lowercase
      Different from Previous: 10
  PKI and SSL
      Appliance Certificate
          Add your server PEM/CER file
      Appliance Private Key
          Add your servers Private Key
      URL of Certificate Revocation List (CRL)
          Use the CRL URL for whatever CA cert your server cert was issued through
  
</code></pre>

<h2>System Settings</h2>
<p>This requires a little more work on your part, and a backup server you have access to. Navigate to System settings and generate a New SSH Key. Copy the SSH key to your backup server so backups are able to be transferred. 
There should be online guides for this. I might cover it later on in the future if my ADHD allows me.</p>
<p>After you copy the SSH key to your backup server, verify or change the following</p>
<pre><code>
  Automated Backup Management
      Backup Type: Reference Configuration or Full System (based on your company requirements)
      Backup Frequency: Weekly (or based on your company policy)
      Mandatory Backup Interval: Monthly (or based on your company policy)
      Remote Host: Your backup server IP
      Remote Path: Whatever path on your backup server they should be saved to
      Remote Username: Username that will be used for logging into the backup server
  
</code></pre>

<h2>FIPS</h2>
<p>Broadcom used to provide the ability for users to move back and forth between FIPS mode, but the ability to do so has been removed (verified with Support). However, 
Security Analytics by default is already compliant with FIPS algorithms. You can verify this for yourself in the following locations</p>
<pre><code>
  cat /etc/environment
  cat /etc/sysconfig/httpd
  
</code></pre>
<p>The algorithms listed should match up with whatever the FIPS check requires. If not, you can edit the two files and make the required changes. In theory, doing so would just require 
you to restart httpd and log out and back in for any changes to take affect.</p>


<h2>Yay Compliance</h2>
<p>That should be it. Again, many of the checks are already covered by the device, or in instances of the firewall settings, it's purely based on your company and environment, 
in which I won't be going into detail for reasons. Hope this guide helps!</p>
