import {
	getTipoVisitante,
	getTipoVisitantes,
	postTipoVisitante,
	putTipoVisitante,
} from '@/services/tipoVisitanteService'
import { ref } from 'vue'

export const useTipoVisitantes = () => {
	const tipoVisitantes = ref([])
	const visitante = ref({
		identificador: crypto.randomUUID(),
		nombre: '',
		descripcion: '',
	})

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

	return {
		visitante,
		tipoVisitantes,
		fetchTipoVisitantes,
		fetchTipoVisitante,
		createTipoVisitante,
		updateTipoVisitante,
	}
}
