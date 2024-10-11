import axios from 'axios'

export const postMassiveProgramacion = async (programaciones) => {
	const res = await axios.post('/programaciones/massive', programaciones)
	return res.data
}

export const getProgramacionesCalendar = async () => {
	try {
		const res = await axios.get('/programaciones/calendar')
		return res.data
	} catch (error) {
		console.error(error)
	}
}
