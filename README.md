# Skill Test Backend - NestJS + TypeORM + PostgreSQL

A scalable and maintainable NestJS backend application with PostgreSQL and TypeORM.

## Project Structure

```
src/
├── common/                 # Shared resources
│   ├── dto/               # Common DTOs (pagination, response)
│   ├── entities/          # Base entity class
│   ├── decorators/        # Custom decorators
│   ├── guards/            # Auth guards
│   ├── interceptors/      # Response interceptors
│   ├── filters/           # Exception filters
│   └── pipes/             # Validation pipes
├── config/                # Configuration files
│   ├── database.config.ts # TypeORM configuration
│   └── env.validation.ts  # Environment validation
├── database/              # Database related files
│   ├── migrations/        # Database migrations
│   └── seeds/             # Database seeds
├── modules/               # Feature modules
│   └── users/            # Users module (example)
│       ├── dto/          # User DTOs
│       ├── entities/     # User entity
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
├── app.module.ts
└── main.ts
```

## Features

- **TypeORM Integration**: Full TypeORM setup with migrations support
- **Base Entity**: Common fields (id, createdAt, updatedAt, deletedAt) with soft delete
- **Environment Validation**: Runtime validation of environment variables
- **Modular Architecture**: Clean separation of concerns
- **Migration System**: Database version control
- **Seeding Support**: Database seeding utilities
- **DTO Validation**: Input validation with class-validator
- **Pagination Support**: Built-in pagination DTOs
- **Soft Delete**: Soft delete functionality on base entity

## Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Yarn or npm

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=skill_test_db
DB_SYNCHRONIZE=false
DB_LOGGING=true
```

4. Create database:
```bash
createdb skill_test_db
```

## Database Commands

### Migrations

```bash
# Generate a new migration based on entity changes
yarn migration:generate src/database/migrations/MigrationName

# Create an empty migration file
yarn migration:create src/database/migrations/MigrationName

# Run pending migrations
yarn migration:run

# Revert last migration
yarn migration:revert

# Show migration status
yarn migration:show
```

### Seeds

```bash
# Run seeds
yarn seed:run
```

## Running the Application

```bash
# Development
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## API Endpoints (Users Example)

- `POST /users` - Create a user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user
- `POST /users/:id/restore` - Restore deleted user

## Creating a New Module

1. Create module directory structure:
```bash
mkdir -p src/modules/your-module/{dto,entities}
```

2. Create entity extending BaseEntity:
```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('your_table')
export class YourEntity extends BaseEntity {
  @Column()
  name: string;
}
```

3. Create DTOs with validation:
```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

4. Create service, controller, and module following the Users module pattern

5. Generate migration:
```bash
yarn migration:generate src/database/migrations/CreateYourTable
```

6. Run migration:
```bash
yarn migration:run
```

## Best Practices

1. **Always use migrations** - Never set `DB_SYNCHRONIZE=true` in production
2. **Extend BaseEntity** - All entities should extend the base entity for consistency
3. **Use DTOs** - Always validate input with DTOs and class-validator
4. **Soft Delete** - Use soft delete (built into BaseEntity) instead of hard deletes
5. **Environment Validation** - All environment variables are validated at startup
6. **Module Pattern** - Keep modules self-contained with their own DTOs, entities, services
7. **Repository Pattern** - Use TypeORM repositories injected via @InjectRepository

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Application port | 3000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | Database username | postgres |
| DB_PASSWORD | Database password | postgres |
| DB_DATABASE | Database name | skill_test_db |
| DB_SYNCHRONIZE | Auto sync schema (dev only) | false |
| DB_LOGGING | Enable SQL logging | false |
