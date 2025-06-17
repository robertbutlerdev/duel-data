FROM flyway/flyway:11.8 AS db-init

WORKDIR /app

ARG FLYWAY_EDITION
ENV FLYWAY_EDITION="community"

COPY ./flyway.conf ./flyway.conf
COPY ./deploy.sh ./deploy.sh
COPY ./sql ./sql

ENTRYPOINT [ "./deploy.sh" ] 