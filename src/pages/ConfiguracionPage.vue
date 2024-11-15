<template>
	<div class="my-5 text-xl text-primary font-bold">Configuraciones</div>
	<div class="flex flex-col md:flex-row h-full gap-4">
		<!-- Sidebar -->
		<div class="md:w-64">
			<Menu :model="filteredMenuOptions" :style="{ border: 'none' }" />
		</div>

		<!-- Content Area -->
		<div class="flex-1 mb-5">
			<Card>
				<template #title>{{ activeMenuOption.label }} </template>
				<template #subtitle>{{ activeMenuOption.description }}</template>
				<template #content>
					<!-- Content for the selected section goes here -->
					<component :is="activeComponent" />
				</template>
			</Card>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
	GeneralForm,
	PerfilForm,
	SeguridadForm,
	UsuariosTable,
} from '@/components/Configuraciones'

const activeSection = ref('profile')
const menuOptions = [
	{
		icon: 'pi pi-user',
		label: 'Perfil',
		description: 'Configuración basica del perfil de usuario logeado',
		id: 'profile',
		command: () => setActiveSection('profile'),
		component: PerfilForm,
		visible: true,
	},
	{
		icon: 'pi pi-key',
		label: 'Seguridad',
		description: 'Configuración de seguridad y privacidad de la cuenta',
		id: 'security',
		command: () => setActiveSection('security'),
		component: SeguridadForm,
		visible: true,
	},
	{
		icon: 'pi pi-bell',
		label: 'Notificaciones',
		description: 'Configuración de las notificaciones y alertas',
		id: 'notifications',
		command: () => setActiveSection('notifications'),
		visible: true,
	},
	{
		separator: true,
		visible: localStorage.getItem('rol') === '1',
	},
	{
		icon: 'pi pi-cog',
		label: 'General Aplicación',
		description: 'Configuraciones generales de la aplicación',
		id: 'general',
		command: () => setActiveSection('general'),
		component: GeneralForm,
		visible: localStorage.getItem('rol') === '1',
	},
	{
		icon: 'pi pi-users',
		label: 'Usuarios',
		description: 'Administrador de usuarios y permisos',
		id: 'usuarios',
		command: () => setActiveSection('usuarios'),
		component: UsuariosTable,
		visible: localStorage.getItem('rol') === '1',
	},
]

const filteredMenuOptions = computed(() => {
	return menuOptions.filter((option) => option.visible)
})

const activeMenuOption = computed(() => {
	return menuOptions.find((option) => option.id === activeSection.value)
})

const activeComponent = computed(() => {
	return activeMenuOption.value.component
})

const setActiveSection = (id) => {
	activeSection.value = id
}
</script>
