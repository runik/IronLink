-- Install useful PostgreSQL extensions for IronLink
-- This script runs during database initialization

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable unaccent for text search without accents
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Enable btree_gin for GIN indexes on btree-compatible types
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Enable pg_trgm for trigram matching (useful for fuzzy search)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable citext for case-insensitive text fields
CREATE EXTENSION IF NOT EXISTS "citext"; 