import axios from 'axios'

export const getEventos = async (idEvento) => {
	const res = await axios.get(`/eventos?idevento=${idEvento}`)
	return res.data
}
