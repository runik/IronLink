#!/bin/sh
set -e

# Start PostgreSQL in background
su postgres -c "postgres -c config_file=/etc/postgresql/postgresql.conf" &
PG_PID=$!

# Wait for PostgreSQL to start
sleep 5

# Create database and user
su postgres -c "createdb ironlink" || true
su postgres -c "psql -c \"CREATE USER ironlink_user WITH PASSWORD 'ironlink_password';\" || true"
su postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ironlink TO ironlink_user;\" || true"

# Run initialization scripts
for script in /docker-entrypoint-initdb.d/*.sql; do
    if [ -f "$script" ]; then
        echo "Running script: $script"
        su postgres -c "psql -d ironlink -f $script"
    fi
done

# Grant permissions to ironlink_user for migrations
su postgres -c "psql -d ironlink -c \"GRANT ALL ON SCHEMA public TO ironlink_user;\""
su postgres -c "psql -d ironlink -c \"GRANT CREATE ON SCHEMA public TO ironlink_user;\""

# Apply Prisma migrations
echo "Applying Prisma migrations..."
cd /app/backend
export DATABASE_URL="postgresql://ironlink_user:ironlink_password@localhost:5432/ironlink"

# Push schema to database (this creates tables based on schema.prisma)
echo "Pushing Prisma schema to database..."
npx prisma db push

# Kill background PostgreSQL
kill $PG_PID
wait $PG_PID

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf 