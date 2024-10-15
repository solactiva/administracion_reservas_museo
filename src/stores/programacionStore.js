import { defineStore } from 'pinia'

export const useProgramacionStore = defineStore('programacion', {
	state: () => {
		return {
			programaciones: [],
			calendar: [],
			interactividad: {
				action: false,
				loading: false,
				visible: false,
			},
			programacionSeleccionada: {
				identificador: crypto.randomUUID(),
				fecha: '',
				inicioEvento: '',
				evento: {},
				reservas: [],
				spots: 20,
				finEvento: '',
				activo: true,
			},
		}
	},
	actions: {
		updateDrop(payload) {
			const { id, start, end } = payload
			const evento = this.programaciones.find((evento) => evento.id === id)

			evento.start = start
			evento.end = end
		},
	},
})
