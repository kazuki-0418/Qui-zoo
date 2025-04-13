# Backend README

## How to Start the Server

Follow these steps to set up and start the project.

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The `npm start` command executes `tsc-watch --onSuccess "nodemon dist/index.js"`. This watches for changes in TypeScript files, automatically compiles them, and then runs the compiled JavaScript files using nodemon.

## Directory Structure

```
src/
├── controllers/   # Business logic implementation
├── models/        # Data models and data access layer
├── routes/        # API routing definitions
├── middleware/    # Middleware
├── utils/         # Utility functions
└── index.ts       # Application entry point
```

### Controllers Layer
Controllers handle requests from clients and implement logic to call appropriate models.

```typescript
// Example: src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Models Layer
The model layer uses the Prisma client to access the database. It separates data access logic from business logic.

```typescript
// Example: src/models/userModel.ts
import { prisma } from '../utils/prisma';

export class UserModel {
  static async findAll() {
    return prisma.user.findMany();
  }
  
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }
}
```

### Routes Layer
The routes layer defines endpoints and HTTP methods, mapping each request to the appropriate controller.

```typescript
// Example: src/routes/userRoutes.ts
import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

export default router;
```

## Basic Prisma Operations

### Setup

1. **Install Prisma**:
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Initialize**:
   ```bash
   npx prisma init
   ```

3. **Configure connection in .env file**:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public"
   ```

### Define Schema

Define your data models in the `prisma/schema.prisma` file:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Migrations

Apply schema to the database:

```bash
# Create and apply migration file
npx prisma migrate dev --name init

# New migration after schema changes
npx prisma migrate dev --name add_new_field
```

### Generate Prisma Client

Update type definitions:

```bash
npx prisma generate
```

### Database Inspection

Check and edit data using the browser-based UI:

```bash
npx prisma studio
```

### Basic CRUD Operations

```typescript
// Create record
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'Example User'
  }
});

// Get all records
const allUsers = await prisma.user.findMany();

// Search with conditions
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Update
const updatedUser = await prisma.user.update({
  where: { id: 'user-id' },
  data: { name: 'Updated Name' }
});

// Delete
const deletedUser = await prisma.user.delete({
  where: { id: 'user-id' }
});
```

### Handling Relations

Retrieving data with relations:

```typescript
// Get user with their posts
const userWithPosts = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: { posts: true }
});
```

Creating data with relations:

```typescript
const userWithPost = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'Example User',
    posts: {
      create: {
        title: 'Hello World',
        content: 'My first post'
      }
    }
  },
  include: { posts: true }
});
```