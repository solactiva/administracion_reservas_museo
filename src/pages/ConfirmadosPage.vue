<template>
	<div class="container mx-auto px-4">
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
		</Dialog>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { format } from '@formkit/tempo'
import { useReservas } from '@/composables/useReservas'

const { getReservasConfirmadas } = useReservas()

const reservas = ref([])
const reservaFiltrada = ref({})
const visible = ref(false)

const skeletons = ref(new Array(6))
const fetching = ref(false)

onMounted(async () => {
	fetching.value = true
	reservas.value = await getReservasConfirmadas()
	fetching.value = false
})

const fetchReservas = async () => {
	fetching.value = true
	reservas.value = await getReservasConfirmadas()
	fetching.value = false
}

const verReserva = (identificador) => {
	reservaFiltrada.value = reservas.value.find(
		(el) => el.identificador === identificador
	)
	visible.value = true
}
</script>
