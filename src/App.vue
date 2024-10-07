<template>
	<main class="container mx-auto px-4 lg:px-36 py-0">
		<Toast position="top-center" :pt="{ root: 'w-11/12' }" />
		<ConfirmDialog></ConfirmDialog>
		<Menubar :model="items">
			<template #start>
				<h1 class="text-lg font-bold text-primary">
					<a href="/">MUSEO</a>
				</h1>
			</template>
			<template #item="{ item, props, hasSubmenu }">
				<router-link
					v-if="item.route"
					v-slot="{ href, navigate }"
					:to="item.route"
					custom
				>
					<a v-ripple :href="href" v-bind="props.action" @click="navigate">
						<span :class="item.icon" />
						<span class="ml-2">{{ item.label }}</span>
					</a>
				</router-link>
				<a
					v-else
					v-ripple
					:href="item.url"
					:target="item.target"
					v-bind="props.action"
				>
					<span :class="item.icon" />
					<span class="ml-2">{{ item.label }}</span>
					<span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
				</a>
			</template>
			<template #end>
				<Button
					icon="pi pi-moon"
					iconPos="right"
					@click="toggleTheme"
					size="small"
					class="p-button-rounded p-button-text"
				/>
			</template>
		</Menubar>
		<RouterView />
	</main>
</template>

<script setup>
import { ref } from 'vue'
const toggleTheme = () => {
	const theme = document.querySelector('html')
	theme.classList.toggle('dark-mode')
	const icon = document.querySelector('.pi')
	icon.classList.toggle('pi-moon')
	icon.classList.toggle('pi-sun')
}

const items = ref([
	{
		label: 'Reservas',
		icon: 'pi pi-book',
		route: '/',
	},
	{
		label: 'Eventos',
		icon: 'pi pi-star',
		route: '/eventos',
	},
	{
		label: 'Programaciones',
		icon: 'pi pi-calendar',
	},
	{
		label: 'Configuraciones',
		icon: 'pi pi-cog',
		items: [
			{
				label: 'Core',
				icon: 'pi pi-bolt',
				shortcut: '⌘+S',
			},
			{
				label: 'Blocks',
				icon: 'pi pi-server',
				shortcut: '⌘+B',
			},
			{
				label: 'UI Kit',
				icon: 'pi pi-pencil',
				shortcut: '⌘+U',
			},
		],
	},
])
</script>
<style scoped></style>
