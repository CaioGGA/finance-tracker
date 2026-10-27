# Finance Tracker

A REST API that helps people track their finances. It lets you record income and expenses and manage them through simple HTTP requests.

## Tech stack

- Node.js and Express
- PostgreSQL (with the `pg` package)

## Features

- Tracks income and expenses
- Full CRUD: create, read, update, and delete transactions
- Input validation with clear error messages

## How to run

1. Install Node.js and PostgreSQL, and start the PostgreSQL service.
2. Create the database: `createdb finance_tracker`
3. Create the table:

```bash
psql -d finance_tracker -f schema.sql
```

4. Install dependencies and start the server:

```bash
npm install
node server.js
```

The server runs on `http://localhost:3000`.

## API routes

| Method | Path | What it does |
|--------|------|--------------|
| GET | `/transactions` | Returns all transactions |
| GET | `/transactions/:id` | Returns a specific transaction by id |
| POST | `/transactions` | Creates a new transaction |
| PUT | `/transactions/:id` | Updates a specific transaction by id |
| DELETE | `/transactions/:id` | Deletes a specific transaction by id |
