<template>
	<div class="">
		<DataTable :value="new Array(6)" v-if="interactividad.loading">
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
			:value="reservasPendientes"
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
			<Column
				header="Fecha Registro"
				filterField="fechaRegistro"
				dataType="date"
			>
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
				header="Día de reserva"
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
				style="width: 5%"
			>
				<template #body="{ data }">
					<Button
						type="button"
						icon="pi pi-eye"
						rounded
						severity="secondary"
						@click="verReserva(data.identificador)"
					/>
				</template>
			</Column>
		</DataTable>
		<!-- <Dialog
			v-model:visible="visible"
			modal
			header="Comprobación de pago"
			:style="{ width: '90vw' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
		>
			<div class="grid grid-cols-1 md:grid-cols-2">
				<div class="text-center md:text-start">
					<Image
						:src="reservaFiltrada.pago.comprobante"
						alt="Image"
						width="250"
						preview
					/>
				</div>
				<div>
					<Fieldset legend="Detalle de reserva">
						<div class="flex flex-auto gap-4">
							<span class="font-bold">Nombre:</span>
							<span>{{ reservaFiltrada.cliente.nombre }}</span>
						</div>
						<div class="flex flex-auto gap-4">
							<span class="font-bold">Fecha de reserva:</span>
							<span>
								{{
									format({
										date: new Date(reservaFiltrada.programacion.fecha),
										format: 'medium',
										locale: 'es',
										tz: 'UTC',
									})
								}}
							</span>
						</div>
						<div class="flex flex-auto gap-4">
							<span class="font-bold">Personas:</span>
							<span>{{ reservaFiltrada.cantidadTotal }}</span>
						</div>
						<div class="flex flex-auto gap-4">
							<span class="font-bold">Total a pagar:</span>
							<span>{{ reservaFiltrada.pago.total }}</span>
						</div>
						<hr class="my-4" />
						<div
							class="flex flex-auto gap-4"
							v-for="(el, index) in reservaFiltrada.cantidad"
							:key="index"
						>
							<span class="font-bold">{{ el.tipo }}</span>
							<span>{{ el.cantidad }}</span>
						</div>
					</Fieldset>
				</div>
			</div>
			<template #footer>
				<div class="mt-4">
					<Button
						label="Rechazar"
						severity="danger"
						@click="rechazarReservaAction"
						autofocus
						outlined
						class="mr-2"
						:loading="loadingRechazar"
						:disabled="loadingRechazar"
					/>
					<Button
						label="Confirmar"
						@click="confirmarReservaAction"
						autofocus
						:loading="loadingConfirmar"
						:disabled="loadingConfirmar"
					/>
				</div>
			</template>
		</Dialog> -->
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { format } from '@formkit/tempo'
import { useReservas } from '@/composables/useReservas'
import { useRoute } from 'vue-router'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

const route = useRoute()
const {
	interactividad,
	reservasPendientes,
	loadReservas,
	confirmarReserva,
	rechazarReserva,
} = useReservas()

const reservaFiltrada = ref(null)

const fetchReservas = async () => {
	await loadReservas(route.params.idEvento)
}

const confirmarReservaAction = async () => {
	const res = await confirmarReserva({
		identificador: reservaFiltrada.value.identificador,
		idProg: reservaFiltrada.value.idProg,
	})

	if (res.success) {
		reservas.value.splice(reservas.value.indexOf(reservaFiltrada.value), 1)
		return
	}
	return
}

const rechazarReservaAction = async () => {
	const res = await rechazarReserva({
		identificador: reservaFiltrada.value.identificador,
		idProg: reservaFiltrada.value.idProg,
	})

	if (res.success) {
		reservas.value.splice(reservas.value.indexOf(reservaFiltrada.value), 1)
		return
	}
	return
}

const verReserva = (id) => {
	reservaFiltrada.value = reservasPendientes.value.find(
		(reserva) => reserva.identificador === id
	)
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
	return value.toLocaleDateString('es-BO', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}
</script>
<style scoped></style>
