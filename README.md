# Movie Management API

A NestJS backend API for managing movies with user authentication, image uploads, and pagination.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Database ORM with migrations
- **PostgreSQL** - Database
- **Supabase** - Authentication
- **Cloudinary** - Image hosting
- **Swagger** - API documentation

## Features

- User authentication with Supabase
- Movie CRUD operations (user-scoped)
- Image upload to Cloudinary
- Pagination support
- Input validation
- Swagger API docs at `/api`

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=skill_test_db

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Create database and run migrations**
```bash
createdb skill_test_db
npm run migration:run
```

4. **Start the server**
```bash
npm run start:dev
```

API will be available at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api`

## API Endpoints

All endpoints require authentication. Include your Supabase JWT token:
```
Authorization: Bearer <your_supabase_token>
```

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/movies` | Create a movie with image upload |
| GET | `/movies` | Get all user's movies (paginated) |
| GET | `/movies/:id` | Get a specific movie |
| PATCH | `/movies/:id` | Update a movie |
| DELETE | `/movies/:id` | Delete a movie |

### Examples

**Create a movie:**
```bash
curl -X POST http://localhost:3000/movies \
  -H "Authorization: Bearer <token>" \
  -F "title=Inception" \
  -F "publishYear=2010" \
  -F "image=@/path/to/image.jpg"
```

**Get movies with pagination:**
```bash
# Default: page=1, limit=10
GET /movies

# Custom pagination
GET /movies?page=2&limit=20
```

**Response format:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Inception",
      "publishYear": 2010,
      "image": "https://cloudinary.com/...",
      "userId": "user-id",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Common Commands

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Run migrations
npm run migration:run

# Generate migration
npm run migration:generate src/database/migrations/MigrationName

# Revert migration
npm run migration:revert

# Run tests
npm run test
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | Environment mode (default: development) |
| `PORT` | No | Server port (default: 3000) |
| `DB_HOST` | Yes | PostgreSQL host |
| `DB_PORT` | Yes | PostgreSQL port |
| `DB_USERNAME` | Yes | PostgreSQL username |
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `DB_DATABASE` | Yes | Database name |
| `DB_SYNCHRONIZE` | No | Auto-sync schema (default: false, **never true in production**) |
| `DB_LOGGING` | No | Enable SQL logging (default: false) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |

## Project Structure

```
src/
├── common/              # Shared resources (guards, decorators, entities)
├── config/              # Configuration files
├── database/            # Migrations and seeds
├── modules/
│   └── movies/         # Movies module
│       ├── dto/        # Data transfer objects
│       ├── entities/   # Movie entity
│       ├── movies.controller.ts
│       ├── movies.service.ts
│       └── movies.module.ts
├── shared/             # Shared services (upload, cloudinary, file)
├── app.module.ts
└── main.ts
```

## Authentication

This API uses Supabase for authentication. Users must:
1. Sign up/login through Supabase
2. Include the JWT token in the `Authorization` header
3. Each user can only access their own movies
