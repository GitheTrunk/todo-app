# Todo App

This repository contains a NestJS API and a React + Vite frontend. PostgreSQL runs in Docker.

## Start PostgreSQL

For a new setup, create the database container with a named volume so data persists if the container is recreated:

```bash
docker run --name todo-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=todo \
  -v todo-db-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:16
```

If the `todo-db` container already exists, start it instead of creating another one:

```bash
docker start todo-db
```

The API connects to `localhost:5432` with database `todo`, username `postgres`, and password `postgres` (see `api/src/app.module.ts` and `api/src/data-source.ts`).

## Start the API

Run these commands from the repository root:

```bash
cd api
npm install
npm run typeorm -- migration:run -d src/data-source.ts
npm run start:dev
```

The API is available at `http://localhost:3000`; its routes use the `/api` prefix. For example, `GET http://localhost:3000/api/todos` returns the to-do list.

To generate a migration after changing an entity, run this from `api/`:

```bash
npm run typeorm -- migration:generate src/migrations/<migration-name> -d src/data-source.ts
```

## Start the frontend

In a second terminal, run:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend connects to `http://localhost:3000/api` by default.

## Stop PostgreSQL

```bash
docker stop todo-db
```
