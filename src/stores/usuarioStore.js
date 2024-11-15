import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
	state: () => {
		return {
			usuario: {
				identificador: localStorage.getItem('identificador'),
			},
			usuarioPayload: {
				identificador: crypto.randomUUID(),
				nombreCompleto: '',
				correo: '',
				username: '',
				password: '',
				rol: 0,
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
