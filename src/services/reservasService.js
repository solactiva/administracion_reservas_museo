import axios from 'axios'

export const getReservas = async (estado) => {
	const response = await axios.get(`/confirmaciones?estado=${estado}`)
	return response.data
}

export const postConfirmacion = async (reserva) => {
	const response = await axios.post('/confirmaciones', reserva)
	return response.data
}

export const postRechazo = async (reserva) => {
	const response = await axios.post('/rechazos', reserva)
	return response.data
}
