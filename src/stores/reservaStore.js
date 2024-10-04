import { defineStore } from 'pinia'

export const useReservaStore = defineStore('reserva', {
	state: () => {
		return {
			reserva: {
				identificador: crypto.randomUUID(),
				idProg: '',
				cliente: {
					identificador: crypto.randomUUID(),
					nombre: '',
					email: '',
					telefono: '',
				},
				cantidad: [],
				cantidadAdicional: [],
				cantidadTotal: 0,
				cantidadTotalAdicional: 0,
				pago: {
					total: 0,
					comprobante: null,
				},
				fechaRegistro: '',
			},
			horario: {
				fecha: null,
				inicioEvento: null,
				finEvento: null,
				spots: 0,
			},
			world: {
				states: [],
				cities: [],
			},
			selectedPlace: {
				pais: {},
				estado: {},
			},
			interactividad: {
				loading: false,
				visible: false,
			},
		}
	},
	actions: {
		resetStore() {
			this.$reset()
		},
	},
})
