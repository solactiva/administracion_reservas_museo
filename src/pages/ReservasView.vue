<template>
	<Accordion value="0" class="mb-5">
		<AccordionPanel value="0">
			<AccordionHeader>Registrar reserva</AccordionHeader>
			<AccordionContent>
				<div class="grid grid-cols-1 md:grid-cols-2">
					<div class="flex justify-center mb-5 md:mb-0">
						<DatePicker
							inline
							v-model="fechaSeleccionada"
							:disabled-days="evento?.diasNoActivo"
							:minDate="new Date()"
							@update:modelValue="actualizarHorarios"
						/>
					</div>
					<div class="grid grid-cols-2 gap-4 justify-center" v-if="action">
						<Skeleton
							width="100%"
							height="5rem"
							v-for="index in 6"
							:key="index"
						></Skeleton>
					</div>
					<div class="grid grid-cols-2 gap-4 justify-center" v-else>
						<template
							v-for="elHorario in horarios"
							:key="elHorario.identificador"
						>
							<Button
								severity="secondary"
								class="flex flex-col items-center"
								@click="registrarDatosReserva(elHorario.identificador)"
							>
								<div class="text-center font-semibold text-xl">
									{{ `${elHorario.inicioEvento} - ${elHorario.finEvento}` }}
								</div>
								<div class="text-center text-sm">
									{{ elHorario.spots }} disponibles
								</div>
							</Button>
						</template>
					</div>
				</div>
			</AccordionContent>
		</AccordionPanel>
	</Accordion>
	<Tabs value="0">
		<TabList>
			<Tab v-for="(tab, index) in itemsTabs" :key="index" :value="tab.value">
				<template class="flex items-center gap-2 text-inherit">
					<i :class="tab.icon" />
					<span>{{ tab.label }}</span>
				</template>
			</Tab>
		</TabList>
		<TabPanels class="p-0">
			<TabPanel
				v-for="(tab, index) in itemsTabs"
				:key="index"
				:value="tab.value"
			>
				<component :is="tab.component" />
			</TabPanel>
		</TabPanels>
	</Tabs>
</template>
<script setup>
import { ref, computed, watch, defineAsyncComponent, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useEventos } from '@/composables/useEventos'
import { useHorarios } from '@/composables/useHorarios'
import { useReservas } from '@/composables/useReservas'
import { useDialog } from 'primevue/usedialog'

const ReservaForm = defineAsyncComponent(() =>
	import('@/components/Reservas/ReservaForm.vue')
)
const ReservaHeader = defineAsyncComponent(() =>
	import('@/components/Reservas/ReservaHeader.vue')
)
const ReservaFooter = defineAsyncComponent(() =>
	import('@/components/Reservas/ReservaFooter.vue')
)

const dialog = useDialog()

const ruta = useRoute()
const { evento, cargarEvento } = useEventos()
const { horarios, action, cargarHorarios } = useHorarios()
const { reserva, horario, cleanReserva } = useReservas()

const fechaSeleccionada = ref(new Date())

const idEvento = computed(() => ruta.params.idEvento)

const actualizarHorarios = async () => {
	await cargarHorarios(fechaSeleccionada.value, idEvento.value)
}

const itemsTabs = [
	{
		label: 'Pendientes',
		icon: 'pi pi-clock',
		value: '0',
		component: defineAsyncComponent(() => import('@/pages/PendientesPage.vue')),
	},
	{
		label: 'Confirmados',
		icon: 'pi pi-check',
		value: '1',
		component: defineAsyncComponent(() =>
			import('@/pages/ConfirmadosPage.vue')
		),
	},
]

watch(
	idEvento,
	async (nuevoId, antiguoId) => {
		if (nuevoId !== antiguoId) {
			await cargarEvento(nuevoId)
			await actualizarHorarios()
		}
	},
	{ immediate: true }
)

const registrarDatosReserva = (idProg) => {
	cleanReserva()
	reserva.value.cantidad = evento.value.precios.map((pago) => ({
		tipo: pago.tipo,
		cantidad: 0,
	}))
	reserva.value.cantidadAdicional = evento.value.precios.map((pago) => ({
		tipo: pago.tipo,
		cantidad: 0,
	}))
	horario.value = horarios.value.find(
		(horario) => horario.identificador === idProg
	)
	openModalReserva()
}

const openModalReserva = () => {
	// eslint-disable-next-line no-unused-vars
	const dialogRef = dialog.open(ReservaForm, {
		props: {
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
			header: markRaw(ReservaHeader),
			footer: markRaw(ReservaFooter),
		},
		data: {
			fecha: fechaSeleccionada.value,
			id: idEvento.value,
		},
	})
}
</script>
