<template>
	<main class="container mx-auto px-5 py-0">
		<Toast position="top-center" :pt="{ root: 'w-11/12 md:w-2/5' }" />
		<ConfirmDialog></ConfirmDialog>
		<ConfirmDialog group="danger">
			<template #container="{ message, acceptCallback, rejectCallback }">
				<div class="flex flex-col items-center p-8 bg-surface-0 rounded">
					<div
						class="rounded-full bg-red-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20"
					>
						<i :class="message.icon" class="text-5xl"></i>
					</div>
					<span class="font-bold text-2xl block mb-2 mt-6">{{
						message.header
					}}</span>
					<p class="mb-0">{{ message.message }}</p>
					<div class="flex items-center gap-2 mt-6">
						<Button
							label="Si"
							@click="acceptCallback"
							severity="danger"
						></Button>
						<Button
							label="No"
							@click="rejectCallback"
							severity="secondary"
						></Button>
					</div>
				</div>
			</template>
		</ConfirmDialog>
		<DynamicDialog />
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
				<div class="flex items-center">
					<Button
						:icon="icon"
						iconPos="right"
						@click="toggleTheme"
						rounded
						text
					/>
					<Button
						icon="pi pi-user"
						@click="userMenu"
						severity="contrast"
						variant="text"
						size="small"
					/>

					<Menu ref="menu" id="overlay_menu" :model="userItems" :popup="true">
						<template #item="{ item, props }">
							<RouterLink
								v-if="item.route"
								v-slot="{ href, navigate }"
								:to="item.route"
								custom
							>
								<a
									v-ripple
									:href="href"
									v-bind="props.action"
									@click="navigate"
								>
									<span :class="item.icon" />
									<span class="ml-2">{{ item.label }}</span>
								</a>
							</RouterLink>
							<a
								v-else
								v-ripple
								:href="item.url"
								:target="item.target"
								v-bind="props.action"
							>
								<span :class="item.icon" />
								<span class="ml-2">{{ item.label }}</span>
							</a>
						</template>
					</Menu>
				</div>
			</template>
		</Menubar>
		<RouterView v-slot="{ Component, route }">
			<Transition name="fade" mode="out-in">
				<div :key="route.name">
					<Suspense>
						<component :is="Component" />
						<template #fallback>
							<ProgressSpinner />
						</template>
					</Suspense>
				</div>
			</Transition>
		</RouterView>
	</main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useEventos } from '@/composables/useEventos'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()
const { itemsReservas, cargarEventos } = useEventos()

const menu = ref()
const userItems = ref([
	{
		label: 'Opciones',
		items: [
			{
				label: 'Configuracion',
				icon: 'pi pi-cog',
				route: '/configuracion',
			},
			{
				label: 'Cerrar Sesión',
				icon: 'pi pi-sign-out',
				command: () => {
					logout()
				},
			},
		],
	},
])

const userMenu = (event) => {
	menu.value.toggle(event)
}

const items = ref([
	{
		label: 'Eventos',
		icon: 'pi pi-star',
		route: '/eventos',
	},
	{
		label: 'Reservas',
		icon: 'pi pi-book',
		items: [],
	},
	{
		label: 'Programaciones',
		icon: 'pi pi-calendar',
		route: '/programaciones',
	},
	{
		label: 'Reportes',
		icon: 'pi pi-chart-bar',
		route: '/reportes',
	},
])

const icon = ref('pi pi-moon')

const toggleTheme = () => {
	const theme = document.querySelector('html')
	theme.classList.toggle('p-dark')
	icon.value = icon.value === 'pi pi-moon' ? 'pi pi-sun' : 'pi pi-moon'
}

watch(itemsReservas, (value) => {
	items.value[1].items = value
})

onMounted(async () => {
	await cargarEventos()
})
</script>
<style scoped></style>
