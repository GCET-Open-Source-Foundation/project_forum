package main

import "github.com/gin-gonic/gin"

/*
 * The sole purpose this file exists is to map all the APIs to its
 * appropriate files and functions within those files.
 *
 * This is like the API map.
 */

func register_routes(r *gin.Engine) {
	/*
	 * Static sites
	 */
	r.Static("/static", "../static")

	/*
	 * Routes
	 */
	ui := r.Group("/")
	{
		ui.GET("/", route_home)
		ui.GET("/login", route_login)
		ui.GET("/register", route_register)
		ui.GET("/create-project", route_create_project)
		ui.GET("projects/:id", route_project_view)

	}

	api := r.Group("/api")
	{
		api.POST("/register", register_user)
		api.POST("/otp", send_otp)
		api.POST("/login", login_user)
		api.GET("/getuser", getuser)
		api.GET("/issudo", issudo)
		api.GET("/isadmin", isadmin)
		api.POST("/logout", logout)
	}

	user_routes := r.Group("/projects/api")
	{
		user_routes.POST("/create-projects", create_project)
		user_routes.GET("/getall", get_all_projects)
		user_routes.DELETE("/delete/:id", delete_project)
		user_routes.GET("/:id", get_project)
	}
}
