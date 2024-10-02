import { defineStore } from 'pinia'

export const useEventoStore = defineStore('evento', {
	state: () => {
		return {
			evento: null,
		}
	},
})
