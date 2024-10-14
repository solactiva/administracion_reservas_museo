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

export const getProgramacion = async (id) => {
	try {
		const res = await axios.get(
			`/63646b30-3fbb-4b02-b434-5fc89c87dbde/programaciones/${id}`
		)
		return res.data
	} catch (error) {
		console.error(error)
	}
}

export const putProgramacion = async (programacion) => {
	try {
		const res = await axios.put(`/programaciones`, programacion)
		return res.data
	} catch (error) {
		console.error(error)
	}
}

export const deleteProgramacion = async (id) => {
	try {
		const res = await axios.delete(
			`/63646b30-3fbb-4b02-b434-5fc89c87dbde/programaciones/${id}`
		)
		return res.data
	} catch (error) {
		console.error(error)
	}
}
