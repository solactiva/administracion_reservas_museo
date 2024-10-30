import axios from 'axios'

export const loginEndpoint = async (payload) => {
	try {
		const res = await axios.post('/auth/login', payload)
		if (res.data.success) {
			axios.defaults.headers.common[
				'Authorization'
			] = `Bearer ${res.data.data.token}`
		}
		return res.data
	} catch (error) {
		console.error(error)
	}
}
