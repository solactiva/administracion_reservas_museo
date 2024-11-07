import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
	state: () => {
		return {
			usuario: {
				identificador: '',
				nombreCompleto: '',
				correo: '',
				password: '',
				role: '',
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
