# Multi-stage build for IronLink application
FROM node:22-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    postgresql \
    postgresql-contrib \
    nginx \
    supervisor \
    && rm -rf /var/cache/apk/*

# Create necessary directories
RUN mkdir -p /var/lib/postgresql/data \
    /var/log/postgresql \
    /var/log/nginx \
    /var/log/supervisor \
    /app/backend \
    /app/frontend \
    /etc/nginx/conf.d \
    /run/postgresql && \
    chown postgres:postgres /run/postgresql

# Set up PostgreSQL
ENV POSTGRES_DB=ironlink
ENV POSTGRES_USER=ironlink_user
ENV POSTGRES_PASSWORD=ironlink_password
ENV PGDATA=/var/lib/postgresql/data

# Copy PostgreSQL initialization scripts
COPY db/init-db.sql /docker-entrypoint-initdb.d/
COPY db/scripts/ /docker-entrypoint-initdb.d/

# Copy PostgreSQL configuration
COPY db/postgresql.conf /etc/postgresql/postgresql.conf

# ===== BACKEND BUILD STAGE =====
FROM base AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy backend source code
COPY backend/ .

# Generate Prisma client
RUN npx prisma generate

# Build backend
RUN npm run build

# ===== FRONTEND BUILD STAGE =====
FROM base AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ .

# Build frontend
RUN npm run build

# ===== FINAL STAGE =====
FROM base AS production

# Copy built backend from builder stage
COPY --from=backend-builder /app/backend/dist /app/backend/dist
COPY --from=backend-builder /app/backend/package*.json /app/backend/
COPY --from=backend-builder /app/backend/prisma /app/backend/prisma
COPY --from=backend-builder /app/backend/node_modules/.prisma /app/backend/node_modules/.prisma



# Install only production backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production && npm cache clean --force

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
RUN mkdir -p /etc/supervisor/conf.d
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Initialize PostgreSQL database
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql/data && \
    su postgres -c "initdb -D /var/lib/postgresql/data" && \
    echo "host all all 127.0.0.1/32 trust" >> /var/lib/postgresql/data/pg_hba.conf && \
    echo "host all all ::1/128 trust" >> /var/lib/postgresql/data/pg_hba.conf

# Copy startup script
COPY startup.sh /startup.sh
RUN chmod +x /startup.sh

# Expose ports
EXPOSE 80 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start supervisor to manage all services
CMD ["/startup.sh"] 