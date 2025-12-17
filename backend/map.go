package main

import "github.com/gin-gonic/gin"

/*
 * The sole purpose this file exists is to map all the APIs to its
 * appropriate files and functions within those files.
 *
 * This is like the API map.
 */

func registerRoutes(r *gin.Engine) {
	public := r.Group("/")
	{
		public.POST("/register", registerUser)
		public.POST("/login", loginUser)

		// public read endpoints
		public.GET("/projects/all", get_All_Proj)
		public.GET("/projects/ongoing", get_Ongoing)
		public.GET("/projects/upcoming", get_UpComing)
		public.GET("/projects/past", get_Past_Proj)
		public.GET("/deleted/all", getAllDeletedProjects)
	}

	protected := r.Group("/", AuthMiddleware())

	userRoutes := protected.Group("/", RequireRole("user"))
	{
		userRoutes.POST("/projects", createProject)
		userRoutes.DELETE("/projects/:id", deleteProject)
		userRoutes.GET("/deleted/my", getMyDeletedProjects)

		userRoutes.POST("/projects/:id/maintainers", addMaintainer)
		userRoutes.DELETE("/projects/:id/maintainers/:user_id", deleteMaintainer)

		userRoutes.POST("/projects/:id/contributors", addContributor)
		userRoutes.DELETE("/projects/:id/contributors/:user_id", deleteContributor)

		userRoutes.PATCH("/projects/:id/status", updateProjectStatus)
	}

	// admin-level
	adminRoutes := protected.Group("/admin", RequireRole("admin"))
	{
		adminRoutes.GET("/pending", getPendingProjects)
		adminRoutes.POST("/approve/:id", approveProject)
		adminRoutes.POST("/reject/:id", rejectProject)
		adminRoutes.GET("/deleted/all", getAllDeletedProjects)
	}

	// superadmin-level
	superadminRoutes := protected.Group("/superadmin", RequireRole("superadmin"))
	{
		superadminRoutes.GET("/admin/pending", getPendingProjects)
		superadminRoutes.POST("/admin/approve/:id", approveProject)
		superadminRoutes.POST("/admin/reject/:id", rejectProject)

		superadminRoutes.GET("/deleted/all", getAllDeletedProjects)

		superadminRoutes.POST("/roles/superadmin", assignSuperAdmin)
		superadminRoutes.POST("/roles/admin", assignAdmin)
		superadminRoutes.DELETE("/roles/admin", revokeAdmin)
	}
}
