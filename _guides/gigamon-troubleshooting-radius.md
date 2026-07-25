---
title: "Gigamon RADIUS Troubleshooting"
project: "Gigamon"
category: "Troubleshooting"
description: "Troubleshoot RADIUS authentication issues in Gigamon."
source_url: "https://github.com/PudgyDragon/Gigamon/blob/main/Troubleshooting/RADIUS.md"
---

## Introduction

When RADIUS authentication is enabled on Gigamon appliances, an incorrect authentication priority can cause communication issues between Fabric Manager and managed nodes. This can prevent Fabric Manager from managing node settings and may also affect local CLI authentication.

This guide documents a common resolution when the authentication order has been configured incorrectly.

## Symptoms

One or more of the following symptoms may be observed:

- Fabric Manager is unable to manage connected nodes.
- Configuration changes from Fabric Manager fail to apply.
- Local CLI accounts cannot authenticate.
- Only RADIUS accounts are able to log in to the CLI.
- Authentication-related errors occur after enabling RADIUS.

## Cause

The authentication priority is configured with **RADIUS** before **Local**.

For proper operation, the authentication order should be:

1. Local
2. RADIUS

## Resolution

Connect to the affected node using the CLI.

Enter privileged configuration mode.

```bash
enable

configure terminal
```

Configure the authentication order.

```bash
aaa authentication login default local radius
```

After the command has been applied, reconnect to Fabric Manager.

Navigate to the node authentication settings and verify the authentication priority is configured as:

1. **Local**
2. **RADIUS**

Apply the updated configuration.

## Verification

After updating the authentication order:

- Verify local CLI authentication succeeds.
- Verify RADIUS authentication continues to function.
- Confirm Fabric Manager can successfully communicate with and manage the node.
- Verify configuration changes can once again be pushed from Fabric Manager.
