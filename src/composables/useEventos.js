import { storeToRefs } from 'pinia'
import {
	getEventos,
	getEvento,
	postEvento,
	putEvento,
	deleteEvento,
} from '@/services/eventosService'
import { useEventoStore } from '@/stores/eventoStore'
import { useToast } from 'primevue/usetoast'

export const useEventos = () => {
	const toast = useToast()
	const eventoStore = useEventoStore()
	const { eventos, evento, eventoSelected, interactividad, itemsReservas } =
		storeToRefs(eventoStore)

	const cargarEvento = async (idEvento) => {
		const response = await getEvento(idEvento)
		evento.value = response.data
	}

	const cargarEventos = async () => {
		interactividad.value.action = true
		const response = await getEventos()
		interactividad.value.action = false
		eventos.value = response.data
		itemsReservas.value = response.data.map((el) => {
			return {
				label: el.nombre,
				icon: 'pi pi-circle-fill',
				route: `/reservas/${el.identificador}`,
			}
		})
	}

	const cargarEventoUpdate = (idEvento) => {
		eventoSelected.value = eventos.value.find(
			(evento) => evento.identificador === idEvento
		)
	}

	const crearEvento = async (evento) => {
		interactividad.value.loading = true
		const response = await postEvento(evento)
		interactividad.value.loading = false

		if (response.success) {
			eventos.value.push(evento)
			interactividad.value.visible = false

			toast.add({
				severity: 'success',
				summary: 'Evento creado',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al crear',
				detail: 'Ocurrio un error al crear, comuniquese con el administrador',
				life: 3000,
			})
		}
	}

	const actualizarEvento = async (evento) => {
		interactividad.value.loading = true
		const response = await putEvento(evento)
		interactividad.value.loading = false

		if (response.success) {
			const index = eventos.value.findIndex(
				(e) => e.identificador === evento.identificador
			)
			eventos.value[index] = evento
			interactividad.value.visible = false

			toast.add({
				severity: 'success',
				summary: 'Evento actualizado',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al actualizar',
				detail:
					'Ocurrio un error al actualizar, comuniquese con el administrador',
				life: 3000,
			})
		}
	}

	const eliminarEvento = async (idEvento) => {
		interactividad.value.loading = true
		const response = await deleteEvento(idEvento)
		interactividad.value.loading = false

		if (response.success) {
			eventos.value = eventos.value.filter(
				(evento) => evento.identificador !== idEvento
			)

			toast.add({
				severity: 'success',
				summary: 'Evento eliminado',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al eliminar',
				detail:
					'Ocurrio un error al eliminar, comuniquese con el administrador',
				life: 3000,
			})
		}
	}

	const cleanEvento = () => {
		eventoSelected.value = {
			identificador: crypto.randomUUID(),
			nombre: '',
			descripcion: '',
			duracion: 0,
			capacidad: 0,
			precios: [],
			diasNoActivo: [],
			activo: false,
		}
	}

	return {
		evento,
		eventos,
		eventoSelected,
		interactividad,
		itemsReservas,

		cargarEvento,
		cargarEventos,
		cargarEventoUpdate,
		crearEvento,
		actualizarEvento,
		eliminarEvento,
		cleanEvento,
	}
}
