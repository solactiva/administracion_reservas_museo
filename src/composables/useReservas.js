import {
	getReservas,
	postConfirmacion,
	postRechazo,
} from '@/services/reservasService'

export const useReservas = () => {
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
	return {
		getReservasPendientes,
		getReservasConfirmadas,
		getReservasRechazadas,
		confirmarReserva,
		rechazarReserva,
	}
}
