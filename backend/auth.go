package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/*
 * Sends OTP?
 * What else should I say
 */
func send_otp(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"omitempty,email"`
		Username string `json:"username" binding:"omitempty,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	identifier := req.Email
	if identifier == "" {
		identifier = req.Username
	}

	if identifier == "" {
		c.JSON(400, gin.H{
			"error": "Email is required",
		})
		return
	}

	if err := auth1.SendOTP(identifier); err != nil {
		c.JSON(500, gin.H{
			"error": "Failed to send OTP",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "OTP sent successfully",
	})
}

/*
 * This file is to handle register and login API
 */
func register_user(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"omitempty,email"`
		Username string `json:"username" binding:"omitempty,email"`
		Password string `json:"password" binding:"required,min=8"`
		OTP      string `json:"otp" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	identifier := req.Email
	if identifier == "" {
		identifier = req.Username
	}

	if identifier == "" {
		c.JSON(400, gin.H{
			"error": "Email is required",
		})
		return
	}

	if !auth1.VerifyOTP(identifier, req.OTP) {
		c.JSON(401, gin.H{
			"error": "Invalid or expired OTP",
		})
		return
	}

	if err := auth1.Register_user(identifier, req.Password); err != nil {
		c.JSON(500, gin.H{
			"error": "User registration failed",
		})
		return
	}
	/*
	 * Gives a default user permission to everyone,
	 * cause in this situation everyone should be able to watch the project.
	 */
	auth1.Create_permissions(identifier, "meta", "user")
	c.JSON(201, gin.H{
		"message": "User registered successfully",
	})
}

/*
 * Logs in user
 */
func login_user(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"omitempty,email"`
		Username string `json:"username" binding:"omitempty,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	identifier := req.Email
	if identifier == "" {
		identifier = req.Username
	}

	if identifier == "" {
		c.JSON(400, gin.H{
			"error": "Email is required",
		})
		return
	}

	ok := auth1.Login_user(identifier, req.Password)
	if !ok {
		c.JSON(401, gin.H{
			"error": "Invalid credentials",
		})
		return
	}

	session := sessions.Default(c)

	session.Clear()

	session.Set("user", identifier)
	session.Set("authenticated", true)

	session.Options(sessions.Options{
		Path:     "/",
		MaxAge:   7776000,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	if err := session.Save(); err != nil {
		c.JSON(500, gin.H{
			"error": "Failed to create session",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Login successful",
	})
}

/*
 * Used to get the username from the identifier
 */
func get_username(c *gin.Context) string {
	session := sessions.Default(c)

	person, ok := session.Get("authenticated").(bool)
	if !ok || !person {
		return ""
	}

	user, ok := session.Get("user").(string)
	if !ok {
		return ""
	}

	return user
}

/*
 * Helper functions for APIs
 */
func getuser(c *gin.Context) {
	session := sessions.Default(c)

	auth, ok := session.Get("authenticated").(bool)
	if !ok || !auth {
		c.Status(http.StatusUnauthorized)
		return
	}

	user, ok := session.Get("user").(string)
	if !ok || user == "" {
		c.Status(http.StatusUnauthorized)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"username": user,
	})
}

func issudo(c *gin.Context) {
	str := get_username(c)
	isSudo := auth1.Check_permissions(str, "meta", "super-admin")

	c.JSON(http.StatusOK, gin.H{
		"value": isSudo,
	})
}

func isadmin(c *gin.Context) {
	str := get_username(c)
	isAdmin := auth1.Check_permissions(str, "meta", "admin")

	c.JSON(http.StatusOK, gin.H{
		"value": isAdmin,
	})
}

func logout(c *gin.Context) {
	session := sessions.Default(c)

	session.Clear()
	session.Save()

	c.Status(http.StatusOK)
}
