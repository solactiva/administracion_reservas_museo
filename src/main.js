import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import router from './router'

import '@/config/axios'
import './assets/main.css'
import './assets/base.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(ToastService)
app.use(ConfirmationService)
app.use(router)
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			cssLayer: {
				name: 'primevue',
				order: 'tailwind-base, primevue, tailwind-utilities',
			},
			darkModeSelector: '.dark-mode',
		},
	},
})
app.mount('#app')
