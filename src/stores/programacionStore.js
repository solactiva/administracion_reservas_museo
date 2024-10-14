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
			programacionSeleccionada: {},
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
