import { storeToRefs } from 'pinia'
import {
	getConfiguracion,
	putConfiguracion,
} from '@/services/configuracionesService'
import { useConfiguracionStore } from '@/stores/configuracionStore'
import { useToast } from 'primevue/usetoast'

export const useConfiguraciones = () => {
	const toast = useToast()
	const { configuracion, loading } = storeToRefs(useConfiguracionStore())

	const cargarConfiguracion = async () => {
		const response = await getConfiguracion()
		configuracion.value = response.data
	}

	const actualizarConfiguracion = async () => {
		loading.value = true
		const response = await putConfiguracion(configuracion.value)
		loading.value = false
		if (response.success) {
			toast.add({
				severity: 'success',
				summary: 'Configuración actualizada',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al actualizar',
				detail:
					'Ocurrió un error al actualizar, comuníquese con el administrador',
				life: 5000,
			})
		}
	}

	return {
		configuracion,
		loading,
		cargarConfiguracion,
		actualizarConfiguracion,
	}
}
