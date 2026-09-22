# Database setup

This folder contains the schema definition and a deployment snapshot with all eight current document records.

## Deploy the database and documents

Clone/download the complete repository on the server, keeping the PDF and Word files in the project root.
Import `fontegas_db.sql` into a fresh MySQL instance/database:

```bash
mysql -u <username> -p < backend/database/fontegas_db.sql
```

Alternatively, import this SQL file using phpMyAdmin. It creates `fontegas_db`, its tables, and the document records. Do not import `schema.sql` separately: it is already included in the snapshot. Use a fresh database to avoid duplicate IDs/indexes.

Configure `backend/.env` with the server's database credentials and admin credentials, then start the application. The backend creates the admin account at startup. Contact submissions and local admin password hashes are not included in this document deployment snapshot.

The database stores document metadata; the actual PDF/Word files are also committed in the project root and must be deployed with the code. Future uploads are stored in `uploads/` and need to be transferred along with an updated database export.

## Important

- Do not commit live MySQL storage files or exports containing private submissions or credentials. The document deployment snapshot is intended to be committed.
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
