export const APP_NAME = "Edu Institution Portal";

export const ROUTES = {
  home: "/",
  about: "/about",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  faculty: "/faculty",
  gallery: "/gallery",
  notices: "/notices",
  notice: (slug: string) => `/notices/${slug}`,
  contact: "/contact",
  admission: "/admission",
  // Dashboard
  dashboard: "/dashboard",
  dashboardCourses: "/dashboard/courses",
  dashboardFaculty: "/dashboard/faculty",
  dashboardEvents: "/dashboard/events",
  dashboardNotices: "/dashboard/notices",
  dashboardHomepage: "/dashboard/homepage",
  dashboardSettings: "/dashboard/settings",
  login: "/login",
  register: "/register",
  dashboardAttendance: "/dashboard/attendance",
} as const;
