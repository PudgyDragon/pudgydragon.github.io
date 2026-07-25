---
title: "OpenCTI CISA KEV Integration"
project: "OpenCTI"
category: "Threat Intelligence"
description: "Configure the CISA Known Exploited Vulnerabilities (KEV) connector for OpenCTI."
source_url: "https://github.com/PudgyDragon/OpenCTI/blob/main/Connectors/CISA_KEV_connector.md"
---

## Introduction

The CISA Known Exploited Vulnerabilities connector imports vulnerability data from the CISA KEV Catalog into OpenCTI.

This guide documents a connector configuration for an OpenCTI deployment operating behind an HTTP/HTTPS proxy.

## Prerequisites

Before configuring the connector, ensure the following are available:

- A functioning OpenCTI deployment managed with Docker Compose
- A dedicated OpenCTI connector account
- The API token associated with the connector account
- A unique UUID for the connector
- The OpenCTI platform version currently deployed
- Proxy connection details, if required by the environment

> **Important:** The connector image version should match the deployed OpenCTI platform version. Using an incompatible connector version may prevent the connector from starting or registering successfully.

## Create the Connector Account

In the OpenCTI web interface, create a dedicated account for the CISA KEV connector.

Configure the account as a connector or service account, then record its API token. This token will be assigned to `OPENCTI_TOKEN` in the Docker Compose configuration.

> **Important:** Treat the connector token as a secret. Do not commit production tokens to a public repository.

## Configure the Connector ID

Generate a unique UUID for the connector and add it to the OpenCTI `.env` file.

Edit the file:

```bash
vim /opt/OpenCTI/docker/.env
```

Add:

```bash
CONNECTOR_KEV_ID=<connector-uuid>
```

Example:

```bash
CONNECTOR_KEV_ID=12345678-1234-1234-1234-123456789abc
```

Each OpenCTI connector should use a unique UUID.

## Configure the CISA KEV Connector

Edit the OpenCTI Docker Compose file:

```bash
vim /opt/OpenCTI/docker/docker-compose.yml
```

Add the following service beneath the existing `services:` section:

```yaml
connector-cisa-known-exploited-vulnerabilities:
  image: opencti/connector-cisa-known-exploited-vulnerabilities:<opencti-version>
  environment:
    - OPENCTI_URL=https://opencti.example.com
    - OPENCTI_TOKEN=${CISA_KEV_OPENCTI_TOKEN}
    - CONNECTOR_ID=${CONNECTOR_KEV_ID}
    - CONNECTOR_NAME=CISA KEV
    - CONNECTOR_SCOPE=cisa
    - CONNECTOR_LOG_LEVEL=info
    - CONNECTOR_DURATION_PERIOD=P1D

    - CISA_CATALOG_URL=https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
    - CISA_CREATE_INFRASTRUCTURES=true
    - CISA_TLP=TLP:CLEAR

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

- `<opencti-version>`
- `OPENCTI_URL`
- `CISA_KEV_OPENCTI_TOKEN`
- Proxy hostname and port
- OpenCTI hostname and internal addresses in `NO_PROXY`

For example, if the OpenCTI platform is running version `6.7.10`, use:

```yaml
image: opencti/connector-cisa-known-exploited-vulnerabilities:6.7.10
```

> **Note:** Both uppercase and lowercase proxy variables are included because different applications and supporting libraries may reference different forms.

## Store the Connector Token

Add the connector account token to the OpenCTI `.env` file rather than storing it directly in `docker-compose.yml`.

Edit:

```bash
vim /opt/OpenCTI/docker/.env
```

Add:

```bash
CISA_KEV_OPENCTI_TOKEN=<opencti-connector-token>
```

Restrict access to the file as appropriate for the environment:

```bash
chmod 600 /opt/OpenCTI/docker/.env
```

## Validate the Configuration

Navigate to the OpenCTI Docker directory:

```bash
cd /opt/OpenCTI/docker
```

Validate the Docker Compose configuration:

```bash
docker compose config
```

Resolve any YAML syntax errors or missing environment variables before starting the connector.

## Deploy the Connector

Start the CISA KEV connector:

```bash
docker compose up -d connector-cisa-known-exploited-vulnerabilities
```

If a complete stack restart is required:

```bash
docker compose down

docker compose up -d
```

Starting only the connector is generally less disruptive than restarting the entire OpenCTI deployment.

## Verification

Confirm the connector container is running:

```bash
docker compose ps connector-cisa-known-exploited-vulnerabilities
```

Review the connector logs:

```bash
docker compose logs --follow connector-cisa-known-exploited-vulnerabilities
```

In the OpenCTI web interface:

- Verify the CISA KEV connector appears as active.
- Confirm the connector reports a recent heartbeat.
- Verify KEV data is being imported.
- Review newly created vulnerabilities and related entities.
- Confirm no proxy, authentication, or version compatibility errors appear in the logs.

## Troubleshooting

If the connector does not start:

- Confirm the connector image version matches the OpenCTI platform version.
- Run `docker compose config` to identify YAML or environment-variable errors.
- Review the connector logs for dependency or compatibility errors.

If the connector cannot register with OpenCTI:

- Verify `CONNECTOR_KEV_ID` contains a valid UUID.
- Confirm the connector account token is correct.
- Verify the connector account remains enabled.
- Confirm `OPENCTI_URL` is reachable from the connector container.

If the connector cannot retrieve the CISA catalog:

- Verify the proxy hostname and port.
- Confirm the proxy permits access to the CISA catalog URL.
- Verify both uppercase and lowercase proxy variables are configured.
- Confirm internal services are included in `NO_PROXY`.

## Additional Resources

- [OpenCTI CISA Known Exploited Vulnerabilities Connector](https://github.com/OpenCTI-Platform/connectors/tree/master/external-import/cisa-known-exploited-vulnerabilities)
- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
