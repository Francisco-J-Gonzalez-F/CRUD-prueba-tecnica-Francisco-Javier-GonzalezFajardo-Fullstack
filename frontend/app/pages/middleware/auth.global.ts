export default defineNuxtRouteMiddleware(async (to) => {
  const { user, me } = useAuth();

  const publicRoutes = ['/login'];
  const isPublic = publicRoutes.includes(to.path);

  // solo en cliente (evita líos de cookies en SSR)
  if (process.client && !user.value) {
    await me();
  }

  // No logueado => si intenta entrar a rutas privadas, lo mandas al login
  if (!user.value && !isPublic) {
    return navigateTo('/login');
  }

  // Logueado => si intenta entrar al login, lo mandas al home del CRUD
  if (user.value && isPublic) {
    return navigateTo('/');
  }
});
