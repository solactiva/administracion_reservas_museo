<template>
	<div class="flex flex-row gap-2 my-5">
		<h1 class="text-xl text-primary font-bold">Tipo de Visitantes</h1>
		<Button
			icon="pi pi-plus"
			outlined
			size="small"
			v-tooltip="'Agregar nuevo tipo de visitante'"
			@click="actionCrearTipoVisitante()"
		/>
	</div>
	<Card>
		<template #header>
			<div class="flex flex-row justify-between items-center px-2 pt-2">
				<h2 class="text-lg font-bold">Listado de Tipos de Visitantes</h2>
				<Button
					icon="pi pi-refresh"
					size="small"
					rounded
					v-tooltip.bottom="'Recargar'"
					@click="fetchTipoVisitantes"
				/>
			</div>
		</template>
		<template #content>
			<DataTable
				:value="tipoVisitantes"
				tableStyle="min-width: 50rem"
				:virtualScrollerOptions="{
					lazy: true,
					onLazyLoad: fetchTipoVisitantes,
					itemSize: 1,
					delay: 200,
					showLoader: true,
					loading: true,
					numToleratedItems: 10,
				}"
			>
				<Column field="nombre" header="Tipo Visitante">
					<template #loading>
						<div
							class="flex items-center"
							:style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
						>
							<Skeleton width="40%" height="1rem" />
						</div>
					</template>
				</Column>
				<Column field="descripcion" header="Descripción">
					<template #loading>
						<div
							class="flex items-center"
							:style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
						>
							<Skeleton width="40%" height="1rem" />
						</div>
					</template>
				</Column>
				<Column header="">
					<template #body="{ data }">
						<div class="flex flex-row gap-1">
							<Button
								icon="pi pi-pencil"
								text
								rounded
								size="small"
								v-tooltip="'Editar'"
								@click="actionActualizarTipoVisitante(data.identificador)"
							/>
							<Button
								icon="pi pi-trash"
								text
								rounded
								size="small"
								v-tooltip="'Eliminar'"
								severity="danger"
								@click="actionEliminarTipoVisitante(data.identificador)"
							/>
						</div>
					</template>
				</Column>
			</DataTable>
		</template>
	</Card>
</template>
<script setup>
import { defineAsyncComponent, markRaw, onMounted, ref } from 'vue'
import { useDialog } from 'primevue/usedialog'
import { useTipoVisitantes } from '@/composables/useTipoVisitantes'
import { useConfirm } from 'primevue/useconfirm'

const {
	tipoVisitantes,
	visitante,
	fetchTipoVisitantes,
	eliminarTipoVisitante,
} = useTipoVisitantes()

const VisitanteForm = defineAsyncComponent(() =>
	import('@/components/TipoVisitante/VisitanteForm.vue')
)
const VisitanteFooter = defineAsyncComponent(() =>
	import('@/components/TipoVisitante/VisitanteFooter.vue')
)

const confirm = useConfirm()
const dialog = useDialog()
const update = ref(false)

const actionActualizarTipoVisitante = (id) => {
	update.value = true
	visitante.value = tipoVisitantes.value.find((v) => v.identificador === id)
	actionModalTipoVisitante()
}

const actionCrearTipoVisitante = () => {
	update.value = false
	visitante.value = {
		identificador: crypto.randomUUID(),
		nombre: '',
		descripcion: '',
	}
	actionModalTipoVisitante()
}

const actionEliminarTipoVisitante = (id) => {
	confirm.require({
		group: 'danger',
		header: 'Eliminar Tipo de Visitante',
		message: '¿Está seguro de eliminar este tipo de visitante?',
		icon: 'pi pi-exclamation-triangle',
		acceptLabel: 'Sí',
		accept: () => {
			eliminarTipoVisitante(id)
		},
		reject: () => {},
	})
}

const actionModalTipoVisitante = () => {
	// eslint-disable-next-line no-unused-vars
	const dialogRef = dialog.open(VisitanteForm, {
		props: {
			header: 'Tipo de Visitante',
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
			footer: markRaw(VisitanteFooter),
		},
		data: {
			update: update.value,
		},
	})
}

onMounted(() => {
	fetchTipoVisitantes()
})
</script>
