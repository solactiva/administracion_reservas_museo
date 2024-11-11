<template>
	<div class="">
		<DataTable :value="skeletons" v-if="fetching">
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
		<DataTable :value="reservas" v-else>
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div></div>
					<Button
						icon="pi pi-refresh"
						@click="fetchReservas($route.params.idEvento)"
						rounded
						raised
					/>
				</div>
			</template>
			<Column header="Fecha Registro">
				<template #body="slotProps">
					{{
						format(
							new Date(slotProps.data.fechaRegistro),
							{ date: 'short', time: 'short' },
							'es'
						)
					}}
				</template>
			</Column>
			<Column field="cliente.nombre" header="Nombre">
				<template #body="slotProps">
					<OverlayBadge severity="warn">
						{{ slotProps.data.cliente.nombre }}
					</OverlayBadge>
				</template>
			</Column>
			<Column field="programacion.fecha" header="Día de reserva">
				<template #body="slotProps">
					{{
						format({
							date: new Date(slotProps.data.programacion.fecha),
							format: 'medium',
							locale: 'es',
							tz: 'UTC',
						})
					}}
				</template>
			</Column>
			<Column
				field="cantidadTotal"
				header="Personas"
				headerStyle="width: 5rem; text-align: center"
				class="text-center"
			></Column>
			<Column
				headerStyle="width: 5rem; text-align: center"
				bodyStyle="text-align: center; overflow: visible"
			>
				<template #body="slotProps">
					<Button
						type="button"
						icon="pi pi-eye"
						rounded
						severity="secondary"
						@click="verReserva(slotProps.data.identificador)"
					/>
				</template>
			</Column>
		</DataTable>
		<Dialog
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
		</Dialog>
	</div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { format } from '@formkit/tempo'
import { useReservas } from '@/composables/useReservas'
import { useRoute } from 'vue-router'

const route = useRoute()
const { getReservasPendientes, confirmarReserva, rechazarReserva } =
	useReservas()

const reservas = ref([])
const reservaFiltrada = ref(null)
const skeletons = ref(new Array(6))
const fetching = ref(false)

const visible = ref(false)
const loadingRechazar = ref(false)
const disabledRechazar = ref(false)
const loadingConfirmar = ref(false)
const disabledConfirmar = ref(false)

onMounted(async () => {
	fetching.value = true
	reservas.value = await getReservasPendientes(route.params.idEvento)
	fetching.value = false
})

watch(route, () => {
	fetchReservas()
})

const fetchReservas = async () => {
	fetching.value = true
	reservas.value = await getReservasPendientes(route.params.idEvento)
	fetching.value = false
}

const confirmarReservaAction = async () => {
	loadingConfirmar.value = true
	disabledConfirmar.value = true
	disabledRechazar.value = true
	const res = await confirmarReserva({
		identificador: reservaFiltrada.value.identificador,
		idProg: reservaFiltrada.value.idProg,
	})
	loadingConfirmar.value = false
	disabledConfirmar.value = false
	disabledRechazar.value = false

	if (res.success) {
		reservas.value.splice(reservas.value.indexOf(reservaFiltrada.value), 1)
		visible.value = false
		return
	}
	return
}

const rechazarReservaAction = async () => {
	loadingRechazar.value = true
	disabledRechazar.value = true
	disabledConfirmar.value = true
	const res = await rechazarReserva({
		identificador: reservaFiltrada.value.identificador,
		idProg: reservaFiltrada.value.idProg,
	})
	loadingRechazar.value = false
	disabledRechazar.value = false
	disabledConfirmar.value = false

	if (res.success) {
		reservas.value.splice(reservas.value.indexOf(reservaFiltrada.value), 1)
		visible.value = false
		return
	}
	return
}

const verReserva = (id) => {
	reservaFiltrada.value = reservas.value.find(
		(reserva) => reserva.identificador === id
	)
	visible.value = true
}
</script>
<style scoped></style>
