---
title: "Deploy Snipe-IT Behind Nginx with Docker"
project: "Snipe-IT"
category: "Engineering Guide"
description: "Deploy Snipe-IT behind an Nginx reverse proxy using Docker, including proxy configuration, SSL, FIPS compatibility, and MariaDB."
---

## Host-Level Proxy and Certificate Authority Configuration

Before installing Docker or pulling any container images, configure the
host operating system to communicate through your organization's
outbound proxy. Proper host-level proxy configuration ensures that
system utilities, package managers, and Docker can securely access
external repositories in environments that require internet traffic to
traverse an enterprise proxy.

> [!NOTE]
> If your environment does not require an outbound proxy, you can skip this section.

### Configure Host Operating System Proxy Settings

Configure system-wide proxy environment variables by appending the
following configuration to `/etc/environment`. These settings are used
by common utilities such as `curl`, `wget`, and package managers.

``` bash
# Append proxy settings to /etc/environment
sudo tee -a /etc/environment << 'EOF'
# System-wide proxy settings
http_proxy="http://your-proxy.com:8080"
https_proxy="http://your-proxy.com:8080"
no_proxy="localhost,127.0.0.1,172.16.0.0/12,your-server-ip,your-server.com"
HTTP_PROXY="http://your-proxy.com:8080"
HTTPS_PROXY="http://your-proxy.com:8080"
NO_PROXY="localhost,127.0.0.1,172.16.0.0/12,your-server-ip,your-server.com"
EOF

# Apply the changes to the current shell session
source /etc/environment
```

> [!TIP]
> Include all internal hosts, container networks, and proxy
> servers in the `no_proxy` and `NO_PROXY` variables to prevent
> unnecessary routing through the enterprise proxy.

### Configure the Docker Daemon Proxy

Unlike interactive shell sessions, the Docker daemon does not read
`/etc/environment`. Configure a systemd drop-in file so Docker can
access external container registries through the enterprise proxy.

``` bash
# Create the Docker systemd drop-in directory
sudo mkdir -p /etc/systemd/system/docker.service.d

# Configure proxy settings for the Docker daemon
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf << 'EOF'
[Service]
Environment="HTTP_PROXY=http://your-proxy.com:8080"
Environment="HTTPS_PROXY=http://your-proxy.com:8080"
Environment="NO_PROXY=localhost,127.0.0.1,172.16.0.0/12,your-server-ip,your-server.com"
EOF

# Reload systemd and restart Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

> [!WARNING]
> Docker will be unable to pull container images until the
> daemon is restarted after creating or modifying the proxy
> configuration.

### Trust the Enterprise Certificate Authority

Many enterprise and DoD environments perform SSL inspection using an
internal certificate authority (CA). If the operating system does not
trust this CA, outbound HTTPS connections---including Docker image
pulls---may fail with SSL handshake or certificate validation errors.

For Red Hat Enterprise Linux (RHEL) systems, install the proxy's CA
certificate into the system trust store.

``` bash
# Install the proxy CA certificate
sudo cp your-proxy-ca.pem /etc/pki/ca-trust/source/anchors/

# Update the system trust store
sudo update-ca-trust

# Restart Docker to load the updated certificates
sudo systemctl restart docker
```

### Create the FIPS Compatibility File

Some FIPS-enabled environments require a compatibility workaround for
containerized OpenSSL libraries. Create a small file containing `0`,
which will later be mounted into the Snipe-IT container during
deployment.

> [!WARNING]
> This workaround is intended only for environments where
> the application is known to require it. Validate your organization's
> security requirements before implementing this configuration.

``` bash
# Create the application directory
sudo mkdir -p /opt/snipe-it

# Create the FIPS compatibility file
echo 0 | sudo tee /opt/snipe-it/fips_disable
```

## Deploy the Global Nginx Reverse Proxy

To simplify certificate management and provide a single secure entry point into the environment, deploy Nginx as a standalone reverse proxy. Separating the reverse proxy from the application stack makes it easier to host additional applications in the future while maintaining centralized SSL configuration and security policies.

The Nginx container is responsible for:

- Terminating HTTPS connections
- Redirecting HTTP traffic to HTTPS
- Forwarding requests to the appropriate backend container
- Applying common security headers
- Trusting client IP addresses forwarded by your enterprise proxy

> [!NOTE]
> This guide assumes an external Docker network named `proxy-net` already exists and is shared by the reverse proxy and application stacks.

## Directory Structure

Create the following directory structure before deploying Nginx.

```text
/opt/nginx/
├── certs/
│   ├── ca-bundle.pem      # Root and intermediate certificate bundle
│   ├── server.crt         # Server certificate
│   └── server.key         # Decrypted private key
├── docker-compose.yml
└── nginx.conf
```

> [!TIP]
> Store certificates outside of the container and mount them as read-only volumes. This simplifies certificate replacement and avoids rebuilding the container when certificates change.

## Docker Compose Configuration

Create the following Docker Compose file.

```yaml
# /opt/nginx/docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    container_name: global_nginx_proxy
    restart: unless-stopped

    ports:
      - "80:80"      # Redirect HTTP to HTTPS
      - "443:443"    # Secure HTTPS listener

    environment:
      # Outbound proxy settings
      - http_proxy=http://your-proxy.com:8080
      - https_proxy=http://your-proxy.com:8080

      # Bypass the proxy for local networks and containers
      - no_proxy=localhost,127.0.0.1,172.16.0.0/12,your-server-ip,your-server.com,snipeit_app
      - NO_PROXY=localhost,127.0.0.1,172.16.0.0/12,your-server-ip,your-server.com,snipeit_app

    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro

    networks:
      - proxy-net

networks:
  proxy-net:
    external: true
```

The compose file exposes ports **80** and **443**, mounts the Nginx configuration and certificates as read-only, and connects the container to the shared Docker network used by the application stack.

## Nginx Configuration

Create the following Nginx configuration file.

```nginx
# /opt/nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format secure_combined '$remote_addr - $remote_user [$time_local] '
                               '"$request" $status $body_bytes_sent '
                               '"$http_referer" "$http_user_agent" '
                               'Proxy-Client-IP: $http_x_forwarded_for';

    access_log /var/log/nginx/access.log secure_combined;
    error_log  /var/log/nginx/error.log warn;

    # Trust forwarded client IP addresses
    set_real_ip_from 10.0.0.10;
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:;" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # TLS configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    resolver 127.0.0.11 valid=30s;

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name your-server.com;

        ssl_certificate     /etc/nginx/certs/server.crt;
        ssl_certificate_key /etc/nginx/certs/server.key;

        location / {
            set $target_snipeit "http://snipeit_app:80";
            proxy_pass $target_snipeit;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_set_header X-Forwarded-Port 443;

            proxy_read_timeout 600s;
            proxy_connect_timeout 600s;
            client_max_body_size 100M;
        }
    }
}
```

> [!WARNING]
> Replace `your-server.com`, proxy IP addresses, certificates, and network values with those appropriate for your environment before deploying.

> [!TIP]
> Validate the configuration before starting the container.

```bash
docker compose -f /opt/nginx/docker-compose.yml config
docker compose -f /opt/nginx/docker-compose.yml up -d
docker logs global_nginx_proxy
```

## Deploy the Snipe-IT Application

Snipe-IT is deployed as a dedicated Docker stack consisting of the application container and a MariaDB database. Separating the application from the reverse proxy simplifies maintenance, allows each component to be updated independently, and provides a cleaner architecture for hosting multiple services behind a single Nginx instance.

The application stack uses:

- **Snipe-IT** for asset management
- **MariaDB 10.11 LTS** for persistent data storage
- An internal Docker network for database communication
- A shared external network for communication with the Nginx reverse proxy

## Directory Structure

Create the following directory structure.

```text
/opt/snipe-it/
├── .env
└── docker-compose.yml
```

## Configure the Environment File

Create the following `.env` file.

> [!NOTE]
> Replace all placeholder values before deploying the application. This includes passwords, hostnames, application keys, and network ranges.

```ini
# REQUIRED: DOCKER SPECIFIC SETTINGS
APP_VERSION=v8.6.3
APP_PORT=8000

# REQUIRED: BASIC APP SETTINGS
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your_generated_32_byte_base64_key_here=
APP_URL=https://your-server.com
APP_TIMEZONE='UTC'
APP_LOCALE=en-US
MAX_RESULTS=500

# REQUIRED: DATABASE SETTINGS
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=snipeit
DB_USERNAME=snipeit
DB_PASSWORD=your_secure_db_password
MYSQL_ROOT_PASSWORD=your_secure_root_password

# REQUIRED: DATA PROTECTION
ALLOW_BACKUP_DELETE=false
ALLOW_DATA_PURGE=false
IMAGE_LIB=gd

# OPTIONAL: SESSION & SECURITY SETTINGS
SESSION_LIFETIME=12000
EXPIRE_ON_CLOSE=false
ENCRYPT=false
COOKIE_NAME=snipeit_session
SECURE_COOKIES=true
APP_FORCE_TLS=true

# TRUSTED PROXIES
TRUSTED_PROXIES=172.16.0.0/12,172.17.0.0/16,172.18.0.0/16,10.0.0.0/8
APP_TRUSTED_PROXIES=172.16.0.0/12,172.17.0.0/16,172.18.0.0/16,10.0.0.0/8

# Disable Gravatar
DISABLE_GRAVATAR=true
```

## Create the Docker Compose File

The following compose file deploys both MariaDB and the Snipe-IT application, mounts persistent storage, applies the FIPS compatibility workaround, and connects the application to both the internal database network and the shared reverse proxy network.

```yaml
volumes:
  db_data:
  storage:

networks:
  proxy-net:
    external: true
  internal-net:

services:
  db:
    image: mariadb:10.11
    container_name: snipeit_db
    restart: unless-stopped
    command: --binlog-format=ROW

    volumes:
      - db_data:/var/lib/mysql

    environment:
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}

    networks:
      - internal-net

    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 5s
      timeout: 1s
      retries: 5

  app:
    image: snipe/snipe-it:${APP_VERSION}
    container_name: snipeit_app
    restart: unless-stopped

    volumes:
      - storage:/var/lib/snipeit
      - /opt/snipe-it/fips_disable:/proc/sys/crypto/fips_enabled:ro

    expose:
      - "80"

    depends_on:
      db:
        condition: service_healthy
        restart: true

    env_file:
      - .env

    networks:
      - internal-net
      - proxy-net
```

> [!WARNING] 
> The FIPS compatibility file must exist before starting the application container.

## Initialize Snipe-IT

After both containers are running, initialize the application by correcting file permissions, clearing the Laravel configuration cache, and running the initial database migrations.

```bash
# Fix application storage permissions
docker compose -f /opt/snipe-it/docker-compose.yml exec -u root app \
    chown -R docker:root /var/lib/snipeit

docker compose -f /opt/snipe-it/docker-compose.yml exec -u root app \
    chmod -R 775 /var/lib/snipeit

# Clear the Laravel configuration cache
docker compose -f /opt/snipe-it/docker-compose.yml exec app \
    php artisan config:clear

# Run database migrations
docker compose -f /opt/snipe-it/docker-compose.yml exec app \
    php artisan migrate --force
```

## Start the Environment

Start the reverse proxy before deploying the application.

### Start Nginx

```bash
cd /opt/nginx

docker compose down
docker compose up -d
```

### Start Snipe-IT

```bash
cd /opt/snipe-it

docker compose down
docker compose up -d
```

## Verify the Deployment

Verify that all containers are running.

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

A successful deployment should show:

- `global_nginx_proxy` listening on ports **80** and **443**
- `snipeit_db` in a healthy state
- `snipeit_app` running and connected to both Docker networks

Once all containers are healthy, open your browser and navigate to:

```text
https://your-server.com
```

You should be presented with the Snipe-IT setup or login page, depending on whether this is a new or existing deployment.
