---
title: "Stig"
project: "QRadar"
category: "STIG"
description: "A practical stig for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/STIG.md"
---

# How To STIG QRadar 7.5.0 Update 6
### IBM Federal Sales Engineering
### This is a guide provided by an IBM Sales Engineer to STIG QRadar. Permission to post the guide here was given by Christian Reyes.
<p>By: Christian L. Reyes</p>
<p>Date: June 15, 2023</p>
<p>Updated: July 10, 2023</p>

## DISCLAIMER
<p>IBM QRadar 7.5.0 Security Technical Implementation Guide:</p>
<p>https://www.ibm.com/docs/en/qsip/7.5?topic=guide-qradar-configuration-highly-secure-environments</p>
<p>The above guide is only listed as a reference, however, do not use it. This above guide is incorrect and will cause system failure. This has already been tested in the field with a live customer and caused massive downtime and factory reinstall.</p>
<p>NOTE: Pay close attention to this guide. The DISA STIG can completely break QRadar and require emergency remedial action. This remedial action must be done for physical servers from live USB drive and access to the physical server. This remedial action for software appliances requires access to the hypervisor console and QRadar 7.5.0 Update 4 ISO mounted to the VM. These remedial actions will be in how-to-guide "Disaster Recovery after GRUB2 Modification".</p>

## Important Customer Information:
- Administrators will no longer be allowed to login as root, this is a STIG requirement. They will have to login with their newly created non-root user account.
- Secondly, due to AIDE being initialized, every time an install, uninstall, system configuration change occurs, or a deployment action is taken, the aide baseline will have to be updated.
- Third, modifications to the GRUB2 configuration make it so that each time the physical or virtual server is rebooted, the administrator must enter the GRUB2 root user password. If they do not enter this password the system will not start. If this is a physical deployment the administrator must have access to the datacenter, the rack where QRadar is installed, a monitor and keyboard they can plug into the QRadar servers.
- Finally, due to STIG requiring all non-system accounts to have a minimum password age of 1 day and a maximum of 60. The stiguser will have to have the password changed every 60 days.

## Prerequisites
<p>Physical Deployment: ensure you have the latest QRadar ISO loaded onto a USB flash drive and the image was created with Fedora Media Writer (https://fedoraproject.org/workstation/download/). This is critical as no other live media writer works properly, this is the only recommended media writer from IBM Support.</p>
<p>Software Deployment: Ensure the QRadar 7.5.0 Update 4 ISO is loaded onto a datastore which the QRadar Console VM can access.</p>
<p>Backup Critical Information: Ensure the customer has backups off-board from QRadar, either on an external NAS or SSD. If having to help them save information off QRadar and onto a NAS or external media, ensure to copy the contents of the following directories over:</p>

- All config and data backups: /store/backup
- All raw events information: /store/ariel/events
- All raw flows information: /store/ariel/flows

Check size of these directories via `du -sh /store/ariel/flows`. Ensure that the size on the system is the same on the off-board media. 

## Creating Non-Root User
- Open Putty or another terminal emulator
- Enter DNS names or IP Address of QRadar Console, then click "open"
- Login to QRadar Console as root user
- Create `stiguser` or client username of choice
  - `useradd -c 'Admin User' -d /home/stiguser -m -s /bin/bash stiguser`
- Change new user password
  - `passwd stiguser`
- Verify no entries with the `NOPASSWD` statement are uncommented in the `/etc/sudoers` file
  - `more /etc/sudoers | grep NOPASSWD`
- After verifying no entries existed with the `NOPASSWD` statement uncommented, the next step is to add `STIGUSER` to the sudoers file
  - Create `stiguser` file in `/etc/sudoers.d` directory
  - `vi /etc/sudoers.d/stiguser`
  - Type `i` (insert)
  - `stiguser ALL=(ALL) ALL`
  - Press ESC; the `--INSERT--` will disappear
  - `:wq!`
- Close Putty or terminal emulator
- Open Putty to QRadar Console
- Login as stiguser
- Verify stiguser can elevate to root permissions
  - `sudo su`
- After verifying that stiguser can escalate to root permission, type `exit` to return to stiguser
- Create SSH key pair for stiguser
  - `ssh-keygen -b 4096 -t rsa`
- Transfer ssh keys to managed host
  - `ssh-copy-id stiguser@<ipaddress> -o StrictHostKeyChecking=no`
- Test that the stiguser can login to the managed host without using a password
  - `ssh stiguser@<ipaddress>`
- After validating the console can login to the managed host without a password, type exit to return to the QRadar Console and proceed to the next section

## Run Hardening Script

- Login to the QRadar Console via Putty or other terminal emulator as root user
- Change directories to `/opt/qradar/util/stig/bin`
  - `cd /opt/qradar/util/stig/bin`
- Run STIG script
  - `./stig_harden.sh -a`
- Verify completion of script
- Reboot the Console
  - `reboot`
- Verify root user can no longer log directly into the Console by attempting to login as root
- Login to QRadar Console with `stiguser` account
- SSH from the Console to the EPFP via stiguser
  - `ssh stiguser@<ipaddress>`
- Sudo to root
- Change directories to `/opt/qradar/util/stig/bin`
- Run STIG script
- Verify STIG script completed successfully
- Reboot the managed host, this will bring you back to the Console
- Wait a couple minutes, then attempt to login via stiguser from the console to the managed host
- Having run the hardening script on the QRadar Console and managed hosts, validating the ability to login from the Console to the managed host, you may proceed to the next section

## Editing Scripts
- Prior to modifying `iptables_update.sl` script, create a copy of the file and place it within the `/home/stiguser` directory
  - `cp /opt/qradar/bin/iptables_update.pl /home/stiguser`
- After ensuring that a copy of the file is made, next you will edit the `iptables_update.pl` script via vi
  - `vi /opt/qradar/bin/iptables_update.pl`
- Once in edit mode, search for `INPUT`
  - `/INPUT`
- Press the enter key, you will be brought to the exact line which  needs to be modified
- Press the `i` (insert) key, you will know you are in insert mode via the bottom banner saying `--INSERT--`
- Change `INPUT ACCEPT [0:0]` to `INPUT DROP [0:0]`
- Press the ESC key to exit editing mode, this will remove the `--INSERT--` banner
- Save and exit from the `iptables_update.pl`
  - `wq!`
  - Enter
- Run the `iptables_update.pl` script
  - `/opt/qradar/bin/iptables_update.pl`
- Next, the AIDE baseline will be created. Note, this will take some time to finish
  - `aide --init`
- You will know when the baseline is completed when the initialized statement is returned
- To use the AIDE database, the `new` needs to be removed from the aide string, move the `aide.db.new.gz` to `aide.db.gz`
  - `mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz`
- Update aide database
  - `aide --update`
- Create a new baseline after updating it
  - `mv -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz`
- IMPORTANT NOTE: THE AIDE UPDATE AND CREATION OF NEW BASELINE MUST BE COMPLETED EACH AND EVERY TIME A NEW INSTALL, UNINSTALL, SYSTEM CONFIGURATION CHANGE OR A DEPLOY ACTION IS TAKEN
- SSH from the Console to managed hosts. The next step is only to be complated on managed hosts
- Once logged into the managed host, next will be to disable packet forwarding for IPv4
  - `sysctl -w net.ipv4.ip_forward=0`
- Disable packet forwarding for IPv6
  - `sysctl -w net.ipv6.conf.all.forwarding=0`
- Edit the `/etc/sysctl.conf` via vi
  - `vi /eetc/sysctl.conf`
- Scroll to the bottom of the file and type the `i` (insert) key, you will enter insert mode
- Add the following lines to the bottom of the file
  - `net.ipv4.ip_forward = 0`
  - `net.ipv6.conf.all.forwarding = 0`
- Press the ESC key to exit editing, this will remove the `--INSERT--` banner
- Save and exit from editing the file
  - `wq!`
- Modify the syslog-ng.conf file to send all audit logs to the Event Processor or Processors
  - `vi /etc/syslog-ng/syslog-ng.conf`
- Search for local4.info, to ensure you modify the correct section
  - `/local4.info`
- You will be brought to the `local4.info` section
- Modify the section with the following lines
  - `destination remote_audit {udp("10.75.26.121" port (514)); };`
  - `log { source(local); filter(local4_info); destination(remote_audit); };`
- This completes the editing scripts section. Proceed to the following section

## GRUB2 Configuration (BIOS)
### IMPORTANT NOTICE: Ensure that you have the latest QRadar 7.5.0 ISO, if this is a physical deployment ensure you have a live bootable USB created with Fedora Media Writer. If this is a virtual deployment, ensure the ISO is in an accessible datastore. These will be needed if the configuration is not done exactly as listed below. Modifying the GRUB2 configuration has the potential of breaking the ability to log into the system entirely. If this occurs, you must use the "Disaster Recovery After GRUB2 Modification" how to guide.

- Backup and save all relevant GRUB2 configuration files. Tar up and compress the grub2 configurations, prior to modification
  - `tar -cvf /root/grub2backup.tar /etc/grub.d /etc/default/grub /boot/grub2`
- Verify the tar file exists, prior to moving forward
  - `ll /root/grub2backup.tar`
- Create GRUB2 password for `stiguser` login, copy and paste the password to a text file
  - `grub2-mkpasswd-pbkdf2`
- After configuring the GRUB2 password, the next step is to modify the 10_linux file via vi
  - `vi /etc/grub.d/10_linux`
- Search for `--unrestricted`
  - `/unrestricted`
- Type `i` for insert
- Remove the `--unrestricted` and replace with `--users stiguser`. Setting the `--users` to stiguser
- Press the ESC key to exit editing mode
- Save and exit the file
  - `wq!`
- Next the `01_user` file will be modified via the following command
  - `vi /etc/grub.d/01_users`
- The following script will appear
- ```
  #!/bin/sh -e
  cat << EOF
  if [ -f \${prefix}/user.cfg ]; then
    source \${prefix}/user.cfg
    if [ -n "\${GRUB2_PASSWORD}" ]; then
      set superusers="root"
      export superusers
      password_pbkdf2 root \${GRUB2_PASSWORD}
    fi
  fi
  EOF
  ```
- Type `i` to enter editing mode
- Modify the following areas of the script. This will change the superuser from root to stiguser
  - `set superusers="stiguser"`
  - `password_pbkdf2 stiguser \${GRUB2_PASSWORD}`
- Press the ESC key to exit editing mode
- Save and edit the file
  - `wq!`
- Next, manually create the `user.cfg` file within the `/boot/grub2` directory. This can be done via the following commands
  - `vi user.cfg` (if you are already in the `/boot/grub2` directory)
  - `vi /boot/grub2/user.cfg`
- Copy and paste the grub2 password created in step 3 into the user.cfg
- Press the ESC key to exit editing mode
- Save and exit the file
  - `wq!`
- Recreate the grub configuration via the following command
  - `grub2-mkconfig -o /boot/grub2/grub.cfg`
- Copy the `user.cfg` which was created during the password creation to the `/recovery/grub2` partition
  - `cp /boot/grub2/user.cfg /recover/grub2`
- Verify root is set as superuser within `/boot/grub2/grub.cfg`
  - `grep -iw "superusers" /boot/grub2/grub.cfg`
- Modify the /recovery/grub2/user.cfg
  - `vi /recovery/grub2/grub.cfg`
- Search for "Normal System"
  - `/"Normal System"`
- Type `i` to insert and begin editing
- Add `--user stiguser` after `menuentry "Normal System"`
- Add `--user root` after `menuentry "Factory re-install`
- Press ESC key to exit editing mode
- Save and exit the file
  - `wq!`
- Recreate the recover grub2 config
  - `grub2-mkconfig -o /recovery/grub2/grub.cfg`
- Prior to rebooting the server, ensure you have physical access and go to the datacenter. You will not be able to access remotely, due to grub requiring a password now to boot normally. Reboot the server to test that GRUB halts the boot up of the system and requires the root password
  - `reboot`
- The bootup should be halted and will prompt for username and password. The username will be root and the password is the one set earlier
- If the GRUB2 configuration was done properly, after entering the password, the system should boot up normally
- Verify the system is working and allows logins to the webpage by logging into the webpage

## GRUB2 Configuration (UEFI)
### IMPORTANT NOTICE: Ensure that you have the latest QRadar 7.5.0 ISO, if this is a physical deployment ensure you have a live bootable USB created with Fedora Media Writer. If this is a virtual deployment, ensure the ISO is in an accessible datastore. These will be needed if the configuration is not done exactly as listed below. Modifying the GRUB2 configuration has the potential of breaking the ability to log into the system entirely. If this occurs, you must use the "Disaster Recovery after GRUB2 Modification" how to guide.

- Backup and save all relevant GRUB2 configuration files. Tar up and compress the grub2 configurations prior to modification
  - `tar -cvf /root/grub2backup.tar /etc/grub.d /etc/default/grub /boot/efi/EFI/redhat`
- Verify the tar file exists prior to moving forward
  - `ll /root/grub2backup.tar`
- Create the grub password for stiguser, copy the contents of the password to a text file
  - `grub2-mkpasswd-pbkdf2`
- Modify the `/etc/grub.d/10_linux` file
  - `vi /etc/grub.d/10_linux`
- Locate the `CLASS` line
- Press the `i` key to enter edit mode
- Modify the end of the line from `--unrestricted` to `--users stiguser`
- Press the ESC key to exit editing mode
- Save and exit the file
  - `wq!`
- Next, the 01_user file will be modified via the following command
  - `vi /etc/grub.d/01_users`
- The following script will appear
- ```
  #!/bin/sh -e
  cat << EOF
  if [ -f \${prefix}/user.cfg ]; then
    source \${prefix}/user.cfg
    if [ -n "\${GRUB2_PASSWORD}" ]; then
      set superusers="root"
      export superusers
      password_pbkdf2 root \${GRUB2_PASSWORD}
    fi
  fi
  EOF
  ```
- Type `i` to enter editing mode
- Modify the following areas of the script. This will change the superuser from root to stiguser
  - `set superusers="stiguser"`
  - `password_pbkdf2 stiguser \${GRUB2_PASSWORD}`
- Press the ESC key to exit editing mode
- Save and exit the file
  - `wq!`
- Next, manually create the `user.cfg` file within the `/boot/efi/EFI/redhat` directory. This can be done via the following commands
  - `vi user.cfg` (if you are already in the `/boot/efi/EFI/redhat` directory)
  - `vi /boot/efi/EFI/redhat/user.cfg`
- Copy and paste the grub2 password created earlier into the `user.cfg`
- Press the ESC key to exit editing mode
- Save and exit the file
  - `wq!`
- Recreate the grub configuration via the following command
  - `grub2-mkconfig -o /boot/efi/EFI/redhat/grub.cfg`
- Verify that the GRUB2 password is within the user.cfg
  - `grep -iw grub2_password /boot/efi/EFI/redhat/user.cfg`
- Next verify that the "superusers" within the grub.cfg is set to `stiguser` or the user that was created at the beginning of the STIG process
  - `grep -iw "superusers" /boot/efi/EFI/redhat/grub.cfg`
- After verifying the grub password is correct and the grub.cfg is configured for stiguser, reboot the appliance
- Once the system has rebooted you will need to get access to the console. If this is a physical server, go to the datacenter and access the server. If this is a virtual appliance access the VM via the hypervisor and attach to the console
- Once at the console you will enter the username, stiguser, and password
- After entering the username and password, the system will boot up normally

## Modify Password Age for Non-system Accounts
### IMPORTANT NOTE: A lot of individuals get confused as to what is a system account and what is not. The easiest way to figure this out is via looking at the /etc/logins.def. RHEL 7 has the following values, presented below whith define a user and a system account via UID and GID
```
# Min/max values for automatic uid selection in useradd
#
UID_MIN                    1000
UID_MAX                   60000
# System accounts
SYS_UID_MIN                 201
SYS_UID_MAX                 999

#
# Min/max values for automatic gid selection in groupadd
#
GID_MIN                    1000
GID_MAX                   60000
# System accounts
SYS_GID_MIN                 201
SYS_GID_MAX                 999
```
Any account that has a UID value greated than 1000 and a GID value greater than 1000 is a user account and not system. To validate which users, you can view the /etc/passwd file.

- After having done the prep work previously listed, enter the following command to verify user accounts which don't have a minimum password age of 1 day configured
  - `awk -F: '$4 < 1 {print $1 "" $4}' /etc/shadow`
- If any accounts were to be returned not meeting the minimum password age of 1 day, the command below is how you would fix that issue
  - `chage -m 1 stiguser`
- Verify that no user accounts return having a maximum password age of 60 days
  - `awk -F: '$5 > 60 {print $1 "" $5}' /etc/shadow`
- If a user account was returned, then you can use the following command to fix the account
  - `chage -M 60 stiguser`
- Finally, verify that no two users have a duplicate UID
  - `pwck -rq`
- The last step concludes the STIG QRadar guide. The system is now STIG compliant.
