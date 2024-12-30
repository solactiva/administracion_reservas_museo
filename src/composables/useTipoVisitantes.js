import {
	getTipoVisitante,
	getTipoVisitantes,
	postTipoVisitante,
	putTipoVisitante,
	deleteTipoVisitante,
} from '@/services/tipoVisitanteService'
import { useTipoVisitanteStore } from '@/stores/tipoVisitanteStore'
import { storeToRefs } from 'pinia'

export const useTipoVisitantes = () => {
	const tipoVisitanteStore = useTipoVisitanteStore()
	const { tipoVisitantes, visitante } = storeToRefs(tipoVisitanteStore)

	const fetchTipoVisitantes = async () => {
		const response = await getTipoVisitantes()
		if (response.success) {
			tipoVisitantes.value = response.data
		}
	}

	const fetchTipoVisitante = async (id) => {
		const response = await getTipoVisitante(id)
		if (response.success) {
			return response.data
		}
	}

	const createTipoVisitante = async (tipoVisitante) => {
		const response = await postTipoVisitante(tipoVisitante)
		if (response.success) {
			tipoVisitantes.value.push(tipoVisitante)
			console.log(response.message)
		}
	}

	const updateTipoVisitante = async (tipoVisitante) => {
		const response = await putTipoVisitante(tipoVisitante)
		if (response.success) {
			const index = tipoVisitantes.value.findIndex(
				(t) => t.identificador === tipoVisitante.identificador
			)
			tipoVisitantes.value[index] = tipoVisitante
		}
	}

	const eliminarTipoVisitante = async (id) => {
		const response = await deleteTipoVisitante(id)
		if (response.success) {
			tipoVisitantes.value = tipoVisitantes.value.filter(
				(t) => t.identificador !== id
			)
		}
	}

	return {
		visitante,
		tipoVisitantes,
		fetchTipoVisitantes,
		fetchTipoVisitante,
		createTipoVisitante,
		updateTipoVisitante,
		eliminarTipoVisitante,
	}
}
