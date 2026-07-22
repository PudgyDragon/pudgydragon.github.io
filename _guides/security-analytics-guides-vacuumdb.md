---
title: "Vacuumdb"
project: "Security Analytics"
category: "Engineering Guide"
description: "A practical engineering guide for Security Analytics."
source_url: "https://github.com/PudgyDragon/Security_Analytics/blob/main/Guides/vacuumdb.md"
---

# This is a simple guide to vacuum postgresql databases on SSA
### Doing this as part of troubleshooting for /var filling up

## Change Permissions
You'll need to change persmissions temporarily for postgres using:
```
vim /var/lib/pgsql/data/pg_hba.conf
```
Change
```
local  all  postgres  peer
```
to
```
local  all  postgres  trust
```
and save the file using `esc`, `:wq!`

## Vacuum
After saving the file, run `systemctl restart postgresql` to make sure the new settings are used. Then, run the following command:
```
vacuumdb --all  --username=postgres --no-password
```
This will use the `vacuumdb` command as the Superuser `postgres` and vacuum all databases.

## Wrapping Up
When you're done, don't forget to go back and change `trust` back to `peer` in your `pg_hba.conf` file.
