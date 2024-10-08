import axios from 'axios'

export const getEvento = async (idEvento) => {
	const res = await axios.get(`/eventos?idevento=${idEvento}`)
	return res.data
}

export const getEventos = async () => {
	const res = await axios.get('/eventos')
	return res.data
}

export const postEvento = async (evento) => {
	const res = await axios.post('/eventos', evento)
	return res.data
}

export const putEvento = async (evento) => {
	const res = await axios.put('/eventos', evento)
	return res.data
}

export const deleteEvento = async (idEvento) => {
	const res = await axios.delete(`/eventos?idevento=${idEvento}`)
	return res.data
}
