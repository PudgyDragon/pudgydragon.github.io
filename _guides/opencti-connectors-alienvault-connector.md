---
title: "AlienVault Integration"
project: "OpenCTI"
category: "Threat Intelligence"
description: "Configure the AlienVault connector for OpenCTI."
source_url: "https://github.com/PudgyDragon/OpenCTI/blob/main/Connectors/AlienVault_connector.md"
---

## Introduction

The AlienVault connector imports threat intelligence from AlienVault Open Threat Exchange (OTX) into OpenCTI. The connector can create reports, indicators, observables, relationships, and attack-pattern associations from subscribed OTX pulses.

This guide documents an AlienVault connector configuration for an OpenCTI deployment operating behind an HTTP/HTTPS proxy.

## Prerequisites

Before configuring the connector, ensure the following are available:

- A functioning OpenCTI deployment managed with Docker Compose
- An AlienVault OTX API key
- An OpenCTI connector service account
- The API token associated with the connector account
- A UUID for the connector
- Proxy connection details, if required by the environment

Official connector documentation:

- [OpenCTI AlienVault Connector](https://github.com/OpenCTI-Platform/connectors/tree/master/external-import/alienvault)

## Create the Connector Account

In the OpenCTI web interface, create a dedicated user for the AlienVault connector.

Configure the account as a connector or service account, then record its API token. This token will be assigned to `OPENCTI_TOKEN` in the Docker Compose configuration.

> **Important:** Treat the connector token as a secret. Do not commit production tokens to a public repository.

## Configure the Connector ID

Generate a UUID for the AlienVault connector and add it to the OpenCTI `.env` file.

Edit:

```bash
vim /opt/OpenCTI/docker/.env
```

Add:

```bash
CONNECTOR_ALIENVAULT_ID=<connector-uuid>
```

Example:

```bash
CONNECTOR_ALIENVAULT_ID=12345678-1234-1234-1234-123456789abc
```

Each connector should use a unique UUID.

## Configure the AlienVault Connector

Edit the OpenCTI Docker Compose file.

```bash
vim /opt/OpenCTI/docker/docker-compose.yml
```

Add the following service beneath the existing `services:` section:

```yaml
connector-alienvault:
  image: opencti/connector-alienvault:latest
  environment:
    - OPENCTI_URL=https://opencti.example.com
    - OPENCTI_TOKEN=${ALIENVAULT_OPENCTI_TOKEN}
    - CONNECTOR_ID=${CONNECTOR_ALIENVAULT_ID}
    - CONNECTOR_NAME=AlienVault
    - CONNECTOR_SCOPE=alienvault
    - CONNECTOR_LOG_LEVEL=error
    - CONNECTOR_DURATION_PERIOD=PT30M

    - ALIENVAULT_BASE_URL=https://otx.alienvault.com
    - ALIENVAULT_API_KEY=${ALIENVAULT_API_KEY}
    - ALIENVAULT_TLP=White
    - ALIENVAULT_CREATE_OBSERVABLES=true
    - ALIENVAULT_CREATE_INDICATORS=true
    - ALIENVAULT_PULSE_START_TIMESTAMP=2026-02-01T00:00:00
    - ALIENVAULT_REPORT_TYPE=threat-report
    - ALIENVAULT_REPORT_STATUS=New
    - ALIENVAULT_GUESS_MALWARE=false
    - ALIENVAULT_GUESS_CVE=false
    - ALIENVAULT_EXCLUDED_PULSE_INDICATOR_TYPES=FileHash-MD5,FileHash-SHA1
    - ALIENVAULT_ENABLE_RELATIONSHIPS=true
    - ALIENVAULT_ENABLE_ATTACK_PATTERNS_INDICATES=true
    - ALIENVAULT_DEFAULT_X_OPENCTI_SCORE=50

    - HTTP_PROXY=http://proxy.example.com:8080
    - HTTPS_PROXY=http://proxy.example.com:8080
    - NO_PROXY=localhost,127.0.0.0/8,172.0.0.0/8,opencti,rabbitmq,redis,elasticsearch,minio,opencti.example.com

    - http_proxy=http://proxy.example.com:8080
    - https_proxy=http://proxy.example.com:8080
    - no_proxy=localhost,127.0.0.0/8,172.0.0.0/8,opencti,rabbitmq,redis,elasticsearch,minio,opencti.example.com

  restart: always

  depends_on:
    - opencti
```

Update the following values for the environment:

- `OPENCTI_URL`
- `ALIENVAULT_OPENCTI_TOKEN`
- `ALIENVAULT_API_KEY`
- `ALIENVAULT_PULSE_START_TIMESTAMP`
- Proxy hostname and port
- OpenCTI hostname and internal addresses in `NO_PROXY`

> **Note:** Both uppercase and lowercase proxy variables are included because application components and supporting libraries may reference different forms.

## Store Connector Secrets

Add the OpenCTI connector token and AlienVault API key to the `.env` file rather than placing them directly in `docker-compose.yml`.

Edit:

```bash
vim /opt/OpenCTI/docker/.env
```

Add:

```bash
ALIENVAULT_OPENCTI_TOKEN=<opencti-connector-token>
ALIENVAULT_API_KEY=<alienvault-otx-api-key>
```

Restrict access to the file as appropriate for the environment.

```bash
chmod 600 /opt/OpenCTI/docker/.env
```

## Configure the Pulse Start Timestamp

The `ALIENVAULT_PULSE_START_TIMESTAMP` value determines how far back the connector begins importing OTX pulse data.

Example:

```yaml
- ALIENVAULT_PULSE_START_TIMESTAMP=2026-02-01T00:00:00
```

Use an ISO 8601 timestamp appropriate for the deployment.

> **Advisory:** Selecting a timestamp too far in the past may cause a large initial ingestion workload and increase processing time, storage consumption, and duplicate review effort.

## Deploy the Connector

Validate the Docker Compose configuration.

```bash
cd /opt/OpenCTI/docker

docker compose config
```

If validation completes successfully, recreate the stack.

```bash
docker compose down

docker compose up -d
```

Alternatively, start only the AlienVault connector without stopping the complete stack:

```bash
docker compose up -d connector-alienvault
```

## Verification

Confirm the connector container is running.

```bash
docker compose ps connector-alienvault
```

Review the connector logs.

```bash
docker compose logs --follow connector-alienvault
```

In the OpenCTI web interface:

- Verify the AlienVault connector appears as active.
- Confirm the connector reports a recent heartbeat.
- Verify OTX data is being imported.
- Review newly created reports, indicators, and observables.
- Confirm no proxy or authentication errors appear in the connector logs.

## Troubleshooting

If the connector cannot reach AlienVault OTX:

- Verify the proxy hostname and port.
- Confirm the proxy permits access to `otx.alienvault.com`.
- Verify both uppercase and lowercase proxy variables are present.
- Confirm internal OpenCTI services are included in `NO_PROXY`.

If the connector is not visible in OpenCTI:

- Verify `CONNECTOR_ALIENVAULT_ID` contains a valid UUID.
- Confirm the OpenCTI connector token is correct.
- Verify the connector account remains enabled.
- Review the container logs for authentication or registration errors.

If data ingestion is unexpectedly large:

- Review `ALIENVAULT_PULSE_START_TIMESTAMP`.
- Select a more recent timestamp if historical ingestion is not required.
- Review enabled observable and indicator creation settings.

## Additional Resources

- [OpenCTI AlienVault Connector](https://github.com/OpenCTI-Platform/connectors/tree/master/external-import/alienvault)
