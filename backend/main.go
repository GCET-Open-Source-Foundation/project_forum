package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/GCET-Open-Source-Foundation/auth"
	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"

	"github.com/joho/godotenv"
)

var r *gin.Engine
var auth1 *auth.Auth

/*
 * The main server file
 * This here is where the entire cosmos starts ;)
 */

func main() {
	/*
	 * Auth connection here
	 */
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	missing := []string{}

	if dbUsername == "" {
		missing = append(missing, "DB_USERNAME")
	}
	if dbPassword == "" {
		missing = append(missing, "DB_PASSWORD")
	}
	if dbHost == "" {
		missing = append(missing, "DB_HOST")
	}
	if dbName == "" {
		missing = append(missing, "DB_NAME")
	}
	if dbPort == "" {
		missing = append(missing, "DB_PORT")
	}

	if len(missing) > 0 {
		log.Fatalf("missing required environment variables: %v", missing)
	}

	dbPort1, err := strconv.ParseUint(dbPort, 10, 16)
	if err != nil {
		log.Fatalf("invalid DB_PORT value: initialize it in .env file maybe? %v", err)
	}

	auth1, err = auth.Init(
		context.Background(),
		uint16(dbPort1),
		dbUsername,
		dbPassword,
		dbName,
		dbHost,
	)
	if err != nil {
		log.Fatalf("auth.Init failed: initialize it in .env file maybe? %v", err)
	}
	defer auth1.Close()
	fmt.Println("auth initialized")

	jwtSecret := os.Getenv("JWT_SECRET")

	/*
	 * JWT init using auth
	 */
	if jwtSecret == "" {
		log.Fatalf("Use a valid JWT key, initialize it in .env file maybe?")
	}

	if err := auth1.JWT_init(jwtSecret); err != nil {
		log.Fatalf("auth.JWT_init failed: %v\n", err)
	}

	fmt.Println("auth JWT initialized")

	email := os.Getenv("EMAIL")
	password := os.Getenv("PASSWORD_EM")
	host := os.Getenv("HOST_EM")
	port := os.Getenv("PORT_EM")

	if err := auth1.SMTP_init(email, password, host, port); err != nil {
		log.Fatalf("Initialize SMTP cred %v\n", err)
	}
	/*
	 * Gin connection comes here
	 * r is now a global variable
	 * It now has a lot of responsibility
	 */
	r = gin.Default()
	/*
	 * Session setup
	 */
	temp := os.Getenv("SESSION_SECRET")
	if temp == "" {
		log.Fatalf("Session secret missing?")
	}
	store := cookie.NewStore([]byte(temp))

	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   7776000,
		HttpOnly: true,
		Secure:   false, /*For production turn true ################### */
		SameSite: http.SameSiteLaxMode,
	})
	r.StaticFile("/favicon.svg", "../static/favicon.svg")
	r.Use(sessions.Sessions("auth_session", store))
	register_routes(r)
	r.GET("/favicon.ico", func(c *gin.Context) {
		c.Header("Content-Type", "image/svg+xml")
		c.File("../static/favicon.svg")
	})

	port = os.Getenv("PORT")
	if port == "" {
		log.Fatalf("auth.JWT_init failed: %v\n", err)
	}
	/*
	 * Server starts here
	 */
	log.Printf("Server starting on :%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v\n", err)
	}
}
