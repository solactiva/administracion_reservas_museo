<template>
	<Tabs value="pendientes">
		<TabList>
			<Tab v-for="tab in items" :key="tab.label" :value="tab.route">
				<router-link
					v-if="tab.route"
					v-slot="{ href, navigate }"
					:to="tab.route"
					custom
				>
					<a
						v-ripple
						:href="href"
						@click="navigate"
						class="flex items-center gap-2 text-inherit"
					>
						<i :class="tab.icon" />
						<span>{{ tab.label }}</span>
					</a>
				</router-link>
			</Tab>
		</TabList>
	</Tabs>
	<RouterView />
</template>
<script setup>
import { ref } from 'vue'

const items = ref([
	{ route: 'pendientes', label: 'Pendientes', icon: 'pi pi-hourglass' },
	{ route: 'confirmados', label: 'Confirmados', icon: 'pi pi-check-square' },
])
</script>
