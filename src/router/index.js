import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		redirect: '/eventos',
	},
	{
		path: '/eventos',
		name: 'Eventos',
		component: () => import('@/pages/EventosView.vue'),
	},
	{
		path: '/reservas/:idEvento',
		name: 'Reservas',
		component: () => import('@/pages/ReservasView.vue'),
		children: [
			{
				path: 'pendientes',
				name: 'Pendientes',
				component: () => import('@/pages/PendientesPage.vue'),
			},
			{
				path: 'confirmados',
				name: 'Confirmados',
				component: () => import('@/pages/ConfirmadosPage.vue'),
			},
		],
	},
	{
		path: '/programaciones',
		name: 'Programaciones',
		component: () => import('@/pages/ProgramacionesView.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
