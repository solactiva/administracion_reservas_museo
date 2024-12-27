<template>
	<div class="flex flex-col gap-5">
		<div class="mt-5">
			<Panel toggleable header="Filtros de Búsqueda" class="w-full">
				<Form
					v-slot="$form"
					:resolver="resolver"
					:initialValues="busqueda"
					@submit="buscar"
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
				>
					<div class="flex flex-col gap-1">
						<label for="nombreCompleto" class="font-medium"
							>Rango de Fechas</label
						>
						<DatePicker
							name="gestionUno"
							v-model="busqueda.gestionUno"
							selectionMode="range"
							:manualInput="false"
						/>
						<small class="text-xs text-gray-500"
							>Rango de fechas para generar el reporte.
						</small>
						<Message
							v-if="$form.gestionUno?.invalid"
							severity="error"
							size="small"
							variant="simple"
							>{{ $form.gestionUno.error?.message }}</Message
						>
					</div>
					<div class="flex flex-col gap-1">
						<label for="nombreCompleto" class="font-medium"
							>Fechas de Comparación</label
						>
						<DatePicker
							name="gestionDos"
							v-model="busqueda.gestionDos"
							selectionMode="range"
							:manualInput="false"
							:disabled="busqueda.gestionUno.length === 0"
						/>
						<small class="text-xs text-gray-500"
							>Rango de fechas para comparación.
						</small>
					</div>
					<div class="flex flex-col gap-1">
						<label for="nombreCompleto" class="font-medium"
							>Tipo de Evento</label
						>
						<Select
							name="evento"
							v-model="busqueda.evento"
							:options="eventos"
							optionLabel="nombre"
							optionValue="identificador"
							placeholder="Seleccione un evento"
							showClear
						/>
						<small class="text-xs text-gray-500"
							>Si no selecciona un evento se tomarán todos los eventos.
						</small>
					</div>
					<div class="flex flex-col gap-1">
						<label for="nombreCompleto" class="font-medium"
							>Tipo de Segmento</label
						>
						<Select
							name="segmento"
							v-model="busqueda.segmento"
							:options="tipoVisitantes"
							optionLabel="nombre"
							optionValue="nombre"
							placeholder="Seleccione un segmento"
							showClear
						/>
						<small class="text-xs text-gray-500"
							>Si no se selecciona un segmento se mostrarán todos.
						</small>
					</div>
					<div class="flex flex-col gap-1">
						<label for="pais" class="font-medium">País</label>
						<Select
							name="pais"
							v-model="busqueda.pais"
							:options="countries"
							optionLabel="country"
							optionValue="country"
							placeholder="Seleccione un país"
							v-on:update:model-value="searchStates($event)"
							showClear
						/>
						<small class="text-xs text-gray-500"
							>Si no selecciona un país se tomarán todos los países.
						</small>
					</div>
					<div class="flex flex-col gap-1">
						<label for="estado" class="font-medium">Estado</label>
						<Select
							name="estado"
							v-model="busqueda.estado"
							:options="world.states"
							optionLabel="name"
							optionValue="name"
							placeholder="Seleccione un estado"
							showClear
							:disabled="world.states.length === 0"
							:loading="world.states.length === 0 && loadingStates"
						/>
						<small class="text-xs text-gray-500"
							>Si no selecciona un estado se tomarán todos los estados.
						</small>
					</div>
					<Button
						type="submit"
						label="Buscar"
						icon="pi pi-search"
						outlined
						class="col-start-1"
					/>
					<Button
						type="button"
						label="Limpiar"
						icon="pi pi-eraser"
						severity="secondary"
						outlined
						@click="limpiar"
					/>
				</Form>
			</Panel>
		</div>
		<div class="mb-5">
			<Panel>
				<template #icons>
					<div class="flex gap-2">
						<Button
							icon="pi pi-file-pdf"
							label="Exportar PDF"
							size="small"
							text
							:disabled="filteredData.length === 0 || loading"
							:loading="loading"
							@click="exportarPDF"
							class="hover:bg-red-100 hover:text-red-900"
						/>
						<Button
							icon="pi pi-file-excel"
							label="Exportar XLS"
							size="small"
							text
							:disabled="filteredData.length === 0 || loading"
							:loading="loading"
							@click="exportCSV"
							class="hover:bg-green-100 hover:text-green-900"
						/>
					</div>
				</template>
				<DataTable
					:value="filteredData"
					tableStyle="min-width: 50rem;"
					showGridlines
					ref="dt"
				>
					<ColumnGroup type="header">
						<Row>
							<Column header="Segmento" :rowspan="2" />
							<Column header="Primer Periodo" :colspan="2" />
							<template v-if="compare">
								<Column header="Segundo Periodo" :colspan="2" />
								<Column header="Dif." :colspan="4" />
							</template>
						</Row>
						<Row>
							<Column header="Cantidad" field="cantidadGestion1" />
							<Column header="Importe neto" field="importeGestion1" />
							<template v-if="compare">
								<Column header="Cantidad" field="cantidadGestion2" />
								<Column header="Importe neto" field="importeGestion2" />
								<Column header="Cantidad" field="diferenciaCantidad" />
								<Column header="%" field="porcentajeCantidad" />
								<Column header="Importe neto" field="diferenciaImporte" />
								<Column header="%" field="porcentajeImporte" />
							</template>
						</Row>
					</ColumnGroup>
					<Column field="segmento" />
					<Column field="cantidadGestion1" />
					<Column field="importeGestion1" />
					<template v-if="compare">
						<Column field="cantidadGestion2" />
						<Column field="importeGestion2" />
						<Column field="diferenciaCantidad" />
						<Column field="porcentajeCantidad">
							<template #body="{ data }">
								{{ data.porcentajeCantidad.toFixed(2) }}
							</template>
						</Column>
						<Column field="diferenciaImporte" />
						<Column field="porcentajeImporte">
							<template #body="{ data }">
								{{ data.porcentajeImporte.toFixed(2) }}
							</template>
						</Column>
					</template>
					<ColumnGroup type="footer">
						<Row>
							<Column footer="Totales:" footerStyle="text-align:right" />
							<Column :footer="totalCantidadPeriodoUno" />
							<Column :footer="totalImportePeriodoUno" />
							<template v-if="compare">
								<Column :footer="totalCantidadPeriodoDos" />
								<Column :footer="totalImportePeriodoDos" />
								<Column colspan="4" />
							</template>
						</Row>
					</ColumnGroup>
				</DataTable>
			</Panel>
		</div>
	</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useEventos } from '@/composables/useEventos'
import { useReportes } from '@/composables/useReportes'
import { useTipoVisitantes } from '@/composables/useTipoVisitantes'
import { useReservas } from '@/composables/useReservas'
import countries from '@/assets/countries.json'

const { eventos } = useEventos()
const {
	filteredData,
	loading,
	generarReporte,
	downloadReporte,
	downloadReporteXls,
} = useReportes()
const { tipoVisitantes, fetchTipoVisitantes } = useTipoVisitantes()
const { world, loadStates } = useReservas()

const busqueda = ref({
	gestionUno: [],
	gestionDos: [],
	evento: null,
	segmento: null,
	pais: null,
	estado: null,
})

const compare = ref(false)
const loadingStates = ref(false)
const limpiar = () => {
	busqueda.value = {
		gestionUno: [],
		gestionDos: [],
		evento: null,
		segmento: null,
	}
	filteredData.value = []
	compare.value = false
}

const resolver = ref(
	zodResolver(
		z.object({
			gestionUno: z
				.array(z.date(), { message: 'Debe seleccionar un rango de fechas' })
				.min(2, { message: 'Debe seleccionar un rango de fechas' })
				.nonempty({ message: 'Debe seleccionar un rango de fechas' }),
		})
	)
)

const buscar = async ({ valid }) => {
	if (!valid) return
	await generarReporte(busqueda.value)
	if (busqueda.value.gestionDos.length > 0) {
		compare.value = true
	}
}

const exportarPDF = () => {
	downloadReporte(filteredData.value, compare.value, busqueda.value)
}

const totalCantidadPeriodoUno = computed(() => {
	return filteredData.value.reduce(
		(acc, item) => acc + item.cantidadGestion1,
		0
	)
})

const totalImportePeriodoUno = computed(() => {
	return filteredData.value.reduce((acc, item) => acc + item.importeGestion1, 0)
})

const totalCantidadPeriodoDos = computed(() => {
	return filteredData.value.reduce(
		(acc, item) => acc + item.cantidadGestion2,
		0
	)
})

const totalImportePeriodoDos = computed(() => {
	return filteredData.value.reduce((acc, item) => acc + item.importeGestion2, 0)
})

onMounted(() => {
	fetchTipoVisitantes()
})

const dt = ref()
const exportCSV = () => {
	downloadReporteXls(filteredData.value, compare.value, busqueda.value)
}

const searchStates = async (pais) => {
	if (!pais) {
		world.value.states = []
		busqueda.value.estado = null
		return
	}
	loadingStates.value = true
	const code = countries.find((c) => c.country === pais).code
	await loadStates(code)
	loadingStates.value = false
}
</script>
