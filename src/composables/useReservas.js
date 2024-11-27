import { storeToRefs } from 'pinia'
import {
	getReservas,
	getStates,
	getCities,
	postConfirmacion,
	postRechazo,
	postReserva,
} from '@/services/reservasService'
import { useReservaStore } from '@/stores/reservaStore'
import { useToast } from 'primevue/usetoast'

export const useReservas = () => {
	const reservaStore = useReservaStore()
	const {
		reserva,
		horario,
		world,
		selectedPlace,
		interactividad,
		reservas,
		reservasConfirmadas,
		reservasPendientes,
		reservasRechazadas,
	} = storeToRefs(reservaStore)
	const toast = useToast()

	const loadStates = async (country_code) => {
		world.value.states = []
		world.value.cities = []
		interactividad.value.loading = true
		world.value.states = await getStates(country_code)
		interactividad.value.loading = false
	}

	const loadCities = async (state_id) => {
		world.value.cities = []
		interactividad.value.loading = true
		world.value.cities = await getCities(state_id)
		interactividad.value.loading = false
	}

	const loadReservas = async (idEvento) => {
		interactividad.value.loading = true
		const response = await getReservas(idEvento)
		interactividad.value.loading = false
		if (response.success) {
			reservas.value = getReservaDateFormated(response.data)
		}
	}

	const getReservaDateFormated = (data) => {
		return [...(data || [])].map((d) => {
			const [year, month, day] = d.programacion.fecha.split('-')
			d.fechaRegistro = new Date(d.fechaRegistro)
			d.programacion.fecha = new Date(year, month - 1, day)

			return d
		})
	}

	const confirmarReserva = async (reserva) => {
		const response = await postConfirmacion(reserva)
		return response
	}
	const rechazarReserva = async (reserva) => {
		const response = await postRechazo(reserva)
		return response
	}
	const registrarReserva = async () => {
		reserva.value.idProg = horario.value.identificador
		reserva.value.cliente.nombre = reserva.value.cliente.nombre.toUpperCase()
		reserva.value.cliente.email = reserva.value.cliente.email.toLowerCase()
		reserva.value.fechaRegistro = new Date().toISOString()
		reserva.value.cantidadTotal = reserva.value.cantidad.reduce(
			(acc, curr) => acc + curr.cantidad,
			0
		)
		reserva.value.cantidadTotalAdicional =
			reserva.value.cantidadAdicional.reduce(
				(acc, curr) => acc + curr.cantidad,
				0
			)
		interactividad.value.action = true
		const response = await postReserva(reserva.value)
		interactividad.value.action = false

		if (response.success) {
			reservas.value.push(reserva.value)
			toast.add({
				severity: 'success',
				summary: 'Reserva registrada',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al registrar reserva',
				detail: response.message,
				life: 3000,
			})
		}
	}

	const cleanReserva = () => {
		reservaStore.resetStore()
	}

	return {
		reserva,
		horario,
		world,
		selectedPlace,
		interactividad,
		reservasConfirmadas,
		reservasPendientes,
		reservasRechazadas,

		loadStates,
		loadCities,
		loadReservas,
		registrarReserva,
		confirmarReserva,
		rechazarReserva,
		cleanReserva,
	}
}
