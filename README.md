<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  Simple REST API app with NestJS, TypeScript, JWT authentication, and SQL database.
</p>

## Description

This project is a simple REST API built with NestJS and TypeScript, 

Implementing:
- User and Post CRUD operations (2 entities that are related).
- JWT authentication for secure access to protected endpoints.
- SQL database support via TypeORM (MySQL).
- E2E tests for CRUD operations and JWT token validation.
- Modular project structure for scalability and maintainability.

---

## Project Structure & Pattern

This project uses a modular pattern common in NestJS:

src/
|- posts/
|   |- dto/
|     |- create-post.dto.ts
|     |-update-post.dto.ts
|   |- post.entity.ts
|   |- post.controller.ts
|   |- post.service.ts
|- users/
|   |- dto/
|     |- create-user.dto.ts
|     |- update-user.dto.ts
|   |- guards/
|     |- jwt-auth.guard.ts
|   |- user.entity.ts
|   |- user.controller.ts
|   |- user.service.ts
|- app.module.ts
|- main.ts
|- test/
|   |- app.e2e-spec.ts
|- .env

---

Reason for using this pattern:

- Everything related is together: controller, service, entity, DTO, and guards for each module.
- Easy to expand: can add new modules without messing up the project.
- Simple to maintain and test: makes unit tests and E2E tests easier.

---

## Features

- User CRUD (register, update, delete, get users)
- Post CRUD (create, update, delete, get posts)
- User-Post relationship (User has many Posts)
- JWT authentication (login to get token, protect routes)
- E2E testing for all endpoints
- Error handling using `EntityNotFoundExceptionFilter`

---

## Environment Variables

Create a `.env` file in the root:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=intern_task
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```
---

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

## Database
- SQL database using TypeORM.
- Tables: users and posts.
- Relation: User 1:N Post.

--- 

## Authentication

- JWT-based authentication for protected endpoints (/posts CRUD).
- Login endpoint /users/login returns a JWT token.
- Use the token in headers for protected routes:

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```