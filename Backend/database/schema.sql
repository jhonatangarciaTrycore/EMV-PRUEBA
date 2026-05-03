CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    bac NUMERIC(14, 2) NOT NULL CHECK (bac >= 0),
    planned_percent NUMERIC(5, 2) NOT NULL CHECK (planned_percent >= 0 AND planned_percent <= 100),
    actual_percent NUMERIC(5, 2) NOT NULL CHECK (actual_percent >= 0 AND actual_percent <= 100),
    actual_cost NUMERIC(14, 2) NOT NULL CHECK (actual_cost >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_activities_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activities_project_id ON activities(project_id);
