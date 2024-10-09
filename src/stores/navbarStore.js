import { defineStore } from 'pinia'

export const useNavbarStore = defineStore('navbar', {
	state: () => {
		return {
			navbarHeader: [
				{
					label: 'Eventos',
					icon: 'pi pi-star',
					route: '/eventos',
				},
				{
					label: 'Reservas',
					icon: 'pi pi-book',
					items: [],
				},

				{
					label: 'Programaciones',
					icon: 'pi pi-calendar',
				},
				{
					label: 'Configuraciones',
					icon: 'pi pi-cog',
				},
			],
			navbarTabs: [
				{ route: 'pendientes', label: 'Pendientes', icon: 'pi pi-hourglass' },
				{
					route: 'confirmados',
					label: 'Confirmados',
					icon: 'pi pi-check-square',
				},
			],
		}
	},
})
