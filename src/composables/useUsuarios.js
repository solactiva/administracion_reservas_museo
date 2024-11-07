import { storeToRefs } from 'pinia'
import {
	getUsuarios,
	getUsuario,
	createUsuario,
} from '@/services/usuariosService'
import { useUsuarioStore } from '@/stores/usuarioStore'

export const useUsuarios = () => {
	const usuarioStore = useUsuarioStore()
	const { usuarios, usuario, interactividad } = storeToRefs(usuarioStore)

	const loadUsuarios = async () => {
		const response = await getUsuarios()
		return response.data
	}

	const registrarUsuario = async (usuario) => {
		const response = await createUsuario(usuario)
		return response
	}

	const loadUsuario = async (identificador) => {
		interactividad.value.loading = true
		const response = await getUsuario(identificador)
		interactividad.value.loading = false
		if (response.success) {
			usuario.value = response.data
		}
	}

	return {
		usuarios,
		usuario,
		interactividad,
		loadUsuarios,
		loadUsuario,
		registrarUsuario,
	}
}
