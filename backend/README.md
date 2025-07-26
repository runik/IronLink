# IronLink Backend

A NestJS backend application with Prisma ORM for PostgreSQL database management.

## Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Docker (optional, for local development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the backend directory with:
```env
DATABASE_URL="postgresql://ironlink_user:ironlink_password@localhost:5432/ironlink?schema=public"
NODE_ENV=development
PORT=3000
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push database schema:
```bash
npm run db:push
```

### Database Management

- **Generate Prisma client**: `npm run db:generate`
- **Push schema changes**: `npm run db:push`
- **Create migration**: `npm run db:migrate`
- **Open Prisma Studio**: `npm run db:studio`
- **Reset database**: `npm run db:reset`

### Running the Application

- **Development**: `npm run start:dev`
- **Production**: `npm run start:prod`

### API Endpoints

- `GET /` - Health check
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Database Schema

The application includes the following models:
- **User**: User authentication and profile data
- **Link**: URL shortening and metadata
- **Click**: Analytics tracking for link clicks 