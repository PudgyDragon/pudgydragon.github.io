---
title: "OpenCTI MISP Integration"
project: "OpenCTI"
category: "Threat Intelligence"
description: "Configure the MISP connector for OpenCTI."
source_url: "https://github.com/PudgyDragon/OpenCTI/blob/main/Connectors/MISP_connector.md"
---

## Introduction

This guide documents the configuration used for a MISP connector in an OpenCTI deployment operating behind an HTTP/HTTPS proxy.

Official connector documentation can be found here:

- https://github.com/OpenCTI-Platform/connectors/tree/master/external-import/misp

## Configure the Connector

Before configuring the connector, create a dedicated connector account in the OpenCTI web interface and record its user token.

Edit the Docker Compose configuration:

```bash
vim /opt/OpenCTI/docker/docker-compose.yml
```

Add the following service beneath the existing `services:` section:

```yaml
connector-misp:
  image: opencti/connector-misp:latest
  environment:
    - OPENCTI_URL=https://opencti.example.com
    - OPENCTI_TOKEN=<opencti-connector-token>
    - CONNECTOR_ID=${CONNECTOR_MISP_ID}
    - CONNECTOR_NAME=MISP
    - CONNECTOR_SCOPE=misp
    - CONNECTOR_LOG_LEVEL=info
    - CONNECTOR_DURATION_PERIOD=PT5M
    - MISP_URL=https://misp.example.com
    - MISP_KEY=<misp-api-key>
    - MISP_SSL_VERIFY=false
    - MISP_CREATE_REPORTS=true
    - MISP_CREATE_INDICATORS=true
    - MISP_CREATE_OBSERVABLES=true
    - MISP_CREATE_OBJECT_OBSERVABLES=true
    - MISP_CREATE_TAGS_AS_LABELS=true
    - MISP_REPORT_TYPE=misp-event
    - MISP_IMPORT_FROM_DATE=2026-02-01
    - MISP_IMPORT_DISTRIBUTION_LEVELS=0,1,2,3
    - MISP_IMPORT_THREAT_LEVELS=1,2,3,4
    - HTTP_PROXY=http://proxy.example.com:8080
    - HTTPS_PROXY=http://proxy.example.com:8080
    - NO_PROXY=localhost,127.0.0.0/8,172.0.0.0/8,opencti,rabbitmq,redis,elasticsearch,minio,opencti.example.com,misp.example.com
    - http_proxy=http://proxy.example.com:8080
    - https_proxy=http://proxy.example.com:8080
    - no_proxy=localhost,127.0.0.0/8,172.0.0.0/8,opencti,rabbitmq,redis,elasticsearch,minio,opencti.example.com,misp.example.com
  restart: always
  depends_on:
    opencti:
      condition: service_healthy
```

> **Note:** Update `OPENCTI_URL` with your OpenCTI URL, `MISP_URL` with the URL of the MISP instance you will be importing from, and `OPENCTI_TOKEN` with the token for the connector account you created.

> **Note:** Set `MISP_IMPORT_FROM_DATE` to a recent date appropriate for your environment. Choosing a date too far in the past may significantly increase the initial import time and resource utilization.

## Configure the Connector ID

If you did not create the connector ID during the OpenCTI installation, generate a UUID and add it to the `.env` file.

```bash
vim /opt/OpenCTI/docker/.env
```

Add:

```text
CONNECTOR_MISP_ID=YOUR_GUID
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
- MISP events are being imported successfully.
