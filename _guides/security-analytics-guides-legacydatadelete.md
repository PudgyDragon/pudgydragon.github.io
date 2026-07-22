---
title: "Legacydatadelete"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/legacydatadelete.md"
---

<h1>Deleting Legacy Meta Data</h1>
<p>With the latest updates, you are unable to keep your legacy meta data in Security Analytics. If you want to update to 8.4.1, you have to either wait for it to age out or remove it yourself. The guide for removing it can be found here:</p>
<a href="https://knowledge.broadcom.com/external/article?articleNumber=444332">How to delete legacy meta data in preparation for upgrading to Security Analytics 8.4.1</a>
<p>For those who don't want the extra click and reading, I'll write the quick and dirty.</p>

<h2>Process</h2>
<p>Login to your Security Analytics device as <code>root</code> and run the following commands:</p>
<pre><code>
  service monit stop
  service solera-gaugefs stop
  nohup rm -rf /pfs2/flows &
  
</code></pre>
<p>Based on the amount of data you have, this could take between a few hours to a few days. You'll have to keep tabs on the <code>/pfs2/flows</code> directory to make sure it no longer exists. Once you verify that it's been blown away, 
log back in to <code>root</code> and run:</p>
<pre><code>
  service monit start
  
</code></pre>

<h2>Great Success</h2>
<p>Move on to the 8.4.1 upgrade.</p>
