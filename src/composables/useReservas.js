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
	const { reserva, horario } = storeToRefs(reservaStore)

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
		reserva.value.fechaRegistro = new Date().toISOString()
		const response = await postReserva(reserva.value)
		return response
	}
	return {
		reserva,
		horario,

		getReservasPendientes,
		getReservasConfirmadas,
		getReservasRechazadas,
		getCities,
		getStates,
		registrarReserva,
		confirmarReserva,
		rechazarReserva,
	}
}
