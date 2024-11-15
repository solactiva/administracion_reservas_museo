import { storeToRefs } from 'pinia'
import { loginEndpoint } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
	const authStore = useAuthStore()
	const { isLogin, loginForm, loginData, actionState } = storeToRefs(authStore)

	const login = async () => {
		localStorage.clear()
		loginData.value.show = false
		if (!loginForm.value.username || !loginForm.value.password) {
			loginData.value = {
				message: 'Por favor, rellene todos los campos.',
				show: true,
			}
			setTimeout(() => {
				loginData.value.show = false
			}, 3000)
			return
		}
		actionState.value = true
		const response = await loginEndpoint(loginForm.value)
		actionState.value = false
		if (response.success) {
			localStorage.setItem('token', response.data.token)
			localStorage.setItem('identificador', response.data.identificador)
			localStorage.setItem('rol', response.data.rol)
			authStore.loginAuth()
			return
		}
		loginData.value = {
			message: response.message,
			show: true,
		}
	}

	const logout = () => {
		localStorage.clear()
		// authStore.logoutAuth()
		window.location.href = '/login'
	}

	return { isLogin, loginForm, loginData, actionState, login, logout }
}
