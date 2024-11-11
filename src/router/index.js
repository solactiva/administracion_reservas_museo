import { createRouter, createWebHistory } from 'vue-router'
import pinia from '@/stores'
import { useAuthStore } from '@/stores/authStore'

const routes = [
	{
		path: '/',
		name: 'Home',
		meta: {
			requiresAuth: true,
			title: 'Administrador de Reservas',
		},
		component: () => import('@/pages/HomePage.vue'),
		redirect: '/eventos',
		children: [
			{
				path: '/eventos',
				name: 'Eventos',
				component: () => import('@/pages/EventosView.vue'),
			},
			{
				path: '/reservas/:idEvento',
				name: 'Reservas',
				component: () => import('@/pages/ReservasView.vue'),
			},
			{
				path: '/programaciones',
				name: 'Programaciones',
				component: () => import('@/pages/ProgramacionesView.vue'),
			},
			{
				path: '/configuracion',
				name: 'Configuracion',
				component: () => import('@/pages/ConfiguracionPage.vue'),
			},
		],
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/pages/LoginPage.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('@/pages/NotFoundPage.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore(pinia)
	let isLogin = authStore.isLogin
	const isToken = localStorage.getItem('token')
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

	if (to.meta.title) {
		document.title = to.meta.title
	}

	if (requiresAuth) {
		if (!isToken) {
			next({ name: 'Login' })
			return
		}

		if (!isLogin) {
			try {
				const verifyToken = await authStore.verifyJWT()
				console.log(verifyToken)
				if (!verifyToken.success) {
					authStore.loginData = {
						message: verifyToken.message,
						show: true,
					}
					next({ name: 'Login' })
					return
				}
				isLogin = true
			} catch (error) {
				console.log(error)
				authStore.loginData = {
					message: error.message,
					show: true,
				}
				next({ name: 'Login' })
				return
			}
		}
	}
	next()
	return
})

export default router
