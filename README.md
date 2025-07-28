# IronLink - URL Shortener

A full-stack URL shortening application built with React, NestJS, and PostgreSQL. IronLink allows users to create shortened URLs, track visits, and manage their links through a user-friendly dashboard.

## Features

### ✅ Core Requirements Implemented

- **✅ React Application** - Modern React app with TypeScript and Vite
- **✅ URL Shortening** - Enter any URL and get a shortened version
- **✅ Database Storage** - PostgreSQL with Prisma ORM for reliable data persistence
- **✅ Unique Slugs** - Automatic slug generation with collision detection
- **✅ URL Redirection** - Seamless redirects to original URLs
- **✅ 404 Handling** - Custom error pages for slugs that is not found 
- **✅ URL Management** - List and manage all created URLs
- **✅ User Accounts** - Authentication system with JWT
- **✅ URL Validation** - Server/client side validation of provided URLs
- **✅ Error Messages** - Clear feedback for invalid inputs
- **✅ Copy to Clipboard** - One-click copying of shortened URLs
- **✅ Custom Slugs** - Users can modify their URL slugs
- **✅ Visit Tracking** - Track clicks with IP, user agent, and referrer
- **✅ Rate Limiting** - Comprehensive rate limiting to prevent abuse
- **✅ Analytics Dashboard** - Popularity metrics and visit statistics
- **✅ Docker Support** - Complete Docker setup for easy deployment

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development
- **UI**: Radix-UI and Tailwind components with modern styling
- **State Management**: React Query for server state

### Backend (NestJS + TypeScript)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Rate Limiting**: NestJS Throttler module with multiple strategies
- **Validation**: Class-validator for request validation

### Database
- **ORM**: Prisma for type-safe database operations
- **Database**: PostgreSQL for reliable data storage
- **Migrations**: Automatic schema migrations

## Installation & Setup


### Quick Start with Docker

#### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/runik/IronLink
   cd IronLink
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000
   - Database: localhost:5432

#### Option 2: Using Pre-built Docker Image

1. **Pull the Docker image**
   ```bash
   docker pull ghcr.io/runik/ironlink:latest
   ```

2. **Run the container**
   ```bash
   docker run -p 80:80 -p 3000:3000 ghcr.io/runik/ironlink:latest
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000

## Future Improvements

### Testing & Quality Assurance
- **Enhanced Test Coverage** - Add comprehensive unit and integration tests for both frontend and backend
- **Playwright E2E Tests** - Implement end-to-end testing with Playwright for critical user flows
- **CI/CD Pipeline** - Integrate with GitHub Actions for automated testing and deployment

### Performance & Scalability
- **Data Aggregation** - Implement data aggregation for statistics and click tracking (consider migrating to RedShift for large-scale analytics)
- **Edge Function Service** - Create a dedicated edge function service for link redirects with KV store for ultra-fast reads
- **Caching Strategy** - Implement Redis caching for frequently accessed data

### Security Enhancements
- **CSRF Protection** - Add Cross-Site Request Forgery protection
- **Clickjacking Prevention** - Implement proper X-Frame-Options and Content Security Policy headers
- **CORS Configuration** - Fine-tune Cross-Origin Resource Sharing policies
- **Security Headers** - Implement comprehensive security headers (HSTS, CSP, etc.)
