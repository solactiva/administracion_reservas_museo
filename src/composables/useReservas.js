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

export const useReservas = () => {
	const reservaStore = useReservaStore()
	const { reserva, horario, world, selectedPlace, interactividad } =
		storeToRefs(reservaStore)

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

	const getReservasPendientes = async () => {
		const response = await getReservas('pendiente')
		return response.data
	}
	const getReservasConfirmadas = async () => {
		const response = await getReservas('confirmado')
		return response.data
	}
	const getReservasRechazadas = async () => {
		const response = await getReservas('rechazado')
		return response.data
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
		reserva.value.cliente.pais = selectedPlace.value.pais.country
		reserva.value.cliente.estado = selectedPlace.value.estado.name
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
		const response = await postReserva(reserva.value)
		return response
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

		loadStates,
		loadCities,
		getReservasPendientes,
		getReservasConfirmadas,
		getReservasRechazadas,
		registrarReserva,
		confirmarReserva,
		rechazarReserva,
		cleanReserva,
	}
}
