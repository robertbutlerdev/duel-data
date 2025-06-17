# ####################################################
# # Node layer - only define node version once
# ####################################################
FROM node:22.16.0-alpine AS node

# ####################################################
# # Builder layer - run pnpm install
# ####################################################
FROM node AS builder

# ASDF -------------------------------
ARG ASDF_VERSION=v0.10.2

# Install required packages
RUN apk update && \
  apk add \
    git \
    curl \
    bash

# Install asdf
ENV PATH /root/.asdf/bin:/root/.asdf/shims:$PATH
RUN /bin/bash -c "git clone https://github.com/asdf-vm/asdf.git /root/.asdf --branch ${ASDF_VERSION}"
RUN chmod +x /root/.asdf

RUN echo -e "\n. /root/.asdf/asdf.sh" >> ~/.bashrc
RUN echo -e "\n. /root/.asdf/completions/asdf.bash" >> ~/.bashrc
RUN /bin/bash -c "source ~/.bashrc"

# Setup legacy version file to support old setups
RUN echo -e "\nlegacy_version_file = yes" >> ~/.asdfrc

WORKDIR /app

COPY .tool-versions .tool-versions
RUN asdf plugin add pnpm
RUN asdf install pnpm

ARG PORT
ARG INSPECT_PORT
ARG ENV=local
ENV NODE_ENV=production

# Copy relevant files
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY apps/api/package.json apps/api/package.json
COPY packages/api packages/api

# Remove all but the package.json files in packages folder
RUN find packages ! -name 'package.json' -type f -exec rm -f {} +

RUN pnpm install --frozen-lockfile --ignore-scripts

# ####################################################
# # Base layer - remove duplication in production and watcher
# ####################################################
FROM node AS base

# Setup user and workspace
RUN addgroup -g 3000 -S app && adduser -u 3000 -S app -G app
WORKDIR /app
RUN chown -R app:app /app/
USER app

# Copy files
COPY --from=builder /app/apps/api/package.json apps/api/package.json
COPY --from=builder /app/apps/api/node_modules apps/api/node_modules
COPY --from=builder /app/node_modules node_modules
COPY apps/api/dist apps/api/dist
COPY packages/api packages/api

# ####################################################
# # Production
# ####################################################
FROM base AS production

WORKDIR /app

# Document port to run on
ENV PORT=${PORT}
ENV INSPECT_PORT=${INSPECT_PORT}
EXPOSE $PORT
EXPOSE $INSPECT_PORT

# Entry point is already set to node
CMD [ "apps/api/dist/index.js" ]

####################################################
# Watcher - hotreload and development purposes
####################################################
FROM base AS watcher

WORKDIR /app

# Document port to run on
ENV PORT=5001
EXPOSE $PORT
ENV DEBUG_PORT=9233
EXPOSE $DEBUG_PORT

# Use the native node watcher
CMD ["node", "--inspect=0.0.0.0", "--trace-warnings", "--watch", "apps/api/dist/index.js" ]
