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
		}
	},
})
