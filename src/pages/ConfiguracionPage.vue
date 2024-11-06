<template>
	<div class="my-5 text-xl text-primary font-bold">Configuraciones</div>
	<div class="flex flex-col md:flex-row h-full gap-4">
		<!-- Sidebar -->
		<div class="md:w-64">
			<Menu :model="menuOptions" :style="{ border: 'none' }" />
		</div>

		<!-- Content Area -->
		<div class="flex-1 mb-5">
			<Card>
				<template #title>{{ activeMenuOption.label }} </template>
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
import { GeneralForm, PerfilForm } from '@/components/Configuraciones'

const activeSection = ref('profile')
const menuOptions = [
	{
		icon: 'pi pi-user',
		label: 'Perfil',
		id: 'profile',
		command: () => setActiveSection('profile'),
		component: PerfilForm,
	},
	{
		icon: 'pi pi-key',
		label: 'Seguridad',
		id: 'security',
		command: () => setActiveSection('security'),
	},
	{
		icon: 'pi pi-bell',
		label: 'Notificaciones',
		id: 'notifications',
		command: () => setActiveSection('notifications'),
	},
	{
		separator: true,
	},
	{
		icon: 'pi pi-cog',
		label: 'General Aplicación',
		id: 'general',
		command: () => setActiveSection('general'),
		component: GeneralForm,
	},
]

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
