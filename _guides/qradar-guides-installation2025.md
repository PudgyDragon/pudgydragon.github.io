---
title: "Installation2025"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Installation2025.md"
---

<h1>IBM QRadar Installation Guide for RHEL 8</h1>
<p>This is a new installation guide for IBM QRadar SIEM 7.5 UP13. This guide is similar to my previous guide, which was written by an IBM engineer when it was RHEL 7.
I recently deployed seven devices, in a High Availability deployment, using this guide that I have created based on IBMs guides. I will follow up with a STIG guide
for RHEL 8 QRadar deployments that I am currently working on.</p>
<p>This guide should only be completed on devices that have two types of storage, similar to the previous guide I wrote. In this instance, it is using SSD storage for
the OS installation, and NVMe storage for the store and transient volumes. Two guides you can reference are:</p>
<ul>
  <li>
    <a href="https://www.ibm.com/docs/en/qsip/7.5?topic=qsi-installing-rhel-your-system">Installing RHEL on your system</a>
  </li>
  <li>
    <a href="https://www.ibm.com/docs/en/qsip/7.5?topic=irys-linux-operating-system-partition-properties-qradar-installations-your-own-system-1">Linux operating system partition properties for QRadar installations on your own system</a>
  </li>
</ul>

<h2>Requirements</h2>
<p>For this installation, I mostly followed IBMs guide for requirements, with one major exception to
  the RAID level of QNI. These are the requirements for each device type following my guide:</p>
<table>
  <tr>
    <th>Device Type</th>
    <th>Storage Requirement</th>
    <th>RAID</th>
  </tr>
  <tr>
    <td>Console</td>
    <td>/store needs 80% of remaining, /transient needs 20%</td>
    <td>RAID 1 on PERC, RAID 6 on NVMe Drives</td>
  </tr>
  <tr>
    <td>Application Host</td>
    <td>/store needs 80% of remaining, /transient needs 20%</td>
    <td>RAID 1 on PERC, RAID 6 on NVMe Drives</td>
  </tr>
  <tr>
    <td>Event/Flow Processor</td>
    <td>/transient needs lesser of the two: 20% or 500GB, /store needs the remaining</td>
    <td>RAID 1 on PERC, RAID 6 on NVMe Drives</td>
  </tr>
  <tr>
    <td>High Availability</td>
    <td>Exactly the same as the device it will be secondary to</td>
    <td>Exactly the same as the device it will be secondary to</td>
  </tr>
  <tr>
    <td>QRadar Network Insights</td>
    <td>/store needs 100%</td>
    <td>RAID 1 on PERC, RAID 10 on NVMe Drives</td>
  </tr>
</table>
<p>RAID on the SSD drives should be set up through your BIOS setup using the RAID configuration capability. RAID on the NVMe drives will be set up during
the installation of RHEL, contrary to the original guide I posted, unless you have the capability to create RAID on your NVMe from BIOS, which I didn't.</p>

<h2>RHEL 8 Installation</h2>
<p>You don't need a USB for installation, and can createa a bootable Bluray whatever way you can. I used Windows native disc burner by
right clicking the RHEL ISO and choosing the option to burn it to the Bluray disk. Once you have it created, boot your server and enter your BIOS options to boot from the Bluray.</p>

<h3>RHEL Settings</h3>
<p>Once you have reached the installation screen for RHEL, configure your own settings similar to the previous guide:</p>
<ul>
  <li>!! -- IMPORTANT -- !!
    <ul>
      <li>Choose the type of installation as MINIMALISTIC
        <ul>
          <li>Not doing so will create issues</li>
        </ul>
      </li>      
    </ul>
  </li>
  <li>Configure Network
    <ul>
      <li>Disable IPv6</li>
    </ul>
    <ul>
      <li>Configure IPv4
        <ul>
          <li>Manual or DHCP</li>
          <li>IPv4 Address</li>
          <li>Subnet Mask</li>
          <li>Gateway</li>
          <li>DNS</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Configure NTP Servers</li>
  <li>Set root password</li>
  <li>Create Admin user
    <ul>
      <li>Create a unique username that isn't just "admin"</li>
      <li>Make sure you check the box to make them an administrator</li>
    </ul>
  </li>
  <li>Disable KDUMP</li>
  <li>Configure Paritions and NVMe RAID
    <ul>
      <li>This will depend on device type, which I will separate below in the next section</li>
    </ul>
  </li>
</ul>

<h3>Paritions and RAID</h3>
<p>Contrary to the original installation guide, you can create BOTH the <code>rootrhel</code> and <code>storerhel</code> volume groups during
the RHEL installation process, and you don't need to do them separately through CLI commands.</p>
<p>Configure the drives, choosing ALL drives (SSD and NVMe), and choose to create your own custom settings. On the next page, delete any
partitions on the drives from previous installations/images. Start by creating the <code>/home</code> partition with whatever size you choose.
Once it is created, choose to modify the partitions volume group, renaming it to <code>rootrhel</code>, and select ONLY the SSD drives as
those belonging to it.</p>
<p>Next, create the <code>/store</code> partition, and choose the option of creating a new volume group. Name this one <code>storerhel</code>, 
and change the drives to ONLY be the NVMe and NOT the SSD. Before saving the modified volume group, make sure to change the RAID level based on
the device requirements listed above.</p>

<h3>Console and Application Host</h3>
<p>The RAID and partitions for both the Console and the Application Host will be mirrored. Please note, the boxes I set these up on
are slightly beefy, and you will need to account for your own drive sizes based on IBM recommendations for minimum sizes.</p>
<p>IMPORTANT - Make sure when you modify a mount point from <code>xfs</code> to <code>standard</code> that you change or verify that the drives being
used are the SSD only.</p>
<ul>
  <li>DATA
    <ul>
      <li>rootrhel (xfs)
        <ul>
          <li>/home - 100G</li>
          <li>/opt - 60G</li>
          <li>/storetmp - 25G</li>
          <li>/var/log - 60G</li>
          <li>/var/log/audit - 30G</li>
          <li>/var/tmp - 10G</li>
        </ul>
      </li>
      <li>sda (standard)
        <ul>
          <li>/recovery - 30G</li>
        </ul>
      </li>
      <li>storerhel (xfs)
        <ul>
          <li>/store - 17.2T</li>
          <li>/transient - 4.4T</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>SYSTEM
    <ul>
      <li>rootrhel (xfs)
        <ul>
          <li>/ - 50G</li>
          <li>/tmp - 20G</li>
          <li>/var - 20G</li>
          <li>swap - 24G</li>
        </ul>
      </li>
      <li>sda (standard)
        <ul>
          <li>/boot/efi - 1G</li>
          <li>/boot - 1G</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

<h3>Event and Flow Processors</h3>
<p>The RAID and partitions for both the Event and Flow Processors will be mirrored. Please note as stated above, the boxes I set these up on
are slightly beefy, and you will need to account for your own drive sizes based on IBM recommendations for minimum sizes.</p>
<p>IMPORTANT - Make sure when you modify a mount point from <code>xfs</code> to <code>standard</code> that you change or verify that the drives being
used are the SSD only.</p>
<p>The only difference in partitionsbetween these devices, and the ones above are the size of the <code>/store</code> and <code>/transient</code> partitions. But, 
so that you don't have to scroll up and down, here it is modified:</p>
<ul>
  <li>DATA
    <ul>
      <li>rootrhel (xfs)
        <ul>
          <li>/home - 100G</li>
          <li>/opt - 60G</li>
          <li>/storetmp - 25G</li>
          <li>/var/log - 60G</li>
          <li>/var/log/audit - 30G</li>
          <li>/var/tmp - 10G</li>
        </ul>
      </li>
      <li>sda (standard)
        <ul>
          <li>/recovery - 30G</li>
        </ul>
      </li>
      <li>storerhel (xfs)
        <ul>
          <li>/store - 21.3T</li>
          <li>/transient - 500G</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>SYSTEM
    <ul>
      <li>rootrhel (xfs)
        <ul>
          <li>/ - 50G</li>
          <li>/tmp - 20G</li>
          <li>/var - 20G</li>
          <li>swap - 24G</li>
        </ul>
      </li>
      <li>sda (standard)
        <ul>
          <li>/boot/efi - 1G</li>
          <li>/boot - 1G</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

<h3>QRadar Network Insights</h3>
<p>IMPORTANT - Make sure when you modify a mount point from <code>xfs</code> to <code>standard</code> that you change or verify that the drives being
used are the SSD only.</p>
<p>The only difference in partitions between this device, and the ones above is that QNI ONLY uses <code>/store</code> and the <code>/transient</code> partition
doesn't exist. For your convenience, here it is modified:</p>
<ul>
  <li>DATA
    <ul>
      <li>rootrhel (xfs)
        <ul>
          <li>/home - 100G</li>
          <li>/opt - 60G</li>
          <li>/storetmp - 25G</li>
          <li>/var/log - 60G</li>
          <li>/var/log/audit - 30G</li>
          <li>/var/tmp - 10G</li>
        </ul>
      </li>
      <li>sda (standard)
        <ul>
          <li>/recovery - 30G</li>
        </ul>
      </li>
      <li>storerhel (xfs)
        <ul>
          <li>/store - 14.5T</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>SYSTEM
    <ul>
      <li>rootrhel (xfs)
        <ul>
          <li>/ - 50G</li>
          <li>/tmp - 20G</li>
          <li>/var - 20G</li>
          <li>swap - 24G</li>
        </ul>
      </li>
      <li>sda (standard)
        <ul>
          <li>/boot/efi - 1G</li>
          <li>/boot - 1G</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

<h3>RHEL Complete</h3>
<p>One you have all of these settings modified, continue the installation of RHEL with the install button and let it do its thing.
Once complete, it will prompt you to reboot the system, allowing you to move on the next steps of installing QRadar itself.</p>


<h2>QRadar Installation</h2>
<p>To start the installation, you will need to SCP the iso file onto your server. After that is complete, create the <code>cdrom</code> mount point for it to be mounted, move the iso into <code>storetmp</code>, mount it, and run the setup script:</p>
<pre><code>
  mkdir /media/cdrom
  mv qradar.iso /storetmp/
  mount -o loop /storetmp/qradar.iso /media/cdrom
  /media/cdrom/setup  
</code></pre>
<p>The initial run will disable SELinux for you, and prompt you to <code>reboot</code> your device:</p>
<pre><code>reboot now</code></pre>
<p>Once it has come back up, you will need to mount the iso and rerun the setup script to complete the installation process:</p>
<pre><code>
  mount -o loop /storetmp/qradar.iso /media/cdrom
  /media/cdrom/setup
</code></pre>
<p>This will lead into the next sections, where you will determine which type of QRadar device you would like to configure.</p>

<h3>Console</h3>
<p>To configure a device as a Console, you will choose the Software Installation option, and choose to create a Console. Go through the setup wizard to configure all your settings. In the end, it will prompt you to keep or change your admin and root password. The admin it refers to is the GUI admin.</p>

<h3>Application Host</h3>
<p>To configure a device as an Application Host, choose the Application Host option (not software). Go through the setup wizard to configure all your settings, just like the console. The difference will be that it will only prompt you to change the root password for it if you want to, but you don't have to.</p>

<h3>Event/Flow Processors</h3>
<p>To install an Event or Flow Processor, choose teh Software Installation option, going through the wizard and choosing whether you want to create an Event or Event Flow processor (the reason for not covering collectors is because an IBM engineer has told me that collectors aren't really needed, and having a processor to collect and process is perfectly fine). Again, you will be prompted to keep or change the root password.</p>

<h3>High Availability Device</h3>
<p>This one will be a little different. You will need to choose to create a High Availability Device, not the software installation. It will ask you whether or not it is for a console. Go through the wizard as normal to configure settings. It will ask you what the IP address is for the Primary host that it will be Secondary to. I can't remember if it's required, but it's good practice to use an IP on the same subnet as your Primary. The one thing I would recommend for this would be to make sure you <strong>CHANGE THE ROOT PASSWORD</strong> to only contain lower and uppercase letters. The reason for this is because when you pair HA devices, issues can arise from the Secondary device having too complex of a password. Once they're paired, you can change it back in the CLI to your company standards. If you are doing HA in a STIG environment, save yourself the headache and DON'T PAIR devices until you have gone through my STIG guide, or through IBM or your own STIG guide.</p>

<h3>QNI</h3>
<p>For this, you will again choose a Software Installation and choose the QRadar Network Insights installation, going through the same wizard to configure your device settings, once again choosing whether or not to change root password in the end.</p>

<h2>Complete</h2>
<p>Simple as that. Hopefully this guide helped you get through installation of any or all of those devices. I am hoping to have a STIG guide published for RHEL 8 relatively soon.</p>
