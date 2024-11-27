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
					descuento: 0,
					total: 0,
					totalDesc: 0,
					comprobante: null,
					metodoPago: '',
				},
				tipoReserva: 'onsite',
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
				action: false,
				visible: false,
			},
			reservas: [],
		}
	},
	actions: {
		resetStore() {
			const reservas = this.reservas
			this.$reset()
			this.reservas = reservas
		},
	},
	getters: {
		reservasPendientes() {
			return this.reservas.filter((reserva) => reserva.estado === 'pendiente')
		},
		reservasConfirmadas() {
			return this.reservas.filter((reserva) => reserva.estado === 'confirmado')
		},
		reservasRechazadas() {
			return this.reservas.filter((reserva) => reserva.estado === 'rechazado')
		},
	},
})
