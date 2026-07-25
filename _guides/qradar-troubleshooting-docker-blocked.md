---
title: "Resolve Docker Applications Blocked by Trellix or McAfee Agent"
project: "QRadar"
category: "Troubleshooting"
description: "Resolve QRadar application issues caused by unsupported Trellix or McAfee Endpoint Security agents installed on QRadar appliances."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Docker%20Blocked"
---

## Introduction

QRadar applications rely on Docker containers to provide application functionality. If an unsupported endpoint protection product, such as the Trellix (formerly McAfee) Agent, is installed directly on a QRadar appliance, Docker-based applications may fail to start, fail to communicate, or exhibit unexpected behavior.

During troubleshooting, the root cause was traced to a Trellix Agent installed on the QRadar appliance. Removing the unsupported software restored normal application functionality.

> **Symptoms**
>
> - QRadar applications fail to start.
> - Docker-based applications remain unavailable.
> - Applications enter an **ERROR** state.
> - Application containers fail unexpectedly after installing endpoint protection software.

## Cause

IBM does **not** support installing the Trellix (formerly McAfee) Agent directly on QRadar appliances. Because the agent interacts with the operating system and monitors processes, it can interfere with Docker containers and other QRadar services.

> **Important**
>
> Many government and DoDIN environments require Endpoint Detection and Response (EDR) software, such as Trellix or McAfee, on managed endpoints for compliance.
>
> **QRadar appliances are an exception to this requirement.** IBM does not support installing these agents on QRadar appliances because they can interfere with normal platform operation, including Docker-based applications.
>
> If your organization requires justification for an exception, reference IBM's support statement indicating that the software is not supported on QRadar appliances.

IBM's support statement can be found here:

https://kcm.trellix.com/corporate/index?page=content&id=KB90041

## Resolution

If the Trellix Agent is installed on a QRadar appliance, remove it using the vendor's recommended uninstall procedure.

IBM references the following Trellix knowledge base article for removing the agent:

https://kcm.trellix.com/corporate/index?page=content&id=KB75550

If that article is no longer available, the following commands were used successfully during troubleshooting.

Run the vendor uninstall script.

```bash
/opt/McAfee/agent/scripts/uninstall.sh
```

Remove the remaining RPM packages.

```bash
rpm -e MFEdx
```

```bash
rpm -e MFEcma
```

```bash
rpm -e MFErt
```

If your environment uses a different version of the Trellix Agent, refer to the official Trellix documentation for the appropriate removal procedure.

https://docs.trellix.com/bundle/agent_35_dg/page/UUID-08357b37-554b-a915-183c-213203a0dbef.html

## Verification

After removing the agent:

- Verify the Trellix services are no longer running.
- Confirm the Trellix RPM packages have been removed.
- Restart any affected QRadar applications if necessary.
- Verify Docker-based applications start successfully.
- Confirm applications are visible and operational in the QRadar **Apps** dashboard.

## If the Problem Persists

If Docker applications continue to fail after removing the agent:

- Verify all Trellix components have been removed.
- Restart the affected applications.
- Review the application logs for additional errors.
- Confirm no other endpoint protection or host security software has been installed on the appliance.
- Verify the QRadar appliance is operating within IBM's supported configuration.

## Additional Resources

- IBM QRadar App Framework Documentation
- IBM QRadar Support Documentation
- Trellix Knowledge Base: Unsupported Software on QRadar Appliances
- Trellix Agent Removal Documentation
