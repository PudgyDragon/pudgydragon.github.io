---
title: "Smartcardauth"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/SmartCardAuth.md"
---

<h1>Smart Card Authentication on Security Analytics</h1>
<p>This is a short guide for setting up smart card authentication on Security Analytics. I didn't have much luck finding a good guide online.</p>

<h2>CLI Configurations</h2>
<p>There are a few files you will need to either add or change.</p>
<p>Start by editing the httpd configuration file on the device</p>
<pre><code>
  vim /etc/sysconfig/httpd
      SSLCA="SSLCACertificateFile /etc/pki/tls/certs/client-ca-bundle.crt"
      SSL_OCSP_ENABLE="SSLOCSPEnable off"
  
</code></pre>
<p>Next, edit the ldap configuration file</p>
<pre><code>
  vim /etc/ldap.conf
      tls_cacertfile /etc/pki/tls/certs/client-ca-bundle.crt
  
</code></pre>
<p>I don't believe the client-ca-bundle file exists initially, so you will create and copy/paste the contents of your root and intermediate certificates into it. I believe 
intermediate should be first, and root last. Feel free to correct me if I'm wrong</p>
<pre><code>
  vim /etc/pki/tls/certs/client-ca-bundle.crt
      # Add your CA and root certificates
  
</code></pre>
<p>Make sure the root and intermediate certificates for your smart card are in the anchors, and update the ca trust if you had to modify it</p>
<pre><code>
  vim /etc/pki/ca-trust/source/anchors/certbundle.cer
      # Add any missing certificates
  update-ca-trust
  
</code></pre>
<p>Lastly, make sure the ca-bundle has all root and intermediate certs required for your smart card</p>
<pre><code>
  vim /etc/pki/tls/certs/ca-bundle.trust.crt
      # Verify no missing ca certs
  
</code></pre>
<p>Afterwards, move on to the GUI portion.</p>

<h2>GUI Configurations</h2>
<p>These are general settings that should be configured for it to work. Different environments may have different settings.</p>
<p>Navigate to Settings > Authentication and Enable LDAP Authentication. Use the following template as a base for your settings</p>
<pre><code>
  Server Connection
      Server: your.ldap.server
      Port: 636  
  Encryption
      Encryption Type: SSL/TLS
      Verify Server Certificate: Enabled
  Authenticated Bind
      BIND DN: Username for accessing LDAP
      BIND Password: Password for above username
  Searches
      Search Base: DC=your,DC=company,DC=domain
      Scope: sub
      Group DN: CN=where,OU=your,OU=users,OU=are,DC=and,DC=your,DC=domain
      Group Name Attribute: cn
  Smart Cards and Certificates
      Use Certificate / Card for Authentication: Enabled
  Schema Configuration
      LDAP Schema: User Defined
      User Object Class: User
      Login Name Attribute: userPrincipalName
      Password Change Method: Active Directory (ADSI)
      User ID Number Attribute: userAcountControl
      Home Directory Attribute: unixHomeDirectory
      Shadow Object Class: User
      Group Object Class: Group
      Group ID Number Attribute: primaryGroupID
      Group Membership Attribute: member
  
</code></pre>

<h2>Done</h2>
<p>With that, you should be all set. You may need to reboot your server once everything is configured. Special shout out to my friend who had experience with this in the past.</p>
