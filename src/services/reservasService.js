import axios from 'axios'

export const getReservas = async (estado) => {
	const response = await axios.get(`/confirmaciones?estado=${estado}`)
	return response.data
}

export const getStates = async (country) => {
	try {
		const response = await axios.get(`/countries?country=${country}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const getCities = async (state) => {
	try {
		const response = await axios.get(`/countries?state=${state}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const postConfirmacion = async (reserva) => {
	const response = await axios.post('/confirmaciones', reserva)
	return response.data
}

export const postRechazo = async (reserva) => {
	const response = await axios.post('/rechazos', reserva)
	return response.data
}

export const postReserva = async (reserva) => {
	try {
		const response = await axios.post('/reservas/admin', reserva)
		return response.data
	} catch (error) {
		console.error(error)
	}
}
