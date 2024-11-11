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
			programacionGenerador: {
				dates: null,
				time: null,
				horarios: [],
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
		deleteProgramacion(id) {
			this.programaciones = this.programaciones.filter(
				(programacion) => programacion.id !== id
			)
		},
	},
})
