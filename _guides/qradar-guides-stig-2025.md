---
title: "Stig 2025"
project: "QRadar"
category: "STIG"
description: "A practical stig for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/STIG_2025.md"
---

<h1>QRadar STIG Guide for 7.5.0 UP14</h1>
<p>I created this guide from my experience, along with the guides provided by IBM. It covers the RHEL 8 STIG and the Central Syslog Server STIG.</p>

<h2>DISCLAIMER</h2>
<p>IBM QRadar 7.5.0 Security Technical Implementation Guide:</p>

<p>https://www.ibm.com/docs/en/qsip/7.5?topic=guide-qradar-configuration-highly-secure-environments</p>

<p>The above guide is only listed as a reference, however, do not use it. This above guide is incorrect and will cause system failure. 
This has already been tested in the field with a live customer and caused massive downtime and factory reinstall.<p>
  
<p>NOTE: Pay close attention to this guide. The DISA STIG can completely break QRadar and require emergency remedial action.</p>

<h2>***IMPORTANT***</h2>
<p>All HA systems need to be unpaired when you run the STIG hardening. If you want to harden the HA systems in a cluster, unpair the HA cluster, 
  and then run the STIG hardening script on each system. After the STIG hardening script is run, you can pair the HA systems again.</p>
<p>https://www.ibm.com/docs/en/qsip/7.5?topic=qchse-enabling-remote-root-login-ha-pairing-in-stig-hardened-environment</p>

<p>NOTE: While creating this guide, I rebooted the appliance in every location that the original IBM guide had said to do it. You can probably get away with rebooting at the very end (except for the mandatory
reboot after the hardening script is ran). I will still include all of the reboot commands in the sections where I rebooted, if you wish to not risk it.</p>
<p>NOTE: Make sure that all CA certs are updated within the console and all managed hosts in the following locations</p>
<pre><code>
  /etc/pki/ca-trust/source/anchors
  /opt/qradar/conf/trusted_certificates
  
</code></pre>

<h2>RHEL 8 STIG</h2>

<h3>Setup Admin User</h3>
<p>If you haven't already created an admin user, you can do so now using these commands</p>
<pre><code>
  useradd pudgy
  passwd pudgy
  usermod -aG wheel pudgy
  
</code></pre>
<p>Once you have an admin user, make sure they're a sudoer</p>
<pre><code>
  vim /etc/sudoers.d/pudgy
      pudgy ALL=(ALL) ALL
  
</code></pre>
<p>Next, create an SSH Key pair and transfer it as the admin account</p>
<pre><code>
  ssh-keygen -b 4096 -t rsa
  ssh-copy-id pudgy@x.x.x.x -o StrictHostKeyChecking=no
  
</code></pre>

<h3>Hardening Script</h3>
<p>Starting with the console, run the hardening script on all of your devices</p>
<pre><code>
  cd /opt/qradar/util/stig/bin
  ./stig_harden.sh -a
   
</code></pre>
<p>Once it's complete, reboot the system when prompted</p>
<pre><code>
  reboot now
  
</code></pre>

<h3>Editing Scripts</h3>
<p>Remove the auto TMUX</p>
<pre><code>
  rm -f /etc/tmux.conf && rm -f /etc/profile.d/tmux.sh
  
</code></pre>

<p>Root login will be different between hosts. The console will be set to "no", while the managed hosts will be set to "prohibit-password". If you are running HA systems, 
make sure they are set to "yes" until the end of the guide</p>
<pre><code>
  vim /etc/ssh/sshd_config
      PermitRootLogin no/yes/prohibit-password
  systemctl restart sshd
  
</code></pre>

<p>Configure AIDE - This is something that has to be done after every update as well</p>
<pre><code>
  aide --init
  mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
  aide --update
  mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
  
</code></pre>


<p>Disable Packet Forwarding - ONLY ON MANAGED HOSTS, NOT THE CONSOLE</p>
<pre><code>
  sysctl -w net.ipv4.ip_forward=0 && sysctl -w net.ipv6.conf.all.forwarding=0 && sysctl -w kernel.dmesg_restrict=1 && sysctl -w kernel.perf_event_paranoid=2
  vim /etc/sysctl.conf
      net.ipv4.ip_forward = 0
      net.ipv6.conf.all.forwarding = 0
      kernel.dmesg_restrict = 1
      kernel.perf_event_paranoid = 2
    
</code></pre>

<p>Enable audit logging to syslog (I have it set to send logs to the EP)</p>
<p>Syslog over 514</p>
<pre><code>
  vim /opt/qradar/syslog-ng/syslog-ng.conf.default
      destination remote_audit { tcp("X.X.X.X" port (514)); };
      log { source(s_local); filter(authpriv); destination(remote_audit);};
      log { source(s_local); filter(local_0_1_info); destination(remote_audit);};
      log { source(s_local); filter(cron); destination(remote_audit);};
      log { source(s_local); destination(remote_audit);};
</code></pre>
<p>OR</p>
<p>TLS Syslog over 6514</p>
<pre><code>
  vim /opt/qradar/syslog-ng/syslog-ng.conf.default
      destination remote_audit { network("X.X.X.X" port(6514) transport(tls) tls(peer-verify(yes) cert-file("/opt/qradar/conf/trusted_certificates/host.cer") key-file("/root/host.key")) );};
      log { source(s_local); filter(authpriv); destination(remote_audit);};
      log { source(s_local); filter(local_0_1_info); destination(remote_audit);};
      log { source(s_local); filter(cron); destination(remote_audit);};
      log { source(s_local); destination(remote_audit);};
  systemctl restart syslog-ng
  
</code></pre>
<p>It's important to note that the certificate and key need to be owned by root and have 644 permissions.</p>

<p>Edit the fstab mount options next to mirror these</p>
<pre><code>
  vim /etc/fstab
      /boot  xfs  nosuid,nodev  0 0
      /boot/efi  vfat  nosuid,nodev  0 0
      /home  xfs  defaults,nosuid,noexec,nodev  0 0
      /opt  xfs  defaults,noatime,nodev  0 0
      /recovery  xfs  nosuid,nodev  0 0
      /store  xfs  noatime,nodev  0 0
      /storetmp  xfs  defaults,noatime,nodev,nosuid  0 0
      /tmp  xfs  rw,nosuid,nodev,noatime,attr2,inode64,logbufs=8,logbsize=256k,noquota  0 0
      /transient  xfs  defaults,noatime,nodev,nosuid  0 0
      /var  xfs  defaults,noatime,nodev  0 0
      /var/log  xfs  noatime,nodev,nosuid,noexec  0 0
      /var/log/audit  xfs  defaults,noatime,nodev,nosuid,noexec  0 0
      /var/tmp  xfs  defaults,nodev,noexec,nosuid  0 0
  
</code></pre>
<p>Note: tmp can't have the noexec option due to update pre-checking. Verified by IBM.</p>

<p>Disable additional kernel modules</p>
<pre><code>
  echo -e "install cramfs /bin/false\nblacklist cramfs" > /etc/modprobe.d/cramfs.conf
  echo -e "install firewire-core /bin/false\nblacklist firewire-core" > /etc/modprobe.d/firewire-core.conf
  echo -e "install tipc /bin/false\nblacklist tipc" > /etc/modprobe.d/tipc.conf
  echo -e "install uvcvideo /bin/false\nblacklist uvcvideo" > /etc/modprobe.d/uvcvideo.conf
  
</code></pre>

<p>Change login settings</p>
<pre><code>
  vim /etc/login.defs
      PASS_MIN_LEN 15
      SHA_CRYPT_MIN_ROUNDS 100000
  vim /etc/systemd/logind.conf
      StopIdleSessionSec=600
      KillUserProccesses=no
  
</code></pre>

<p>Change SSH settings</p>
<pre><code>
  vim /opt/qradar/conf/ssh/sshd_config.defaults
      ClientAliveCountMax 1
  vim /etc/sysconfig/sshd
      SSH_USE_STRONG_RNG=32
</code></pre>

<p>Change audit settings</p>
<pre><code>
  echo "-w /var/log/faillock -p wa -k logins" > /etc/audit/rules.d/audit.rules
  
</code></pre>

<p>Disable debug-shell services</p>
<pre><code>
  systemctl mask --now debug-shell.service
  
</code></pre>

<p>Edit the grub configurations</p>
<pre><code>
  vim /etc/default/grub
      GRUB_CMDLINE_LINUX="crashkernel=auto console=ttyS0,9600 console=tty1 rd.driver.blacklist=r8152,dvb-core r8152.blacklist=1 dvb-core.blacklist=1 vsyscall=none page_poison=1 slub_debug=P audit=1 audit_backlog_limit=8192 init_on_free=1 pti=on"
  grubby --update-kernel=ALL --args="vsyscall=none page_poison=1 slub_debug=P audit=1 audit_backlog_limit=8192 init_on_free=1 pti=on"
  grub2-mkconfig -o /boot/grub2/grub.cfg
  reboot now
  
</code></pre>

<p>GRUB2 Boot Loader Configuration</p>
<pre><code>
  tar -cvf /root/grub2backup.tar /etc/grub.d /etc/default/grub /boot/grub2
  grub2-setpassword -o /boot/grub2/
  vim /etc/grub.d/10_linux
      # Replace --unrestricted on the line begging with CLASS=
      --users bootuser
  vim /etc/grub.d/01_users
      # Modify the following lines
      set superusers="bootuser"
        export superusers
        password_pbkdf2 bootuser \${GRUB2_PASSWORD}
  grub2-mkconfig -o /boot/grub2/grub.cfg
  reboot now
  
</code></pre>

<p>Configure the CA trust anchor with your root certificate</p>
<pre><code>
  vim /etc/sssd/pki/sssd_auth_ca_db.pem
      # Copy certificate contents into this file and save it
</code></pre>

<p>Find files with the wrong permissions and change them to 755. If you run Evaluate STIG, there are a number that may populate. The following 4 chmod commands should fix it</p>
<pre><code>
  find -L /bin /sbin /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -perm /022 -exec ls -l {} \;
  chmod 755 /bin/tnameserv
  chmod 755 /bin/loginmsg
  chmod 755 /sbin/ifup-local
  chmod 755 /sbin/setkey
</code></pre>

<p>Modify some other kernel settings</p>
<pre><code>
  vim /etc/sysctl.d/99-sysctl.conf
      kernel.dmesg_restrict = 1
      kernel.perf_event_paranoid = 2
      net.ipv4.conf.all.rp_filter = 1
  vim /etc/sysctl.conf
      kernel.dmesg_restrict = 1
      kernel.perf_event_paranoid = 2
      net.ipv4.conf.all.rp_filter = 1
  sysctl --system
  
</code></pre>

<p>Modify faillock</p>
<pre><code>
  vim /etc/security/faillock.conf
      deny = 3
      fail_interval = 900
      unlock_time = 0
      silent
      audit
      even_deny_root
  
</code></pre>

<p>Modify Linux Audit logging of USBGuard Daemon</p>
<pre><code>
  vim /etc/usbguard/usbguard-daemon.conf
      AuditBackend=LinuxAudit
</code></pre>

<p>In theory, when you set up the RHEL installation, if you put your own NTP servers on it, you shouldn't have to set up chrony, but you can verify. While you're in there, 
disable network management of the chrony daemon too</p>
<pre><code>
  vim /etc/chrony.conf
      server [ntp.server.name] iburst maxpoll 16
      cmdport 0
  
</code></pre>

<p>Disable settings in modprobe</p>
<pre><code>
  vim /etc/modprobe.d/blacklist.conf
      install atm /bin/false
      install can /bin/false
      install sctp /bin/false
      install usb-storage /bin/false
  reboot now
  
</code></pre>

<p>Allow auditing scripts/executables by cron as root or privileged user</p>
<pre><code>
  vim /etc/audit/rules.d/audit.rules
      -w /etc/cron.d/ -p wa -k cronjobs
      -w /var/spool/cron/ -p wa -k cronjobs
  augenrules --load
  
</code></pre>

<p>Configure the server to only use FIPS-validated key exchange algorithms</p>
<pre><code>
  vim /etc/crypto-policies/back-ends/opensshserver.config
      -oKexAlgorithms=ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group-exchange-sha256,diffie-hellman-group14-sha256,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
      -oCiphers=aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes128-ctr
  reboot now
  
</code></pre>

<p>Configure the server to use only MACs employing FIPS algorithms</p>
<pre><code>
  sed -i -E 's/(-oMACs=)[^ ]*/\1hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256/' "$(readlink -f /etc/crypto-policies/back-ends/openssh.config)"
  reboot now
</code></pre>

<p>Configure the server to use only ciphers employing FIPS 140-3 approved algorithms</p>
<pre><code>
  vim /etc/crypto-policies/back-ends/openssh.config
      Ciphers aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes128-ctr
      MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
  reboot now
</code></pre>

<p>BEFORE PAIRING HA DEVICES, REMEMBER TO HAVE PERMITROOTLOGIN SET TO YES ON THEM</p>
<p>Pair your HA devices if you have them, then swap it back to either prohibit-password or no, based on your own desires. QRadar typically needs to have root communication between 
devices for updates. You can choose to go back into settings and set to yes before each update if you run into issues.</p>

<h3>STIG Responsibilities and Exceptions</h3>
<p>IBM has a list of exceptions, false positives, and what customers have to do for themselves listed here</p>
<p>https://www.ibm.com/docs/en/qsip/7.5?topic=guide-stig-responsibilities-exceptions</p>
<p>You should note that this guide won't get you to 100% clean. QRadar does require a few exceptions. Some exceptions can be documented with your ISSO to be considered NA or NAF, others will remain open.</p>


<h2>Central Syslog STIG</h2>
<p>There wasn't a guide for this online, so I created one. Hope it helps.</p>

<h3>Set Data Hashing</h3>
<p>In the GUI, enable flow and log hashing</p>
<pre><code>
  Admin > System Settings > Ariel Database Settings > Flow Log Hashing
  Admin > System Settings > Ariel Database Settings > Event Log Hashing
  
</code></pre>

<h3>Set up Backups (7 Day Minimum non-SAMI, 5 years for SAMI)</h3>
<p>In the GUI, configure backups</p>
<pre><code>
  Admin > System Configuration > Backup and Recovery > Configure > Configuration and Data Backups
      Event and Flow Data
      Backup Retention Period (Days)
  
</code></pre>

<h3>MFA</h3>
<p>This is your preference</p>
<pre><code>
  Admin > Authentication > Authentication Module Settings
  
</code></pre>

<h3>Password Requirements</h3>
<p>Set GUI requirements</p>
<pre><code>
  Admin > Authentication > Local Password Policy Configuration
      Minimum Password Length > 15
      Use Complexity Rules
          Number of rules required > 4
          Contain an Uppercase Character
          Contain a Lowercase Character
          Contain a Digit
      Not contain repeating characters > Enabled
      Password History
          Unique password count > 8
          Days before password will expire > 60
  
</code></pre>

<h3>Proof of Audit Reduction</h3>
<p>There is a built in dashboard on the main dashboard page you can reference for this check</p>
<pre><code>
  Dashboard > System Monitoring > System Summary Dashboard
  
</code></pre>

<h3>75 Percent Storage Reached</h3>
<p>This STIG is covered through the RHEL 8 STIG</p>


<h3>Using UTC Time</h3>
<p>Verify the system is based on UTC</p>
<pre><code>
  Admin > System and License Management > Systems > Right Click Device > View and Manage System > System Time
  
</code></pre>

<h3>Account Lockout</h3>
<p>QRadar doesn't have a native "lockout until an admin unlocks the account", but it does allow for an extreme future date that will pass for an audit</p>
<pre><code>
  Admin > Authentication > General Authentication Settings > Lockout Management
      Maximum Account Login Failures > 3
      Account Login Failure Attempt Window > 15
      Account Login Failure Block Time > 150119987579
          This equates to 28k years
  
</code></pre>

<h3>DoD Notice and Consent</h3>
<p>Self explanatory</p>
<pre><code>
  Admin > Authentication > General Authentication Settings > Login Page
      Login Message > DoD Message
      Require explicite consent of this message for Login > Enabled
  
</code></pre>


<h3>Session Termination</h3>
<p>Terminate user session after organization-defined conditions</p>
<pre><code>
  Admin > Authentication > General Authentication Settings > Session Management
      What is done in the rest of this guide should satisfy the requirement
  
</code></pre>

<h3>Record Retention</h3>
<p>Retention based on criticality level, event type, and/or retention period</p>
<pre><code>
  Admin > Data Sources > Events > Event Retention
      Set to what your org requires
  Admin > Data Sources > Events > Flow Retention
      Set to what your org requires
  
</code></pre>


<h3>Offloading Backups</h3>
<p>This requires that you have a backup server that you can use for this requirement. This is a simple-ish method you can use to satisfy the requirement.</p>
<p>Login to your backup server from each QRadar device and create a backup folder</p>
<pre><code>
  ssh pudgy@x.x.x.x -o StrictHostKeyChecking=no
  exit
  ssh-copy-id pudgy@x.x.x.x -o StrictHostKeyChecking=no
  ssh pudgy@x.x.x.x
  mkdir /backups/qradar
  chown -R pudgy:pudgy /backups/qradar/
  chmod -R 755 /backups/qradar/
  
</code></pre>
<p>Create a nohup rsync script that you can run. This will be created on your console and event/flow processors (including HA)</p>
<pre><code>
  vim /usr/bin/rsync_backup
      #!/bin/bash
      nohup /usr/bin/rsync -chavzP /store/backup/ pudgy@X.X.X.X:/backups/qradar/ &
  chmod 755 /usr/bin/rsync_backup
  
</code></pre>
<p>For an app host, there's a different backup directory to use. You will first have to configure the device to do nighly backups</p>
<pre><code>
  crontab -e
      # Run QRadar Backup Script every night
      0 0 * * * /opt/qradar/bin/app-volume-backup.py backup
  
</code></pre>
<p>Next, create the rsync script for these backups</p>
<pre><code>
  vim /usr/bin/rsync_backup
      #!/bin/bash
      nohup /usr/bin/rsync -chavzP /store/apps/backup/ pudgy@X.X.X.X:/backups/qradar/ &
  chmod 755 rsync_backup
</code></pre>
<p>Finally, set cron to run your backup script on your desired day and time. The following is an example of it running every 
Friday (5) at 1PM (13)</p>
<pre><code>
  crontab -e
      # Run QRadar Rsync Script
      0 13 * * 5 /usr/bin/rsync_backup
</code></pre>

<h2>Fin</h2>
<p>Hopefully this guide helps. No one likes doing STIGs.</p>




