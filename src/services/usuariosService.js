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

export const updateUsuario = async (usuario) => {
	try {
		const res = await axios.put(
			`/usuarios?id=${usuario.identificador}`,
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
		const res = await axios.delete(`/usuarios?id=${id}`)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getUsuarioPerfil = async (id) => {
	try {
		const res = await axios.get(`/usuario/perfil?id=${id}`)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateUsuarioPerfil = async (usuario) => {
	try {
		const res = await axios.put(
			`/usuario/perfil?id=${usuario.identificador}`,
			usuario
		)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateUsuarioPassword = async (usuario) => {
	try {
		const res = await axios.put(
			`/usuario/password?id=${usuario.identificador}`,
			usuario
		)
		return res.data
	} catch (error) {
		console.log(error)
		throw error
	}
}
