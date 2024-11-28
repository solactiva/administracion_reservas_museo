import axios from 'axios'

export const getReserva = async (idReserva) => {
	try {
		const response = await axios.get(`/reservas/admin?idReserva=${idReserva}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const getReservas = async (idEvento) => {
	try {
		const response = await axios.get(`/reservas/admin?idEvento=${idEvento}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
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

export const deleteReserva = async (reserva) => {
	try {
		const response = await axios.post('/reservas/admin/eliminar', reserva)
		return response.data
	} catch (error) {
		console.error(error)
	}
}
