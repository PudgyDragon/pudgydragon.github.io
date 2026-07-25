---
title: "Resolve Ariel IO Errors During Searches"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve QRadar Ariel search IO errors caused by failed SSH tunnels between the Console and managed Event Processors or Data Nodes."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/IO_Error.md"
---

## Introduction

When performing Ariel searches, QRadar may report an I/O error referencing **localhost:32006**. This port is used by the SSH tunnel that connects the QRadar Console to the Ariel service running on managed Event Processors and Data Nodes.

If the tunnel has stopped or become unhealthy, search requests may fail even though the managed host itself is online.

> **Symptoms**
>
> - Ariel searches fail with an I/O error.
> - Errors reference `localhost:32006`.
> - Searches against specific Event Processors or Data Nodes fail.
> - Managed hosts appear healthy, but searches cannot retrieve results.

## Cause

QRadar uses managed SSH tunnels to communicate with remote Ariel services. If one of these tunnels stops or becomes unresponsive, the Console is unable to retrieve search results from the affected managed host.

Restarting the affected tunnel typically restores communication.

## Resolution

### Identify the Ariel Tunnel

Log in to the QRadar Console as the `root` user.

Locate the Ariel tunnel services.

```bash
grep -iE "ariel" /etc/tunnel_manager/tunnels/* | grep ariel
```

Example output:

```text
/etc/tunnel_manager/tunnels/managed-tunnel@xxxxx:Component="ariel_proxy--ariel--Tunnel"
```

The number of tunnel services returned depends on the number of Event Processors and Data Nodes in your deployment.

### Restart the Tunnel

If you know which managed host is experiencing the issue, restart only the corresponding tunnel.

```bash
systemctl restart managed-tunnel@xxxxx
```

If the affected appliance is unknown, restart each Ariel tunnel individually until communication is restored.

> **Field Note**
>
> Restarting the affected tunnel restores communication with the managed host without requiring a restart of the entire QRadar appliance.

## Verification

After restarting the tunnel:

- Retry the Ariel search.
- Verify the I/O error no longer occurs.
- Confirm search results are returned successfully.
- If applicable, verify searches against other managed hosts continue to function normally.

## If the Problem Persists

If searches continue to fail after restarting the tunnel:

- Verify the affected managed host is online.
- Confirm network connectivity between the Console and the managed host.
- Verify the Ariel services are running on the affected appliance.
- Review QRadar system logs for additional tunnel or Ariel-related errors.
- Restart the managed host if the tunnel immediately fails again.

## Additional Resources

- IBM QRadar Ariel Search Documentation
- IBM QRadar Managed Host Troubleshooting
