import { defineStore } from 'pinia'

export const useHorarioStore = defineStore('horario', {
	state: () => {
		return {
			horarios: [],
			action: false,
		}
	},
})
