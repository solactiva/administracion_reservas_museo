import axios from 'axios'

export const getTipoVisitantes = async () => {
	try {
		const response = await axios.get('/tipoVisitante')
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const getTipoVisitante = async (id) => {
	try {
		const response = await axios.get(`/tipoVisitante?identificador=${id}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const postTipoVisitante = async (tipoVisitante) => {
	try {
		const response = await axios.post('/tipoVisitante', tipoVisitante)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const putTipoVisitante = async (tipoVisitante) => {
	try {
		const response = await axios.post('/tipoVisitante/update', tipoVisitante)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export const deleteTipoVisitante = async (id) => {
	try {
		const response = await axios.post(`/tipoVisitante/delete`, {
			identificador: id,
		})
		return response.data
	} catch (error) {
		console.error(error)
	}
}
