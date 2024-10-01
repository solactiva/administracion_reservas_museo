import { createWebHistory, createRouter, createMemoryHistory } from 'vue-router'

import ReservasView from '@/pages/ReservasView.vue'

const routes = [
	{
		path: '/',
		redirect: '/reservas/pendientes',
	},
	{
		path: '/reservas',
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
	history: createMemoryHistory(),
	routes,
})

export default router
