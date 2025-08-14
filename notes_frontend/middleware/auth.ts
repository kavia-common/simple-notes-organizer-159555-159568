export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  const auth = useAuth()
  if (!auth.isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }
  if (auth.isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})
