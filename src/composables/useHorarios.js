import { storeToRefs } from 'pinia'
import { getHorarios } from '@/services/horariosService'
import { useHorarioStore } from '@/stores/horarioStore'

export const useHorarios = () => {
	const horarioStore = useHorarioStore()
	const { horarios, action } = storeToRefs(horarioStore)

	const cargarHorarios = async (fecha, idEvento) => {
		action.value = true
		const res = await getHorarios(fecha, idEvento)
		const resSorted = res.data.sort((a, b) => {
			return a.inicioEvento.localeCompare(b.inicioEvento)
		})
		horarios.value = resSorted
		action.value = false
	}

	return {
		horarios,
		action,

		cargarHorarios,
	}
}
