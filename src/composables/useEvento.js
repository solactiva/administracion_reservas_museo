import { storeToRefs } from 'pinia'
import { getEventos } from '@/services/eventosService'
import { useEventoStore } from '@/stores/eventoStore'

export const useEvento = () => {
	const eventoStore = useEventoStore()
	const { evento } = storeToRefs(eventoStore)

	const cargarEvento = async (idEvento) => {
		const response = await getEventos(idEvento)
		evento.value = response.data
	}

	return {
		evento,

		cargarEvento,
	}
}
