import { storeToRefs } from 'pinia'
import {
	getUsuarios,
	createUsuario,
	updateUsuario,
	deleteUsuario,
	getUsuarioPerfil,
	updateUsuarioPerfil,
	updateUsuarioPassword,
} from '@/services/usuariosService'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useToast } from 'primevue'

export const useUsuarios = () => {
	const toast = useToast()
	const usuarioStore = useUsuarioStore()
	const { usuarios, usuario, usuarioPayload, interactividad } =
		storeToRefs(usuarioStore)

	const loadUsuarios = async () => {
		interactividad.value.loading = true
		const response = await getUsuarios()
		interactividad.value.loading = false
		if (response.success) {
			usuarios.value = response.data
		}
	}

	const cargarUsuarioEdit = (id) => {
		usuarioPayload.value = usuarios.value.find(
			(usuario) => usuario.identificador === id
		)
	}

	const registrarUsuario = async () => {
		const usuario = usuarioPayload.value
		usuario.identificador = crypto.randomUUID()
		interactividad.value.action = true
		const response = await createUsuario(usuario)
		interactividad.value.action = false
		if (response.success) {
			delete usuario.password
			delete usuario.confirmarContrasena
			usuarios.value.push(usuario)
			toast.add({
				severity: 'success',
				summary: 'Usuario registrado',
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

	const actualizarUsuario = async () => {
		const usuario = usuarioPayload.value
		interactividad.value.action = true
		const response = await updateUsuario(usuario)
		interactividad.value.action = false
		if (response.success) {
			delete usuario.password
			delete usuario.confirmarContrasena
			const index = usuarios.value.findIndex(
				(u) => u.identificador === usuario.identificador
			)
			usuarios.value[index] = usuario
			toast.add({
				severity: 'success',
				summary: 'Correcto!',
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

	const eliminarUsuario = async (id) => {
		interactividad.value.action = true
		const response = await deleteUsuario(id)
		interactividad.value.action = false
		if (response.success) {
			const index = usuarios.value.findIndex((u) => u.identificador === id)
			usuarios.value.splice(index, 1)
			toast.add({
				severity: 'success',
				summary: 'Eliminado!',
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

	const cleanUsuarioPayload = () => {
		usuarioPayload.value = {
			identificador: crypto.randomUUID(),
			nombreCompleto: '',
			correo: '',
			username: '',
			password: '',
			rol: '',
		}
	}

	return {
		usuarios,
		usuario,
		interactividad,
		usuarioPayload,
		cargarPerfil,
		actualizarPerfil,
		actualizarContrasena,
		loadUsuarios,
		registrarUsuario,
		cargarUsuarioEdit,
		cleanUsuarioPayload,
		actualizarUsuario,
		eliminarUsuario,
	}
}
