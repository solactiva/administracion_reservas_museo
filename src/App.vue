<template>
	<main class="container mx-auto px-4 lg:px-36 py-0">
		<Toast position="top-center" :pt="{ root: 'w-11/12' }" />
		<Menubar :model="items">
			<template #start>
				<h1 class="text-lg font-bold text-primary">
					<a href="/">MUSEO</a>
				</h1>
			</template>
			<template #item="{ item, props, hasSubmenu, root }">
				<a v-ripple class="flex items-center" v-bind="props.action">
					<span :class="item.icon" />
					<span class="ml-2">{{ item.label }}</span>
					<Badge
						v-if="item.badge"
						:class="{ 'ml-auto': !root, 'ml-2': root }"
						:value="item.badge"
					/>
					<span
						v-if="item.shortcut"
						class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
						>{{ item.shortcut }}</span
					>
					<i
						v-if="hasSubmenu"
						:class="[
							'pi pi-angle-down',
							{
								'pi-angle-down ml-2': root,
								'pi-angle-right ml-auto': !root,
							},
						]"
					></i>
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
	},
	{
		label: 'Eventos',
		icon: 'pi pi-star',
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
