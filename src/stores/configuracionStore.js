import { defineStore } from 'pinia'

export const useConfiguracionStore = defineStore('configuracion', {
	state: () => {
		return {
			configuracion: {
				identificador: '',
				qrPago: '',
				tiempoEspera: 0,
				urlShare: '',
			},
			loading: false,
		}
	},
})
