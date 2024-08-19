# Stage 1: Build Keycloak
FROM quay.io/keycloak/keycloak:latest AS builder

# Configure a database vendor
ENV KC_DB=postgres
ENV KC_SPI_THEME_DEFAULT='stopover'

# Set working directory
WORKDIR /opt/keycloak

# Build the Keycloak server
RUN /opt/keycloak/bin/kc.sh build

# Stage 2: Download and prepare dockerize
FROM alpine:latest AS tools

# Install necessary tools: wget, tar
RUN apk add --no-cache wget tar

# Download dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz && \
    chmod +x /usr/local/bin/dockerize

# Final stage: Create the final image
FROM quay.io/keycloak/keycloak:latest

# Copy built Keycloak files from the builder stage
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy dockerize from the tools stage
COPY --from=tools /usr/local/bin/dockerize /usr/local/bin/dockerize

# Copy custom themes
COPY ./themes/stopover/ /opt/keycloak/themes/stopover

# Set the entrypoint to use dockerize for waiting
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
