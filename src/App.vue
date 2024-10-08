<template>
	<main class="container mx-auto px-4 lg:px-36 py-0">
		<Toast position="top-center" :pt="{ root: 'w-11/12 md:w-2/5' }" />
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
		<Dialog
			v-model:visible="visible"
			modal
			header="Configuraciones Generales App"
		>
			<div class="flex flex-col gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col items-center justify-center">
						<FileUpload
							mode="basic"
							name="qr-pago"
							accept="image/*"
							:maxFileSize="5000000"
							invalidFileSizeMessage="Tamaño de archivo excedido"
							invalidFileTypeMessage="Tipo de archivo no permitido"
							@select="onSelect"
							customUpload
							auto
							chooseLabel="Subir QR de pago"
							chooseIcon="pi pi-upload"
							:choose-button-props="{ size: 'small', severity: 'secondary' }"
							class="text-sm w-full"
						/>
					</div>
					<div>
						<Image
							src="https://via.placeholder.com/150"
							alt="Image"
							class="w-full"
						/>
					</div>
				</div>
				<div class="flex flex-col">
					<label for="">Tiempo para liberar cupos:</label>
					<InputGroup class="h-8 text-sm">
						<InputNumber type="number" showButtons :min="2" :max="15" />
						<InputGroupAddon>min.</InputGroupAddon>
					</InputGroup>
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" text />
				<Button label="Guardar" />
			</template>
		</Dialog>
	</main>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'
import { ref } from 'vue'
const toggleTheme = () => {
	const theme = document.querySelector('html')
	theme.classList.toggle('dark-mode')
	const icon = document.querySelector('.pi')
	icon.classList.toggle('pi-moon')
	icon.classList.toggle('pi-sun')
}

const visible = ref(false)

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
		command: () => {
			visible.value = true
		},
	},
])
</script>
<style scoped></style>
