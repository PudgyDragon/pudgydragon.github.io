---
title: "Digitalvaccines"
project: "TippingPoint"
category: "Engineering Guide"
description: "A practical engineering guide for TippingPoint."
source_url: "https://github.com/PudgyDragon/TippingPoint/blob/main/Guides/DigitalVaccines.md"
---

<h1>Updating Digital Vaccines</h1>
<p>Guide for updating the different digital vaccines used by TippingPoint SMS. This guide assumes that you have to pull updates manually from 
your workstation, and apply them manually.</p>

<h2>TMC</h2>
<p>There are several types of digital vaccines you will need to pull from the Trend Micro TMC website. You can find them in the following locations on TMC</p>
<ul>
  <li>Digital Vaccine
    <ul>
      <li>Releases > Digital Vaccines</li>
    </ul>
  </li>
  <li>Auxiliary DV
    <ul>
      <li>Releases > ThreatDV > AuxiliaryDV (Malware)</li>
    </ul>
  </li>
  <li>Reputation Database (URL)
    <ul>
      <li>Releases > ThreatDV > SMS URL Reputation Feed</li>
    </ul>
  </li>
  <li>Reputation Database (IP)
    <ul>
      <li>Releases > ThreatDV > SMS Full Reputation Feed</li>
    </ul>
  </li>
  <li>Geo Locator DB
    <ul>
      <li>Releases > Software > SMS > Geo Location</li>
    </ul>
  </li>
</ul>

<h2>SMS</h2>
<p>Once you have all the DV update files downloaded and you're logged into your SMS, you can update them with the following methods.</p>

<h3>Digital Vaccine</h3>
<ul>
  <li>Navigate to the Profiles tab</li>
  <li>In the left menu, select "Digital Vaccines"</li>
  <li>On the dashboard, click "Import" and choose the update from your file system</li>
  <li>Select the new DV and click "Distribute"</li>
  <li>Select which device(s) you want to push the new DV to, and hit "Ok"</li>
  <li>Once it finishes distributing to all devices, select it again and click "Activate"</li>
</ul>
<p>Activating the digital vaccine will install it on the devices it has been distributed to and make it the "active" version.</p>

<h3>Auxiliary DV</h3>
<ul>
  <li>Navigate to the Profiles tab</li>
  <li>In the left menu, select "Auxiliary DVs"</li>
  <li>On the dashboard, click "Import" and choose the update from your file system</li>
  <li>Select the new Auxiliary DV and click "Distribute"</li>
  <li>Select which device(s) you want to push the new Auxiliary DV to, and hit "Ok"</li>
  <li>Once it finishes distributing to all devices, select it again and click "Activate"</li>
</ul>
<p>Activating the Auxiliary DV will install it on the devices it has been distributed to and make it the "active" version.</p>

<h3>Reputation Database</h3>
<p>I am bombining these because they are in the same dashboard</p>
<ul>
  <li>Navigate to the Profiles tab</li>
  <li>In the left menu, expand "Reputation Database" and select "ThreatDV Entries"</li>
  <li>For both the IP and URL databases, click the respective "Import" button under "ThreatDV IP/Domain Reputation" and "ThreatDV URL Reputation"</li>
  <li>Select the respective file for each one form your file system and click "Ok"</li>
</ul>

<h3>Geo Locator DB</h3>
<ul>
  <li>Navigate to the Admin tab</li>
  <li>In the left menu, select "Geo Locator Database"</li>
  <li>Click the "Import" button</li>
  <li>You may have to change the file type</li>
  <li>Select the file from your file system and click "Ok"</li>
</ul>

<h2>All Done</h2>
<p>In most scenarios, you have this all automated to pull DV updates automatically, keeping your databases constantly up to date. But, in some cases you may need to rely on 
the method to manually update them. Hopefully if you're part of the latter scenario, this guide helps you out. Another special shoutout to my friend SlippyPenguin for his sage wisdom.</p>

