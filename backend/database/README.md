# Database setup

This folder contains the schema definition for the project database.

## Important

- Do not commit the live MySQL database files or data exports.
- Keep real credentials in a local `.env` file; the repository only contains `.env.example`.
- The schema below is safe to push to GitHub and can be used on any local or production environment.

## Initialize schema

```bash
mysql -u <username> -p < backend/database/schema.sql
```

Or, if using a dedicated database user:

```bash
mysql -u fontegas_app -p fontegas_db < backend/database/schema.sql
```

## Required environment variables

Copy the example file and configure a local database user:

```bash
cp backend/.env.example backend/.env
```

Then set values such as:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

## What is stored

- `leads`: contact and offer requests from the public website
- `documents`: metadata for downloadable files served by the app

## Do not commit

- `.env`
- local MySQL data directory
- personal or production data dumps
