#!/bin/bash

psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" <<-EOSQL
	CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
	CREATE DATABASE ${DB_DATABASE} WITH OWNER ${DB_USER};
	GRANT ALL PRIVILEGES ON DATABASE ${DB_DATABASE} TO ${DB_USER};
EOSQL
