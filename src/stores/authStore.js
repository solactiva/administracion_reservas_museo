import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
	state: () => {
		return {
			isLogin: false,
			loginForm: {
				username: '',
				password: '',
			},
			loginData: {
				message: '',
				show: false,
			},
			actionState: false,
		}
	},
	actions: {
		loginAuth() {
			this.isLogin = true
			this.router.push('/')
		},
		logoutAuth() {
			this.isLogin = false
			this.loginForm = {
				username: '',
				password: '',
			}
			this.router.push('/login')
		},
		async verifyJWT() {
			axios.defaults.headers.common[
				'Authorization'
			] = `Bearer ${localStorage.getItem('token')}`

			try {
				const res = await axios.get('/auth/verify')
				if (res.data.success) {
					this.isLogin = true
					return {
						success: true,
						message: 'Token verificado',
					}
				}

				return {
					success: false,
					message: 'Token no verificado',
				}
			} catch (error) {
				console.log(error)
				if (error.status === 403) {
					throw {
						success: false,
						message: error.response.data,
					}
				}
				throw {
					success: false,
					message:
						'Lo siento, parece que hemos perdido temporalmente la conexión con nuestra API. Estamos trabajando para solucionar el problema lo antes posible. Por favor, inténtelo de nuevo más tarde. Agradecemos su comprensión y paciencia.',
				}
			}
		},
	},
})
