---
title: "QRadar Data Node Associations"
project: "QRadar"
category: "Engineering Guide"
description: "Associate data nodes with a QRadar Console or Event Processor."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/Data%20Node%20Links"
---

## Introduction

After deploying a QRadar Data Node, it must be associated with a managed host before it can begin extending storage capacity. Data nodes can be attached to either the QRadar Console or an Event Processor, depending on your deployment architecture and storage requirements.

This guide walks through associating data nodes with managed hosts and provides an example configuration for a deployment consisting of one Console, one Event Processor, and two Data Nodes.

## Associating Data Nodes

Navigate to:

- **Admin**
- **System and License Management**
- **Display Systems**

Select the Data Node you want to associate, then choose:

- **Deployment Actions**
- **Edit Host Connection**

Choose the managed host that the Data Node will extend.

- Select **Console** to associate the Data Node with the QRadar Console.
- Select **Event Processor** to associate the Data Node with an Event Processor.

## Example Deployment

The exact associations in your environment will depend on the number of managed hosts and Data Nodes in your deployment.

The following example consists of:

- 1 QRadar Console
- 1 Event Processor
- 2 Data Nodes

| Managed Host | Associated Data Node |
|--------------|----------------------|
| Console | Data Node 1 |
| Event Processor | Data Node 2 |

In this example:

- Data Node 1 extends storage for the QRadar Console.
- Data Node 2 extends storage for the Event Processor.
- Flow sources remain connected to the Console.
- Log sources remain connected to the Event Processor.
