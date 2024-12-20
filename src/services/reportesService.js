import axios from 'axios'

export const getDatosReporte = async (json) => {
	try {
		const jsonStr = JSON.stringify(json)
		const response = await axios.get(`/reportes/default?parametros=${jsonStr}`)
		return response.data
	} catch (error) {
		console.error(error)
	}
}
