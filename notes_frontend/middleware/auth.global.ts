export default defineNuxtRouteMiddleware((to) => {
  // Run only on client to access localStorage-backed state
  if (process.server) return
  const auth = useAuth()
  if (!auth.isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }
  if (auth.isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})
