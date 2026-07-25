---
title: "OpenCTI CISA KEV Integration"
project: "OpenCTI"
category: "Threat Intelligence"
description: "Configure the CISA Known Exploited Vulnerabilities (KEV) connector for OpenCTI."
source_url: "https://github.com/PudgyDragon/OpenCTI/blob/main/Connectors/CISA_KEV_connector.md"
---

## Introduction

This guide documents the configuration used for a CISA Known Exploited Vulnerabilities connector in an OpenCTI deployment operating behind an HTTP/HTTPS proxy.

Official connector documentation can be found here:

- https://github.com/OpenCTI-Platform/connectors/tree/master/external-import/cisa-known-exploited-vulnerabilities

## Configure the Connector

Before configuring the connector, create a dedicated connector account in the OpenCTI web interface and record its user token.

Edit the Docker Compose configuration:

```bash
vim /opt/OpenCTI/docker/docker-compose.yml
```

Add the following service beneath the existing `services:` section:

```yaml
connector-cisa-known-exploited-vulnerabilities:
  image: opencti/connector-cisa-known-exploited-vulnerabilities:your-version
  environment:
    - OPENCTI_URL=https://opencti-fqdn
    - OPENCTI_TOKEN=CISA_User_Token
    - CONNECTOR_ID=${CONNECTOR_KEV_ID}
    - CONNECTOR_NAME=CISA KEV
    - CONNECTOR_SCOPE=cisa
    - CONNECTOR_LOG_LEVEL=info
    - CONNECTOR_DURATION_PERIOD=P1D

    - CISA_CATALOG_URL=https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
    - CISA_CREATE_INFRASTRUCTURES=true
    - CISA_TLP=TLP:CLEAR

    - HTTP_PROXY=http://proxy:port
    - HTTPS_PROXY=http://proxy:port
    - NO_PROXY=localhost,127.0.0.0/8,172.0.0.0/8,opencti,rabbitmq,redis,elasticsearch,minio,your-fqdn,your-ipv4

    - http_proxy=http://proxy:port
    - https_proxy=http://proxy:port
    - no_proxy=localhost,127.0.0.0/8,172.0.0.0/8,opencti,rabbitmq,redis,elasticsearch,minio,your-fqdn,your-ipv4

  restart: always
```

> **Note:** Update `OPENCTI_URL` with your OpenCTI URL and `OPENCTI_TOKEN` with the token for the connector account you created.

> **Important:** This connector may require the image version to match the version of OpenCTI currently deployed. Replace `your-version` with the OpenCTI version used by your environment.

For example:

```yaml
image: opencti/connector-cisa-known-exploited-vulnerabilities:6.7.10
```

## Configure the Connector ID

If you did not create the connector ID during the OpenCTI installation, generate a UUID and add it to the `.env` file.

```bash
vim /opt/OpenCTI/docker/.env
```

Add:

```text
CONNECTOR_KEV_ID=YOUR_GUID
```

## Deploy the Connector

After saving the configuration, restart the Docker Compose stack:

```bash
docker compose down

docker compose up -d
```

## Verification

Log in to the OpenCTI web interface and verify that:

- The CISA KEV connector appears under **Data > Ingestion > Connectors**.
- The connector reports a healthy status.
- CISA KEV data is being imported successfully.
- Known exploited vulnerabilities appear in OpenCTI.
