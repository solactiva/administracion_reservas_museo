<template>
	<div class="container my-5 mx-auto">
		<div class="flex flex-row gap-2 mb-4">
			<h1 class="text-xl text-primary font-bold">Eventos</h1>
			<Button
				icon="pi pi-plus"
				variant="text"
				size="small"
				v-tooltip="'Crear nuevo evento'"
				@click="actionCrearEvento()"
			/>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<template v-if="interactividad.action">
				<div
					class="rounded-2xl border border-surface-200 p-6 bg-surface-0"
					v-for="index in 3"
					:key="index"
				>
					<div class="flex mb-4">
						<div>
							<Skeleton width="10rem" height="1rem" class="mb-4"></Skeleton>
						</div>
					</div>
					<Skeleton width="100%" height="70px"></Skeleton>
					<div class="flex flex-col gap-2 mt-2">
						<Skeleton width="4rem" height="2rem"></Skeleton>
						<Skeleton width="4rem" height="2rem"></Skeleton>
					</div>
				</div>
			</template>
			<Card
				v-else
				style="overflow: hidden"
				v-for="el in eventos"
				:key="el.identificador"
			>
				<template #header>
					<div
						class="h-full text-end"
						:class="el.activo ? 'bg-green-200' : ' bg-slate-200'"
					>
						<Button
							icon="pi pi-cog"
							class="text-primary-950"
							:class="el.activo ? 'hover:bg-green-300' : 'hover:bg-slate-300'"
							severity="secondary"
							text
							rounded
							@click="toggle($event, el.identificador)"
						/>
					</div>
				</template>
				<template #title> {{ el.nombre }} </template>
				<template #content>
					<p class="text-sm">{{ el.descripcion }}</p>
					<Divider type="dashed" />
					<div class="flex flex-col gap-2">
						<span><i class="pi pi-users"></i> {{ el.capacidad }}</span>
						<span><i class="pi pi-clock"></i> {{ el.duracion }} min</span>
					</div>
				</template>
			</Card>
		</div>
	</div>
	<Popover ref="op">
		<div class="flex flex-col gap-1 p-0">
			<Button
				icon="pi pi-pencil"
				class="text-primary-950 hover:bg-gray-100 text-sm justify-start"
				label="Actualizar"
				text
				rounded
				@click="actionActualizarEvento(selectedId)"
			/>
			<Button
				icon="pi pi-clock"
				class="text-primary-950 hover:bg-gray-100 text-sm justify-start text-start"
				label="Generar Programación"
				text
				rounded
				@click="actionProgramacionEvento(selectedId)"
			/>
			<Divider type="dashed" class="m-0" />
			<Button
				icon="pi pi-trash"
				class="bg-red-100 text-red-600 hover:bg-red-200 text-sm justify-start"
				label="Eliminar"
				text
				rounded
				@click="confirmDelete(selectedId)"
			/>
		</div>
	</Popover>
</template>
<script setup>
import { ref, nextTick, defineAsyncComponent, markRaw } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useEventos } from '@/composables/useEventos'
import { useDialog } from 'primevue/usedialog'

const EventoForm = defineAsyncComponent(() =>
	import('@/components/Eventos/EventoForm.vue')
)
const EventoFooter = defineAsyncComponent(() =>
	import('@/components/Eventos/EventoFooter.vue')
)
const GeneradorForm = defineAsyncComponent(() =>
	import('@/components/Programaciones/GeneradorForm.vue')
)
const GeneradorFooter = defineAsyncComponent(() =>
	import('@/components/Programaciones/GeneradorFooter.vue')
)

const dialog = useDialog()

const {
	eventos,
	interactividad,
	cargarEventos,
	cargarEventoUpdate,
	eliminarEvento,
	cleanEvento,
} = useEventos()

const toast = useToast()
const confirm = useConfirm()
const op = ref()
const update = ref(false)
const selectedId = ref('')

const toggle = (event, identificador) => {
	op.value.hide()
	if (selectedId.value === identificador) {
		selectedId.value = null
	} else {
		selectedId.value = identificador
		nextTick(() => {
			op.value.show(event)
		})
	}
}
const confirmDelete = (id) => {
	confirm.require({
		message: '¿Estás seguro de eliminar este evento?',
		header: 'Precuación',
		icon: 'pi pi-info-circle',
		rejectProps: {
			label: 'Cancelar',
			severity: 'secondary',
			outlined: true,
		},
		acceptProps: {
			label: 'Eliminar',
			severity: 'danger',
			loading: interactividad.value.loading,
		},
		accept: async () => {
			await eliminarEvento(id)
		},
		reject: () => {
			toast.add({
				severity: 'warn',
				summary: 'Cancelado',
				detail: 'Operación cancelada',
				life: 3000,
			})
		},
	})
}

const actionActualizarEvento = (id) => {
	cargarEventoUpdate(id)
	update.value = true
	openModalEvento()
}
const actionCrearEvento = () => {
	cleanEvento()
	update.value = false
	openModalEvento()
}

const actionProgramacionEvento = async (id) => {
	cargarEventoUpdate(id)
	openModalGenerador()
}

const openModalEvento = () => {
	const titleDialog = update.value ? 'Actualizar Evento' : 'Crear Nuevo Evento'
	// eslint-disable-next-line no-unused-vars
	const dialogRef = dialog.open(EventoForm, {
		props: {
			header: titleDialog,
			style: {
				width: '50vw',
			},
			breakpoints: {
				'960px': '75vw',
				'640px': '90vw',
			},
			modal: true,
		},
		data: {
			update: update.value,
		},
		templates: {
			footer: markRaw(EventoFooter),
		},
	})
}

const openModalGenerador = () => {
	// eslint-disable-next-line no-unused-vars
	const dialogRef = dialog.open(GeneradorForm, {
		props: {
			header: 'Generar Programación',
			style: {
				width: '50vw',
			},
			breakpoints: {
				'960px': '75vw',
				'640px': '90vw',
			},
			modal: true,
		},
		templates: {
			footer: markRaw(GeneradorFooter),
		},
	})
}

cargarEventos()
</script>
<style scoped></style>
