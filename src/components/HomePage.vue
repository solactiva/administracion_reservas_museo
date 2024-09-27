<template>
	<div class="container mx-auto px-4">
		<DataTable :value="reservas" tableStyle="min-width: 50rem">
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">RESERVAS PARA CONFIRMAR</span>
					<Button icon="pi pi-refresh" @click="fetchReservas" rounded raised />
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
			<Column field="cliente.nombre" header="Nombre"></Column>
			<Column field="programacion.fecha" header="Día de reserva">
				<template #body="slotProps">
					{{
						format(new Date(slotProps.data.programacion.fecha), 'medium', 'es')
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
									format(
										new Date(reservaFiltrada.programacion.fecha),
										'medium',
										'es'
									)
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
						@click="rechazarReserva"
						autofocus
						outlined
						class="mr-2"
						:loading="loadingRechazar"
						:disabled="loadingRechazar"
					/>
					<Button
						label="Confirmar"
						@click="confirmarReserva"
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
import { ref, onMounted } from 'vue'
import { format } from '@formkit/tempo'

const reservas = ref([])
const reservaFiltrada = ref(null)

const visible = ref(false)
const loadingRechazar = ref(false)
const disabledRechazar = ref(false)
const loadingConfirmar = ref(false)
const disabledConfirmar = ref(false)

onMounted(async () => {
	reservas.value = await traerReservas()
})

const fetchReservas = async () => {
	reservas.value = await traerReservas()
}

const traerReservas = async () => {
	const res = await fetch(
		'https://n8n.friktek.com/webhook/confirmaciones?estado=pendiente'
	)
	const data = await res.json()
	return data.data
}

const confirmarReserva = async () => {
	loadingConfirmar.value = true
	disabledConfirmar.value = true
	disabledRechazar.value = true
	const res = await fetch('https://n8n.friktek.com/webhook/confirmaciones', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			identificador: reservaFiltrada.value.identificador,
			idProg: reservaFiltrada.value.idProg,
		}),
	})
	loadingConfirmar.value = false
	disabledConfirmar.value = false
	disabledRechazar.value = false
	const data = await res.json()
	if (data.success) {
		reservas.value.splice(reservas.value.indexOf(reservaFiltrada.value), 1)
		visible.value = false
		return
	}

	return
}

const rechazarReserva = async () => {
	loadingRechazar.value = true
	disabledRechazar.value = true
	disabledConfirmar.value = true
	const res = await fetch('https://n8n.friktek.com/webhook/rechazos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			identificador: reservaFiltrada.value.identificador,
			idProg: reservaFiltrada.value.idProg,
		}),
	})
	loadingRechazar.value = false
	disabledRechazar.value = false
	disabledConfirmar.value = false
	const data = await res.json()
	if (data.success) {
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
