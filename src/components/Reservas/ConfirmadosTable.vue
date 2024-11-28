<template>
	<DataTable :value="new Array(6)" v-if="interactividad.loadingTable">
		<template #header>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div></div>
				<Button icon="pi pi-refresh" @click="fetchReservas" rounded raised />
			</div>
		</template>
		<Column field="code" header="Fecha Registro">
			<template #body>
				<Skeleton></Skeleton>
			</template>
		</Column>
		<Column field="name" header="Nombre">
			<template #body>
				<Skeleton></Skeleton>
			</template>
		</Column>
		<Column field="category" header="Día de reserva">
			<template #body>
				<Skeleton></Skeleton>
			</template>
		</Column>
		<Column field="quantity" header="Personas">
			<template #body>
				<Skeleton></Skeleton>
			</template>
		</Column>
	</DataTable>
	<DataTable
		v-model:filters="filters"
		:value="reservasConfirmadas"
		paginator
		:rows="10"
		dataKey="identificador"
		filterDisplay="menu"
		v-else
	>
		<template #header>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div></div>
				<Button icon="pi pi-refresh" @click="fetchReservas" rounded raised />
			</div>
		</template>
		<template #empty> No se encontraron resultados. </template>
		<template #loading> Cargando información. Por favor espere. </template>
		<Column header="Fecha Registro" filterField="fechaRegistro" dataType="date">
			<template #body="{ data }">
				{{
					format(
						new Date(data.fechaRegistro),
						{ date: 'short', time: 'short' },
						'es'
					)
				}}
			</template>
			<template #filter="{ filterModel }">
				<DatePicker
					v-model="filterModel.value"
					dateFormat="dd/mm/yy"
					placeholder="dd/mm/yyyy"
				/>
			</template>
		</Column>
		<Column header="Nombre" filterField="cliente.nombre">
			<template #body="{ data }">
				{{ data.cliente.nombre }}
			</template>
			<template #filter="{ filterModel, filterCallback }">
				<InputText
					v-model="filterModel.value"
					type="text"
					@input="filterCallback()"
					placeholder="Buscar por Nombre"
					fluid
					class="h-8 w-56"
				/>
			</template>
		</Column>
		<Column
			header="Tipo Reserva"
			filterField="tipoReserva"
			:filterMenuStyle="{ width: '14rem' }"
			style="min-width: 12rem"
		>
			<template #body="{ data }">
				<Tag
					:value="
						data.tipoReserva
							? tiposReserva.find((el) => el.code === data.tipoReserva).name
							: 'N/A'
					"
					:severity="getSeverity(data.tipoReserva)"
				></Tag>
			</template>
			<template #filter="{ filterModel }">
				<Select
					v-model="filterModel.value"
					:options="reservasTipos"
					placeholder="Selecciona uno"
					showClear
				>
					<template #option="slotProps">
						<Tag
							:value="
								tiposReserva.find((el) => el.code === slotProps.option).name
							"
							:severity="getSeverity(slotProps.option)"
						/>
					</template>
				</Select>
			</template>
		</Column>
		<Column
			header="Día de visita"
			filterField="programacion.fecha"
			dataType="date"
			style="min-width: 10rem"
		>
			<template #body="{ data }">
				{{ formatDate(data.programacion.fecha) }}
			</template>
			<template #filter="{ filterModel }">
				<DatePicker
					v-model="filterModel.value"
					dateFormat="dd/mm/yy"
					placeholder="dd/mm/yyyy"
				/>
			</template>
		</Column>
		<Column
			bodyStyle="text-align: center; overflow: visible"
			style="width: 20%"
		>
			<template #body="{ data }">
				<div class="flex flex-row gap-1">
					<Button
						type="button"
						icon="pi pi-eye"
						rounded
						severity="secondary"
						@click="verReserva(data.identificador)"
					/>
					<Button
						type="button"
						icon="pi pi-trash"
						rounded
						outlined
						severity="danger"
						@click="actionEliminarReserva(data.identificador)"
					/>
				</div>
			</template>
		</Column>
	</DataTable>
</template>
<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { format } from '@formkit/tempo'
import { useReservas } from '@/composables/useReservas'
import { useRoute } from 'vue-router'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { useDialog } from 'primevue/usedialog'
import { useConfirm } from 'primevue/useconfirm'

const ManageReservaForm = defineAsyncComponent(() =>
	import('@/components/Reservas/ManageReservaForm.vue')
)

const confirm = useConfirm()
const dialog = useDialog()
const route = useRoute()
const { interactividad, reservasConfirmadas, loadReservas, eliminarReserva } =
	useReservas()

const fetchReservas = async () => {
	await loadReservas(route.params.idEvento)
}

const verReserva = (identificador) => {
	openModalManageReserva(identificador, false)
}

const filters = ref({
	'cliente.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
	tipoReserva: { value: null, matchMode: FilterMatchMode.EQUALS },
	fechaRegistro: {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
	},
	'programacion.fecha': {
		operator: FilterOperator.AND,
		constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
	},
})

const tiposReserva = ref([
	{ code: 'call', name: 'Llamada' },
	{ code: 'onsite', name: 'Presencial' },
	{ code: 'online', name: 'Online' },
])

const reservasTipos = tiposReserva.value.map((el) => el.code)

const getSeverity = (status) => {
	switch (status) {
		case 'call':
			return 'success'

		case 'onsite':
			return 'warn'

		case 'online':
			return 'info'
		default:
			return 'secondary'
	}
}

const formatDate = (value) => {
	return format(new Date(value), { date: 'full' }, 'es')
}

const openModalManageReserva = (identificador, modificar) => {
	// eslint-disable-next-line no-unused-vars
	const dialogRef = dialog.open(ManageReservaForm, {
		props: {
			header: 'Comprobación de reserva',
			style: {
				width: '65vw',
			},
			breakpoints: {
				'1024px': '80vw',
				'960px': '75vw',
				'640px': '90vw',
			},
			modal: true,
		},
		data: {
			identificador,
			modificar,
		},
	})
}

const actionEliminarReserva = (identificador) => {
	confirm.require({
		group: 'danger',
		message: 'No se podra recuperar la información una vez eliminada.',
		header: '¿Está seguro de eliminar la reserva?',
		icon: 'pi pi-question',
		accept: async () => {
			await eliminarReserva(identificador)
		},
		reject: () => {},
	})
}
</script>
