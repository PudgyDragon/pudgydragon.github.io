---
title: "Upgrade"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/Upgrade.md"
---

<h1>Security Analytics Upgrade</h1>
<p>Really just a quick and dirty guide in case Broadcom deletes more of their documents relating to Security Analytics since it's going to be EOL/EOS in 5 years. In the event that it still exists, 
the guide can be found at:</p>
<ul>
  <li>https://knowledge.broadcom.com/external/article/167794/upgrading-to-the-latest-version-of-secur.html</li>
</ul>
<h3>*** WARNING *** If you made any modifications to your system previously, such as mapping eth0 to another port, the upgrade will revert your device to original configs</h3>
<h3>*** WARNING *** If you're using a legacy license, upgrading your device will blow away your license, and depending on your license type, you may not be able to license it again</h3>

<h2>Le Guide</h2>
<p>Check that you have enough disk space for the upgrade file</p>
<pre><code>
  # Look to make sure 3 GB is free in the /ds directory
  df -h
    
</code></pre>
<p>Delete any old ISOs from the /ds directory if you have any in there. Next, clear out any old files from the upgrades folder</p>
<pre><code>
  rm -fr /ds/upgrade/*
  
</code></pre>
<p>Move the iso file from whatever directory you have it in to the /home directory, and then run it with the following command, making sure to replace the file name with the name of the iso</p>
<pre><code>
  run /etc/utils/solera-upgrade.sh /home/upgrade.iso
  
</code></pre>
<p>After it's finished running the extraction, you will need to reboot the appliance to actually run the upgrade</p>
<pre><code>
  reboot now
  
</code></pre>
<p>Give it a while and the device should come back online once the upgrade is complete.</p>
