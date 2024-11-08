import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
	state: () => {
		return {
			usuario: {
				identificador: localStorage.getItem('identificador'),
			},
			usuarios: [],
			interactividad: {
				loading: false,
				action: false,
			},
		}
	},
	actions: {},
})
