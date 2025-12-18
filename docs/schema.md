# Project & Permissions Database Documentation

This document contains **all finalized SQL queries and structures** discussed, organized and ready for reference or reuse.

---

## Projects Table

* Stores project metadata
* Stores **thumbnail as binary** (`BYTEA`)
* Stores **one timestamp only** (`created_at`)

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    creator_email TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,

    thumbnail BYTEA,

    begin_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_creator
        FOREIGN KEY (creator_email)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
```

---

## Deleted Projects (Audit / History Table)

* Stores projects **after deletion**
* No foreign keys
* Creator email preserved as plain text

```sql
CREATE TABLE deleted_projects (
    id UUID,
    creator_email TEXT,
    name TEXT,
    description TEXT,
    status TEXT,
    thumbnail BYTEA,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Trigger Function: Archive Deleted Projects

Runs **before a project is deleted** and archives it into `deleted_projects`.

```sql
CREATE OR REPLACE FUNCTION archive_deleted_project()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO deleted_projects (
        id,
        creator_email,
        name,
        description,
        status,
        thumbnail,
        deleted_at
    )
    VALUES (
        OLD.id,
        OLD.creator_email,
        OLD.name,
        OLD.description,
        OLD.status,
        OLD.thumbnail,
        NOW()
    );

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
```

---

## Trigger: Attach Archive Logic to Projects

```sql
CREATE TRIGGER before_project_delete
BEFORE DELETE ON projects
FOR EACH ROW
EXECUTE FUNCTION archive_deleted_project();
```

```
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

```
CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```
