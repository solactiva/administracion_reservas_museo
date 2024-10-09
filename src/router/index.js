import { createRouter, createWebHistory } from 'vue-router'

import ReservasView from '@/pages/ReservasView.vue'

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
		component: ReservasView,
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
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
