import { storeToRefs } from 'pinia'
import { getEventos, getEvento } from '@/services/eventosService'
import { useEventoStore } from '@/stores/eventoStore'

export const useEventos = () => {
	const eventoStore = useEventoStore()
	const { eventos, evento, eventoSelected } = storeToRefs(eventoStore)

	const cargarEvento = async (idEvento) => {
		const response = await getEvento(idEvento)
		evento.value = response.data
	}

	const cargarEventos = async () => {
		const response = await getEventos()
		eventos.value = response.data
	}

	const cargarEventoUpdate = (idEvento) => {
		eventoSelected.value = eventos.value.find(
			(evento) => evento.identificador === idEvento
		)
	}

	const cleanEvento = () => {
		console.log('Limpiando...')
		eventoStore.resetEventoSelected()
	}

	return {
		evento,
		eventos,
		eventoSelected,

		cargarEvento,
		cargarEventos,
		cargarEventoUpdate,
		cleanEvento,
	}
}
