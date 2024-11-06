import { storeToRefs } from 'pinia'
import {
	getConfiguracion,
	putConfiguracion,
} from '@/services/configuracionesService'
import { useConfiguracionStore } from '@/stores/configuracionStore'
import { useToast } from 'primevue/usetoast'

export const useConfiguraciones = () => {
	const toast = useToast()
	const { configuracion, interactividad } = storeToRefs(useConfiguracionStore())

	const cargarConfiguracion = async () => {
		interactividad.value.loading = true
		const response = await getConfiguracion()
		configuracion.value = response.data
		interactividad.value.loading = false
	}

	const actualizarConfiguracion = async () => {
		interactividad.value.action = true
		const response = await putConfiguracion(configuracion.value)
		interactividad.value.action = false
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
		interactividad,
		cargarConfiguracion,
		actualizarConfiguracion,
	}
}
