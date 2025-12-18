package main

import "github.com/gin-gonic/gin"

/*
 * All the UI routing happens here
 * So all the static HTMLs are returned here
 * If this is what you are looking for
 * You are in the right place.
 */

/*
 * register ui
 */
func route_register(c *gin.Context) {
	c.File("../static/register/index.html")
}

/*
 * Login ui
 */
func route_login(c *gin.Context) {
	c.File("../static/login/index.html")
}

/*
 * Home
 */
func route_home(c *gin.Context) {
	c.File("../static/home/index.html")
}

/*
 * Create project
 */
func route_create_project(c *gin.Context) {
	c.File("../static/create-project/index.html")
}

/*
 * Create project
 */
func route_project_view(c *gin.Context) {
	c.File("../static/project/index.html")
}
