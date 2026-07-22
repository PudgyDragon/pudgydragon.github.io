---
title: "Change Ip"
project: "TippingPoint"
category: "Engineering Guide"
description: "A practical engineering guide for TippingPoint."
source_url: "https://github.com/PudgyDragon/TippingPoint/blob/main/Guides/Change_IP.md"
---

<h1>Changing the SMS IP Address</h1>
<p>Little guide for updating the SMS IP address for whatever reason or use case.</p>

<h2>Pre-Requisite</h2>
<p>Changing the IP address of the SMS can cause issues between it and the TPS devices it manages. You will need to unmanage any devices currenlty being managed by it. 
There are two ways to do this. Doing so should keep the devices listed on the SMS and not delete them, making it easier to manage them once complete. You will also 
need to verify any ACLs you may have in place are changed on TPS.</p>

<h3>ACL</h3>
<p>If you have an ACL in place on your TPS that restricts what device IPv4 is able to manage the device, you will need to make sure your 
new IP is allowed to manage it from CLI or GUI. An actual guide can be found here</p>
<a href="https://success.trendmicro.com/en-US/solution/KA-0020391">Configuring TPS Management Port Access with ip-filter</a>
<h4>From CLI</h4>
<pre><code>
  edit
  int mgmt
  ip-filter allow ip x.x.x.x
  exit
  commit
  exit
  save-config
    
</code></pre>
<h4>From GUI</h4>
<pre><code>
  Devices > All Devices > Expand Device > Device Configuration > Edit > Host IP Filters > New
  
</code></pre>
<h3>SMS</h3>
<p>Unmanaging the TPS from the SMS GUI</p>
<pre><code>
  Devices > All Devices > Right Click Device > Edit > Unmanage Device
  
</code></pre>

<h3>TPS</h3>
<p>Unmanaging the TPS from the TPS CLI</p>
<pre><code>
  sms unmanage
  
</code></pre>

<h2>Changing the IP</h2>
<p>This can be done two diferent ways as well. While doing it from the GUI is available, depending on your scenario you may need to use CLI.</p>

<h3>GUI</h3>
<p>From the SMS GUI</p>
<ul>
  <li>Log in to the SMS from a client.</li>
  <li>On the SMS toolbar, navigate to the Admin > Serverr Properties tab.</li>
  <li>In the network interface area, enter the desired information:</li>
  <ul>
    <li>IP Address</li>
    <li>Subnet Mask</li>
    <li>Gateway</li>
    <li>IPv6 Address (if required)</li>
    <li>Default Router (if required)</li>
  </ul>
  <li>Click "Apply"</li>
</ul>
<p>Once complete, the device will reboot for changes to take affect.</p>

<h3>CLI</h3>
<p>From the SMS CLI</p>
<pre><code>
  set net
      Set any settings that it prompts you for, similar to GUI
  reboot
  
</code></pre>
<p>As you can infer, you will need to reboot the device after using the command to set the IP</p>

<h2>Managing TPS</h2>
<p>Once complete, you will need to re-manage your TPS devices. Make sure the TPS is ready to be managed running the following command in its CLI</p>
<pre><code>
  sms manage
  
</code></pre>
<p>From the SMS GUI, similar to unmanaging</p>
<pre><code>
  Devices > All Devices > Right Click Device > Edit > Manage Devices
  
</code></pre>
