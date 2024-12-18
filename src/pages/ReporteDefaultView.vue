<template>
	<div class="flex flex-col gap-5">
		<div class="mt-5">
			<Card header="Reporte">
				<template #title>Formulario de reporte</template>
				<template #content>
					<div>
						<Form
							v-slot="$form"
							:resolver="resolver"
							:initialValues="busqueda"
							@submit="buscar"
							class="flex flex-col gap-4 w-full xl:w-1/2"
						>
							<div class="grid grid-cols-2 gap-4">
								<div class="flex flex-col gap-1">
									<label for="nombreCompleto" class="font-medium"
										>Primera Gestión</label
									>
									<DatePicker
										v-model="busqueda.gestionUno"
										selectionMode="range"
										:manualInput="false"
									/>
									<small class="text-xs text-gray-500"
										>Rango de fechas para reporte.
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
										>Segunda Gestión</label
									>
									<DatePicker
										v-model="busqueda.gestionDos"
										selectionMode="range"
										:manualInput="false"
									/>
									<small class="text-xs text-gray-500"
										>Segundo rango de fechas para comparación.
									</small>
									<Message
										v-if="$form.gestionDos?.invalid"
										severity="error"
										size="small"
										variant="simple"
										>{{ $form.gestionDos.error?.message }}</Message
									>
								</div>
							</div>
							<div class="flex flex-col gap-1">
								<label for="nombreCompleto" class="font-medium"
									>Tipo de Evento</label
								>
								<Select
									v-model="busqueda.evento"
									:options="eventos"
									optionLabel="name"
									placeholder="Seleccione un evento"
								/>
								<small class="text-xs text-gray-500"
									>Seleccione un evento para filtrar.
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
									v-model="busqueda.segmento"
									:options="segmentos"
									optionLabel="name"
									placeholder="Seleccione un evento"
								/>
								<small class="text-xs text-gray-500"
									>Seleccione un segmento para filtrar.
								</small>
								<Message
									v-if="$form.segmento?.invalid"
									severity="error"
									size="small"
									variant="simple"
									>{{ $form.segmento.error?.message }}</Message
								>
							</div>
							<Button type="submit" label="Buscar" icon="pi pi-search" />
						</Form>
					</div>
				</template>
			</Card>
		</div>
		<div>
			<Card>
				<template #content>
					<DataTable
						:value="dataFetch"
						showGridlines
						tableStyle="min-width: 50rem;"
					>
						<ColumnGroup type="header">
							<Row>
								<Column header="Segmento" :rowspan="2" />
								<Column header="1ra Gestion" :colspan="2" />
								<Column header="2da Gestion" :colspan="2" />
								<Column header="Dif." :colspan="4" />
							</Row>
							<Row>
								<Column header="Cantidad" field="cantidadGestion1" />
								<Column header="Importe neto" field="importeGestion1" />
								<Column header="Cantidad" field="cantidadGestion2" />
								<Column header="Importe neto" field="importeGestion2" />
								<Column header="Cantidad" field="cantidadDifGestion1" />
								<Column header="%" field="porcentajeDifGestion1" />
								<Column header="Importe neto" field="cantidadDifGestion2" />
								<Column header="%" field="porcentajeDifGestion2" />
							</Row>
						</ColumnGroup>
						<Column field="segmento" />
						<Column field="cantidadGestion1" />
						<Column field="importeGestion1" />
						<Column field="cantidadGestion2" />
						<Column field="importeGestion2" />
						<Column field="cantidadDifGestion1" />
						<Column field="porcentajeDifGestion1" />
						<Column field="cantidadDifGestion2" />
						<Column field="porcentajeDifGestion2" />
					</DataTable>
				</template>
			</Card>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const dataFetch = ref([
	{
		segmento: 'Segmento 1',
		cantidadGestion1: 10,
		importeGestion1: 1000,
		cantidadGestion2: 20,
		importeGestion2: 2000,
		cantidadDifGestion1: 10,
		porcentajeDifGestion1: 100,
		cantidadDifGestion2: 20,
		porcentajeDifGestion2: 100,
	},
	{
		segmento: 'Segmento 2',
		cantidadGestion1: 20,
		importeGestion1: 2000,
		cantidadGestion2: 40,
		importeGestion2: 4000,
		cantidadDifGestion1: 20,
		porcentajeDifGestion1: 100,
		cantidadDifGestion2: 40,
		porcentajeDifGestion2: 100,
	},
])

const resolver = ref(
	zodResolver(
		z.object({
			eventos: z.array(z.object({ name: z.string(), code: z.string() })),
		})
	)
)

const busqueda = ref({})

const eventos = ref([
	{ name: 'Evento 1', code: '1' },
	{ name: 'Evento 2', code: '2' },
	{ name: 'Evento 3', code: '3' },
])

const segmentos = ref([
	{ name: 'Segmento 1', code: '1' },
	{ name: 'Segmento 2', code: '2' },
	{ name: 'Segmento 3', code: '3' },
])

const buscar = ({ valid }) => {
	if (!valid) return
	console.log('Buscando...')
}
</script>
