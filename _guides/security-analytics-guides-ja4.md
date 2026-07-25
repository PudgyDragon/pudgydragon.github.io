---
title: "Enable JA4 Fingerprinting"
project: "Security Analytics"
category: "Engineering Guide"
description: "Enable JA4 fingerprint metadata in Broadcom Security Analytics 8.4.1."
source_url: "https://knowledge.broadcom.com/external/article/443998"
---

## Introduction

Beginning with Security Analytics 8.4.1, JA4 fingerprinting is supported but must be manually enabled. This guide follows Broadcom's official documentation to add the JA4 metadata attribute to Security Analytics.

> [!NOTE]
> Official Broadcom documentation can be found here:
>
> https://knowledge.broadcom.com/external/article/443998

## Create the JA4 Patch File

Change to the `/home` directory.

```bash
cd /home
```

Create the patch file.

```bash
touch ja4_attributes_patch.json
```

Edit the file.

```bash
vim ja4_attributes_patch.json
```

Add the following contents.

```json
{
  "delete_columns": [
    "ja4_fingerprint"
  ],
  "add_columns": [
    {
      "name": "ja4_fingerprint",
      "attributes": [
        "ssl:fingerprint_ja4"
      ],
      "uiGroup": "encryptionGroup",
      "optional": true
    }
  ],
  "delete_enabled": [],
  "add_enabled": []
}
```

Save and exit Vim.

```text
:wq
```

## Back Up the Existing Configuration

Before applying the patch, create a backup of the existing attributes configuration.

```bash
cp -p /etc/solera/meta/attributes.json /home/attributes_$(date +%Y-%m-%d__%H_%M_%S).json
```

## Apply the Patch

Generate the updated attributes file.

```bash
/usr/local/bin/apply_attributes_patch /home/ja4_attributes_patch.json -o /home/attributes_with_ja4.json
```

Format the generated JSON.

```bash
cat /home/attributes_with_ja4.json | /usr/bin/json_reformat > /home/attributes_with_ja4_formatted.json
```

Replace the existing attributes configuration.

```bash
cp /home/attributes_with_ja4_formatted.json /etc/solera/meta/attributes.json
```

## Clear the GUI Cache

Clear the Redis cache to load the updated metadata configuration.

```bash
scm db clear_redis
```

## Verification

After the cache has been cleared, log into the Security Analytics web interface and verify that the **JA4 Fingerprint** metadata field is available under the **Encryption** metadata group.
