#!/bin/bash
set -e

DATABASE_URL="jdbc:sqlserver://$DB_HOST:$DB_PORT"

# When connecting to azure, we need some extras in our connection string
if [[ $DB_HOST == *"database.windows.net"* ]]; then
  DATABASE_URL="$DATABASE_URL;database=$DB_NAME;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
else
  DATABASE_URL="$DATABASE_URL;database=$DB_NAME;encrypt=true;trustServerCertificate=true;loginTimeout=10;"
fi

echo "DB URL: $DATABASE_URL"

if [[ $CLEAN_DB = "true" ]]; then
  flyway clean -url=$DATABASE_URL -user=$DB_USERNAME -password=$DB_PASSWORD -locations="filesystem:sql" -baselineOnMigrate=true -connectRetries=60
else
  flyway migrate -url=$DATABASE_URL -user=$DB_USERNAME -password=$DB_PASSWORD -locations="filesystem:sql" -baselineOnMigrate=true -connectRetries=60
fi