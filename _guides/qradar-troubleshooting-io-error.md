---
title: "Io Error"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/IO_Error.md"
---

# Troubleshooting an IO Error while searching
When performing searches, sometimes an IO Error on localhost:32006, the SSH tunnel for the Ariel service of the Event Processor, would occur.
A pretty simple fix for this is to restart the SSH tunnel for the Ariel service on the console. To find the SSH tunnels, use the following command:
```
grep -iE "ariel" /etc/tunnel_manager/tunnels/* | grep ariel
```
This will bring back a result that looks something like this
```
/etc/tunnel_manager/tunnels/managed-tunnel@xxxxx:Componenet = "ariel_proxy--ariel--Tunnel"
```
How many results will depend on the number of Event Processers and Data Nodes you have. If you know which device is having the issue, you can restart it
or you can restart them all one by one using the following
```
systemctl restart managed-tunnel@xxxxx
```
