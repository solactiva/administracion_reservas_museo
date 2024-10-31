<template>
	<main class="container mx-auto px-5 py-0">
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
				<div class="flex items-center">
					<Button
						label="Cerrar Sesión"
						icon="pi pi-sign-out"
						text
						@click="logout"
					/>
				</div>
			</template>
		</Menubar>
		<Suspense>
			<template #default>
				<RouterView />
			</template>
			<template #fallback>
				<ProgressSpinner />
			</template>
		</Suspense>
		<Dialog v-model:visible="visible" modal header="Configuraciones Generales">
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
							@select="onUpload"
							customUpload
							auto
							chooseLabel="Subir QR de pago"
							chooseIcon="pi pi-upload"
							:choose-button-props="{ size: 'small', severity: 'secondary' }"
							class="text-sm w-full"
						/>
					</div>
					<div>
						<Image alt="Image" preview>
							<template #image>
								<img
									:src="configuracion.qrPago"
									alt="image"
									class="rounded-3xl"
									style="width: 150px; height: 150px; object-fit: cover"
								/>
							</template>
							<template #preview="slotProps">
								<img
									:src="configuracion.qrPago"
									alt="preview"
									:style="slotProps.style"
									@click="slotProps.onClick"
								/>
							</template>
						</Image>
					</div>
				</div>
				<div class="flex flex-col">
					<label for="">Tiempo para liberar cupos:</label>
					<InputGroup class="h-8 text-sm">
						<InputNumber
							type="number"
							showButtons
							:min="2"
							:max="15"
							v-model="configuracion.tiempoEspera"
						/>
						<InputGroupAddon>min.</InputGroupAddon>
					</InputGroup>
				</div>
			</div>
			<template #footer>
				<Button label="Cerrar" text @click="visible = false" />
				<Button
					label="Guardar"
					@click="actualizarConfiguracion"
					:loading="loading"
				/>
			</template>
		</Dialog>
	</main>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfiguraciones } from '@/composables/useConfiguraciones'
import { useEventos } from '@/composables/useEventos'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()
const { itemsReservas } = useEventos()
const { configuracion, loading, cargarConfiguracion, actualizarConfiguracion } =
	useConfiguraciones()

const visible = ref(false)

const onUpload = (event) => {
	const file = event.files[0]
	const reader = new FileReader()

	reader.onload = async (e) => {
		configuracion.value.qrPago = e.target.result
	}

	reader.readAsDataURL(file)
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
		label: 'Configuraciones',
		icon: 'pi pi-cog',
		command: async () => {
			await cargarConfiguracion()
			visible.value = true
		},
	},
])

watch(itemsReservas, (value) => {
	items.value[1].items = value
})
</script>
<style scoped></style>
