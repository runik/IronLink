# Use the official PostgreSQL image as base
FROM postgres:17.5-alpine

# Set environment variables
ENV POSTGRES_DB=ironlink
ENV POSTGRES_USER=ironlink_user
ENV POSTGRES_PASSWORD=ironlink_password

# Install additional packages if needed
RUN apk add --no-cache \
    postgresql-contrib \
    && rm -rf /var/cache/apk/*

# Copy initialization scripts
COPY init-db.sql /docker-entrypoint-initdb.d/
COPY ./scripts/ /docker-entrypoint-initdb.d/

# Copy custom PostgreSQL configuration
COPY postgresql.conf /etc/postgresql/postgresql.conf

# Set custom configuration
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD pg_isready -U ironlink_user -d ironlink 