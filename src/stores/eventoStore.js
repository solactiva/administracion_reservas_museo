import { defineStore } from 'pinia'

export const useEventoStore = defineStore('evento', {
	state: () => {
		return {
			evento: null,
			eventos: [],
			eventoSelected: {
				identificador: crypto.randomUUID(),
				nombre: '',
				descripcion: '',
				duracion: 0,
				capacidad: 0,
				precios: [],
				diasNoActivo: [],
				activo: false,
			},
			interactividad: {
				loading: false,
				action: false,
				visible: false,
				visibleProgramacion: false,
			},
			itemsReservas: [],
		}
	},
})
