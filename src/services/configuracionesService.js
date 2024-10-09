import axios from 'axios'

export const getConfiguracion = async () => {
	const res = await axios.get('/configuraciones')
	return res.data
}

export const putConfiguracion = async (configuracion) => {
	const res = await axios.put('/configuraciones', configuracion)
	return res.data
}
