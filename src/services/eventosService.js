import axios from 'axios'

export const getEvento = async (idEvento) => {
	const res = await axios.get(`/eventos?idevento=${idEvento}`)
	return res.data
}

export const getEventos = async () => {
	const res = await axios.get('/eventos')
	return res.data
}
