<template>
	<div class="container mx-auto px-4">
		<DataTable :value="reservas" tableStyle="min-width: 50rem">
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">RESERVAS PARA CONFIRMAR</span>
					<Button icon="pi pi-refresh" rounded raised />
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
				<div>Aqui vendran detalles</div>
			</div>
		</Dialog>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { format } from '@formkit/tempo'

const visible = ref(false)
const reservas = ref([])
const reservaFiltrada = ref(null)
const loading = ref(false)

onMounted(async () => {
	reservas.value = await traerReservas()
})

const traerReservas = async () => {
	const res = await fetch('https://n8n.friktek.com/webhook/confirmaciones')
	const data = await res.json()
	return data.data
}

const confirmarReserva = async () => {
	loading.value = true
	const res = await fetch('https://n8n.friktek.com/webhook/confirmaciones', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			identificador: reservaFiltrada.value.identificador,
		}),
	})
	loading.value = false
	const data = await res.json()
	console.log(data)
	if (data.success) {
		reservas.value.splice(reservas.value.indexOf(reservaFiltrada.value), 1)
		alert(`${data.message}`)
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
