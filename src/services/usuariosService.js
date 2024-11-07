import axios from 'axios'

export const getUsuarios = async () => {
	try {
		const res = await axios.get('/usuarios')
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createUsuario = async (usuario) => {
	try {
		const res = await axios.post('/usuarios', usuario)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}
export const getUsuario = async (id) => {
	try {
		const res = await axios.get(
			`/0c185f40-9712-4340-b277-3ff9d7029c54/usuarios/${id}`
		)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateUsuario = async (usuario) => {
	try {
		const res = await axios.put(
			`/0c185f40-9712-4340-b277-3ff9d7029c54/usuarios/${usuario.id}`,
			usuario
		)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const deleteUsuario = async (id) => {
	try {
		const res = await axios.delete(
			`/0c185f40-9712-4340-b277-3ff9d7029c54/usuarios/${id}`
		)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}
