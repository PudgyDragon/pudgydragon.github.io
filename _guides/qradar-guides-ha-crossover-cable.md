---
title: "Ha Crossover Cable"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/HA_Crossover_Cable.md"
---

<h1>HA Crossover Cable Configuration</h1>
<p>Short guide on configuring the crossover cable between your HA pairs. Had to do some Googling to figure it out.</p>

<h2>GUI Settings</h2>
<p>Start on the GUI configurations first.</p>
<ul>
  <li>On the GUI, go to the Admin page</li>
  <li>Click System and License Management; choose System from the dropdown menu</li>
  <li>Right Click the HA pair you want to configure and then Edit HA Host</li>
  <li>Check the box labeled "Configure Crossover Cable"</li>
  <li>Choose the interface you're planning to use</li>
  <li>Expand the Advanced Options</li>
  <li>Choose two Non-Routable IPs to use (it also already is configured if you don't wish to change them)</li>
  <li>Change the MTU based on throughput (9000 if you have a 10G interface, for instance)</li>
  <li>Finish</li>
</ul>
<p>Note: I don't know if it's required or not, but because I had multiple HA pairs I used different subnets for my non-routable IP addresses for each pair. 
ie one pair will have Primary 10.10.10.1 and Secondary 10.10.10.2, while my other HA pair has 10.10.20.1 and 10.10.20.2, respectively.</p>

<h2>CLI Settings</h2>
<p>Once you have the GUI configurations done, SSH into the console and then to your primary HA server.</p>
<p>While on the Primary HA server, SSH to the crossover IP of the Secondary, and back</p>
<pre><code>
  ssh root@10.10.10.2 -o StrictHostKeyChecking=no
  ssh root@10.10.10.1 -o StrictHostKeyChecking=no
  
</code></pre>
<p>I had issues with them not wanting to talk to each other and did SSH back and forth between their management IP addresses and the crossover IP addresses. Afterwards, 
enable the crossover cables on the Primary</p>
<pre><code>
  /opt/qradar/ha/bin/qradar_nettune.pl crossover enable
  
</code></pre>
<p>It's been a couple months since I did this and can't remember if you have to do this on the Secondary as well. You should be able to check the status on each host by 
running the following</p>
<pre><code>
  /opt/qradar/ha/bin/qradar_nettune.pl crossover status
  
</code></pre>

<h1>Done</h1>
<p>That should be it. Sorry if I missed something.</p>
