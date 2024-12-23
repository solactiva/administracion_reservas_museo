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
						<Message
							v-if="$form.gestionDos?.invalid"
							severity="error"
							size="small"
							variant="simple"
							>{{ $form.gestionDos.error?.message }}</Message
						>
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
						/>
						<small class="text-xs text-gray-500"
							>Si no selecciona un evento se tomarán todos los eventos.
						</small>
						<Message
							v-if="$form.evento?.invalid"
							severity="error"
							size="small"
							variant="simple"
							>{{ $form.evento.error?.message }}</Message
						>
					</div>
					<div class="flex flex-col gap-1">
						<label for="nombreCompleto" class="font-medium"
							>Tipo de Segmento</label
						>
						<Select
							name="segmento"
							v-model="busqueda.segmento"
							:options="
								eventos.find((e) => e.identificador === busqueda.evento)
									?.precios
							"
							optionLabel="tipo"
							optionValue="tipo"
							placeholder="Seleccione un evento"
							:disabled="!busqueda.evento"
						/>
						<small class="text-xs text-gray-500"
							>Si no se selecciona un segmento se mostrarán todos.
						</small>
						<Message
							v-if="$form.segmento?.invalid"
							severity="error"
							size="small"
							variant="simple"
							>{{ $form.segmento.error?.message }}</Message
						>
					</div>
					<Button type="submit" label="Buscar" icon="pi pi-search" outlined />
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
					<Button
						icon="pi pi-file-pdf"
						label="Exportar PDF"
						size="small"
						text
						:disabled="filteredData.length === 0"
						@click="exportarPDF"
					/>
				</template>
				<DataTable
					:value="filteredData"
					tableStyle="min-width: 50rem;"
					showGridlines
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
						<Column>
							<template #body="{ data }">
								{{ data.cantidadGestion1 - data.cantidadGestion2 }}
							</template>
						</Column>
						<Column field="porcentajeCantidad" />
						<Column field="diferenciaImporte" />
						<Column field="porcentajeImporte" />
					</template>
				</DataTable>
			</Panel>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useEventos } from '@/composables/useEventos'
import { useReportes } from '@/composables/useReportes'

const { eventos } = useEventos()
const { filteredData, generarReporte, downloadReporte } = useReportes()

const busqueda = ref({
	gestionUno: [],
	gestionDos: [],
	evento: null,
	segmento: null,
})

const compare = ref(false)

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
</script>
