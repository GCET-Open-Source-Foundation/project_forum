package main

import (
	"io"
	"time"

	"github.com/gin-gonic/gin"
)

/*
 * Project Model
 * Defines the structure for JSON responses and DB Scans
 * FIX: Removed 'BeginDate' to match your actual DB schema
 */
type Project struct {
	ID           string    `json:"id"`
	CreatorEmail string    `json:"creator_email"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Status       string    `json:"status"`
	Thumbnail    []byte    `json:"thumbnail"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

/*
 * Used to create a project
 * Checks if the role is admin or super-admin
 */
func create_project(c *gin.Context) {
	userEmail := get_username(c)
	if userEmail == "" {
		c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
		return
	}

	if !auth1.Check_permissions(userEmail, "meta", "super-admin") &&
		!auth1.Check_permissions(userEmail, "meta", "admin") {
		c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
		return
	}

	name := c.PostForm("name")
	description := c.PostForm("description")
	status := c.PostForm("status")

	if name == "" || status == "" {
		c.JSON(400, gin.H{"error": "missing required fields"})
		return
	}

	var thumbnailBytes []byte
	file, err := c.FormFile("thumbnail")
	if err == nil {
		f, err := file.Open()
		if err != nil {
			c.JSON(400, gin.H{"error": "invalid thumbnail"})
			return
		}
		defer f.Close()

		thumbnailBytes, err = io.ReadAll(io.LimitReader(f, 2<<20+1))
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to read thumbnail"})
			return
		}
		if len(thumbnailBytes) > 2<<20 {
			c.JSON(400, gin.H{"error": "thumbnail too large (max 2MB)"})
			return
		}
	}

	var projectID string
	err = auth1.Conn.QueryRow(
		c.Request.Context(),
		`
		INSERT INTO projects (
			creator_email,
			name,
			description,
			status,
			thumbnail
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
		`,
		userEmail,
		name,
		description,
		status,
		thumbnailBytes,
	).Scan(&projectID)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create project"})
		return
	}

	c.JSON(201, gin.H{
		"id": projectID,
	})
}

/*
 * Get a single project by ID
 */
func get_project(c *gin.Context) {
	projectID := c.Param("id")

	var p Project

	// FIX: Removed 'begin_date' from SELECT and Scan
	row := auth1.Conn.QueryRow(
		c.Request.Context(),
		`
		SELECT
			id,
			creator_email,
			name,
			COALESCE(description, ''),
			status,
			thumbnail,
			created_at,
			updated_at
		FROM projects
		WHERE id = $1
		`,
		projectID,
	)

	if err := row.Scan(
		&p.ID,
		&p.CreatorEmail,
		&p.Name,
		&p.Description,
		&p.Status,
		&p.Thumbnail,
		&p.CreatedAt,
		&p.UpdatedAt,
	); err != nil {
		c.JSON(404, gin.H{"error": "project not found"})
		return
	}

	c.JSON(200, p)
}

/*
 * Get all projects
 */
func get_all_projects(c *gin.Context) {
	// FIX: Removed 'begin_date' from SELECT and Scan
	query := `
		SELECT
			id,
			creator_email,
			name,
			COALESCE(description, ''),
			status,
			thumbnail,
			created_at,
			updated_at
		FROM projects
		ORDER BY created_at DESC
	`

	rows, err := auth1.Conn.Query(c.Request.Context(), query)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch projects"})
		return
	}
	defer rows.Close()

	projects := []Project{}

	for rows.Next() {
		var p Project

		if err := rows.Scan(
			&p.ID,
			&p.CreatorEmail,
			&p.Name,
			&p.Description,
			&p.Status,
			&p.Thumbnail,
			&p.CreatedAt,
			&p.UpdatedAt,
		); err != nil {
			c.JSON(500, gin.H{"error": "Failed to scan project data"})
			return
		}

		projects = append(projects, p)
	}

	if rows.Err() != nil {
		c.JSON(500, gin.H{"error": "Error iterating projects"})
		return
	}

	c.JSON(200, projects)
}

/*
 * Checks auth and yeets project from the db
 */
func delete_project(c *gin.Context) {
	projectID := c.Param("id")
	user_email := get_username(c)

	if user_email == "" {
		c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
		return
	}

	isSudo := auth1.Check_permissions(user_email, "meta", "super-admin")

	if !isSudo {
		var creator_email string
		err := auth1.Conn.QueryRow(
			c.Request.Context(),
			"SELECT creator_email FROM projects WHERE id = $1",
			projectID,
		).Scan(&creator_email)

		if err != nil {
			c.JSON(404, gin.H{"error": "project not found"})
			return
		}

		if creator_email != user_email {
			c.JSON(403, gin.H{"error": "forbidden"})
			return
		}
	}

	tag, err := auth1.Conn.Exec(
		c.Request.Context(),
		"DELETE FROM projects WHERE id = $1",
		projectID,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to delete project"})
		return
	}

	if tag.RowsAffected() == 0 {
		c.JSON(404, gin.H{"error": "project not found"})
		return
	}

	c.Status(204)
}
