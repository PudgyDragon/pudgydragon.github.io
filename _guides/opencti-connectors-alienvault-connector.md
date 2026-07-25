---
title: "AlienVault Integration"
project: "OpenCTI"
category: "Threat Intelligence"
description: "Configure the AlienVault connector for OpenCTI."
source_url: "https://github.com/PudgyDragon/OpenCTI/blob/main/Connectors/AlienVault_connector.md"
---

## Introduction

This guide documents the configuration used for an AlienVault OTX connector in an OpenCTI deployment operating behind an HTTP/HTTPS proxy.

Official connector documentation can be found here:

- https://github.com/OpenCTI-Platform/connectors/tree/master/external-import/alienvault

## Configure the Connector

Before configuring the connector, create a dedicated connector account in the OpenCTI web interface and record its user token.

Edit the Docker Compose configuration:

```bash
vim /opt/OpenCTI/docker/docker-compose.yml
```

Add the following service beneath the existing `services:` section.

```yaml
connector-alienvault:
  image: opencti/connector-alienvault:latest
  environment:
    - OPENCTI_URL=https://opencti.example.com
    - OPENCTI_TOKEN=<opencti-connector-token>
    - CONNECTOR_ID=${CONNECTOR_ALIENVAULT_ID}
    - CONNECTOR_NAME=AlienVault
    - CONNECTOR_SCOPE=alienvault
    - CONNECTOR_LOG_LEVEL=error
    - CONNECTOR_DURATION_PERIOD=PT30M
    - ALIENVAULT_BASE_URL=https://otx.alienvault.com
    - ALIENVAULT_API_KEY=<alienvault-api-key>
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

> **Note:** Update `OPENCTI_URL` with your OpenCTI URL and `OPENCTI_TOKEN` with the token for the connector account you created. Set `ALIENVAULT_PULSE_START_TIMESTAMP` to a recent date appropriate for your environment. Choosing a date too far in the past may significantly increase the initial import time.

## Configure the Connector ID

If you did not create the connector ID during your OpenCTI installation, generate a UUID and add it to your `.env` file.

```bash
vim /opt/OpenCTI/docker/.env
```

Add:

```text
CONNECTOR_ALIENVAULT_ID=YOUR_GUID
```

## Deploy the Connector

After saving the configuration, restart the Docker Compose stack.

```bash
docker compose down

docker compose up -d
```

## Verification

Log in to the OpenCTI web interface and verify that:

- The connector reports a healthy status.
- AlienVault data is being imported successfully.
