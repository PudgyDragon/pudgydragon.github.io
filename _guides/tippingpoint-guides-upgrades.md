---
title: "Upgrades"
project: "TippingPoint"
category: "Engineering Guide"
description: "A practical engineering guide for TippingPoint."
source_url: "https://github.com/PudgyDragon/TippingPoint/blob/main/Guides/Upgrades.md"
---

<h1>TippingPoint Upgrade Guide</h1>
<p>Guide for upgrading your TippingPoint SMS and TPS devices. This guide assumes that you manually pull updates from TMC rather than 
  fetching them through your IPS. The order of upgrade will be</p>

<ul>
  <li>SMS</li>
  <li>Local TPS</li>
  <li>Remote TPS (if applicable)</li>
</ul>
<p>Upgrading any TPS before the SMS may cause issues between the devices.</p>

<h2>Layer Two Fallback</h2>
<p>Due to nature of upgrading the system, you may wish to ensure that if something goes wrong, there will be minimal impact to network traffic. One way to do this is by placing 
your devices in layer two fallback (L2F) before upgrading them. This will be done on your TPS devices. To place a TPS in L2F</p>
<ul>
  <li>Navigate to the Devices tab</li>
  <li>Expand the device you want to configure in the left menu</li>
  <li>Click "Device Configuration" in the left menu</li>
  <li>Click "Edit" on the bottom of the dashboard</li>
  <li>Click "HA (High Availability)" in the menu that appears</li>
  <li>Select the "Fallback" bubble to enable it</li>
  <li>Hit the "Apply" button</li>
</ul>
<p>This will place your device in L2F, allowing traffic to treat the device like a switch and bypassing any IPS rules you have in place. At the end of the guide when all devices are 
upgraded, refer back to take the device out of L2F by selecting and enabling the "Normal" bubble next to the "Fallback" bubble.</p>

<h2>SMS Upgrade</h2>
<p>The SMS upgrade is pretty straight forward. Once you have the software for upgrading</p>
<ul>
  <li>Navigate to the Admin tab</li>
  <li>Click "General" in the left menu</li>
  <li>Under "SMS Software" on the dashboard, select "Import" and choose the software from your files</li>
  <li>Click "Install"</li>
</ul>
<p>Your SMS should go through the installation process after this. After the device is finished upgrading, you will need to install the new SMS client on your workstation. You should 
be able to navigate to the URL/IP of your SMS in a browser, login to the device, and download the client from there.</p> 
<p>Once it's done, you can move on to your TPS devices.</p>

<h2>TPS Upgrade</h2>
<p>It's a good idea to start with devices that are local to you (in the event you have both local and remote IPS devices on your network), because if something goes wrong with your 
first upgrade, it's better to have it go wrong on a device that you can get to quickly. You don't have to listen to me, but consider only doing one device at a time.</p>
<p>Once you have the TPS software you wish to install</p>
<ul>
  <li>Navigate to the Devices tab</li>
  <li>Select "TippingPoint OS" in the left menu</li>
  <li>In the middle of the dashboard, choose "Import" to upload the software file</li>
  <li>After imported, click the OS version in the TOS inventory you wish to upgrade to and select "Distribute"</li>
  <li>You should be able to choose which device(s) you want to upgrade to the version you selected</li>
  <li>Click "Ok" to begin the upgrade</li>
</ul>
<p>If everything goes according to plan, your devices should all be upgraded. You can now refer back to the L2F portion of this guide to remove your device from 
L2F and back into Normal mode.</p>

<h2>Fingers Crossed</h2>
<p>Hopefully everything went smooth and you didn't cause any network outages from my guide. If so...whoops. Special shout out to my buddy SlippyPenguin for 
teaching me everything I know about TippingPoint.</p>
