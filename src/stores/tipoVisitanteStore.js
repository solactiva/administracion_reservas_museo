import { defineStore } from 'pinia'

export const useTipoVisitanteStore = defineStore('tipoVisitante', {
	state: () => ({
		tipoVisitantes: [],
		visitante: {},
	}),
})
