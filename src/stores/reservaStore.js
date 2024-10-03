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
				cantidadTotal: 0,
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
		}
	},
	actions: {
		resetStore() {
			this.$reset()
		},
	},
})
