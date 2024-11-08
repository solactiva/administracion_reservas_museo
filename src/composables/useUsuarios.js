import { storeToRefs } from 'pinia'
import {
	getUsuarios,
	getUsuarioPerfil,
	updateUsuarioPerfil,
	updateUsuarioPassword,
	createUsuario,
} from '@/services/usuariosService'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useToast } from 'primevue'

export const useUsuarios = () => {
	const toast = useToast()
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

	const cargarPerfil = async (identificador) => {
		interactividad.value.loading = true
		const response = await getUsuarioPerfil(identificador)
		interactividad.value.loading = false
		if (response.success) {
			usuario.value = { ...usuario.value, ...response.data }
		}
	}

	const actualizarPerfil = async ({ valid }) => {
		if (!valid) return
		interactividad.value.action = true
		const response = await updateUsuarioPerfil(usuario.value)
		interactividad.value.action = false
		if (response.success) {
			toast.add({
				severity: 'success',
				summary: 'Perfil actualizado',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: response.message,
				life: 3000,
			})
		}
	}

	const actualizarContrasena = async ({ valid }) => {
		if (!valid) return
		interactividad.value.action = true
		const response = await updateUsuarioPassword(usuario.value)
		interactividad.value.action = false
		if (response.success) {
			toast.add({
				severity: 'success',
				summary: 'Contraseña actualizada',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: response.message,
				life: 3000,
			})
		}
	}

	return {
		usuarios,
		usuario,
		interactividad,
		cargarPerfil,
		actualizarPerfil,
		actualizarContrasena,
	}
}
