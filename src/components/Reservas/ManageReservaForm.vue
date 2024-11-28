<template>
	<div
		id="loading"
		v-if="interactividad.loadingModal"
		class="flex items-center"
	>
		<ProgressSpinner />
	</div>
	<div
		v-else
		class="grid gap-4"
		:class="
			reservaSeleccionada.pago?.comprobante
				? 'grid-cols-1 md:grid-cols-2'
				: 'grid-cols-1'
		"
	>
		<div
			v-if="reservaSeleccionada.pago?.comprobante"
			class="flex justify-center"
		>
			<Image
				:src="reservaSeleccionada.pago.comprobante"
				alt="Image"
				width="250"
				preview
			/>
		</div>
		<div>
			<div class="grid grid-cols-2 mb-5">
				<div class="flex flex-col gap-1 items-center">
					<span class="font-semibold">Fecha de Visita:</span>
					<span>{{ formatDate(reservaSeleccionada.programacion?.fecha) }}</span>
				</div>
				<div class="flex flex-col gap-1 items-center">
					<span class="font-semibold">Horario de Visita:</span>
					<span>{{
						reservaSeleccionada.programacion?.inicioEvento +
						' - ' +
						reservaSeleccionada.programacion?.finEvento
					}}</span>
				</div>
			</div>
			<div class="grid grid-cols-2 mb-5">
				<div class="flex flex-col gap-1">
					<div class="font-semibold">Visitantes</div>
					<div
						class="flex flex-row gap-2"
						v-for="(el, index) in reservaSeleccionada.cantidad"
						:key="index"
					>
						<span>{{ el.tipo }}:</span>
						<span class="font-semibold">{{ el.cantidad }}</span>
					</div>
					<div class="flex flex-row gap-2">
						<span class="font-medium">Total Visitantes:</span>
						<span class="font-semibold">{{
							reservaSeleccionada.cantidadTotal
						}}</span>
					</div>
				</div>
				<div
					class="flex flex-col gap-1"
					v-if="reservaSeleccionada.cantidadAdicional"
				>
					<div class="font-semibold">Adicionales</div>
					<div
						class="flex flex-row gap-2"
						v-for="(el, index) in reservaSeleccionada.cantidadAdicional"
						:key="index"
					>
						<span>{{ el.tipo }}:</span>
						<span class="font-semibold">{{ el.cantidad }}</span>
					</div>
					<div class="flex flex-row gap-2">
						<span class="font-medium">Total Visitantes:</span>
						<span class="font-semibold">{{
							reservaSeleccionada.cantidadTotalAdicional
						}}</span>
					</div>
				</div>
			</div>
			<div class="font-semibold mb-5">
				Total a Pagar: {{ reservaSeleccionada.pago?.total }} Bs.
			</div>
			<div class="flex flex-col mb-5 gap-1">
				<div class="flex flex-auto gap-2">
					<span class="font-semibold">Nombre:</span>
					<span>{{ reservaSeleccionada.cliente?.nombre }}</span>
				</div>
				<div class="flex flex-auto gap-2">
					<span class="font-semibold">Correo:</span>
					<span>{{ reservaSeleccionada.cliente?.email }}</span>
				</div>
				<div class="flex flex-auto gap-2">
					<span class="font-semibold">Teléfono:</span>
					<span>{{ reservaSeleccionada.cliente?.telefono }}</span>
				</div>
				<div class="card flex flex-auto gap-2">
					<span class="font-semibold"> Tipo de Reserva: </span>
					<span>
						{{
							tiposDeReserva.find((el) => {
								if (!reservaSeleccionada.tipoReserva) {
									return el.value === 'ninguno'
								}
								return el.value === reservaSeleccionada.tipoReserva
							})?.label
						}}
					</span>
				</div>
			</div>
			<div class="flex flex-col mb-5 gap-1">
				<label for="metodoPago" class="font-semibold">Método de Pago:</label>
				<InputGroup>
					<Select
						id="metodoPago"
						v-model="reservaSeleccionada.pago.metodoPago"
						:options="metodosPago"
						optionLabel="name"
						optionValue="value"
						placeholder="Seleccione un metodo de pago"
						:disabled="!dialogRef.data.modificar"
					/>
				</InputGroup>
			</div>
		</div>
	</div>
</template>
<script setup>
import { inject, ref } from 'vue'
import { format } from '@formkit/tempo'
import { useReservas } from '@/composables/useReservas'

const { interactividad, reservaSeleccionada, loadReserva } = useReservas()

const dialogRef = inject('dialogRef')
loadReserva(dialogRef.value.data.identificador)

const formatDate = (date) => {
	if (!date) return ''
	return format({
		date: new Date(date),
		format: 'medium',
		locale: 'es',
		tz: 'UTC',
	})
}

const tiposDeReserva = ref([
	{ label: '🏢 En persona', value: 'onsite' },
	{ label: '📲 Por Llamada/WhatsApp', value: 'call' },
	{ label: '🌐 Online', value: 'online' },
	{ label: 'Ninguno', value: 'ninguno' },
])

const metodosPago = ref([
	{ name: 'Efectivo', value: 'efectivo' },
	{ name: 'QR', value: 'qr' },
])
</script>
