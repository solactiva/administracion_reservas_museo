import { createApp, markRaw } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import pinia from './stores'
import router from './router'

import '@/config/axios'
import './assets/main.css'
// import './assets/base.css'
import 'primeicons/primeicons.css'

pinia.use(({ store }) => {
	store.router = markRaw(router)
})

const app = createApp(App)
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
app.use(pinia)
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
