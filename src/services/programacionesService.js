import axios from 'axios'

export const postMassiveProgramacion = async (programaciones) => {
	const res = await axios.post('/programaciones/massive', programaciones)
	return res.data
}
