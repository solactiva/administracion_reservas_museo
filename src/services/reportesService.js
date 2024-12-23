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

export const generatePdfReport = async (json) => {
	try {
		const dataStr = JSON.stringify(json)
		const response = await axios.get(`/pdfReport?parametros=${dataStr}`, {
			responseType: 'blob',
		})
		return response.data
	} catch (error) {
		console.error(error)
	}
}
