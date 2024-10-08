<template>
	<div class="container py-4 mx-auto">
		<div class="flex">
			<h1 class="text-xl font-bold text-primary-300 px-3">Eventos</h1>
			<Button
				icon="pi pi-plus"
				text
				class="p-0 m-0"
				size="small"
				v-tooltip="'Crear nuevo evento'"
				@click="actionCrearEvento"
			/>
		</div>
		<Divider class="mt-2 mb-6" />
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<Card
				style="overflow: hidden"
				v-for="el in eventos"
				:key="el.identificador"
			>
				<template #header>
					<div
						class="h-full text-end"
						:class="el.activo ? 'bg-green-200' : ' bg-slate-200'"
					>
						<Button
							icon="pi pi-cog"
							class="text-primary-950"
							:class="el.activo ? 'hover:bg-green-300' : 'hover:bg-slate-300'"
							severity="secondary"
							text
							rounded
							@click="toggle($event, el.identificador)"
						/>
					</div>
				</template>
				<template #title> {{ el.nombre }} </template>
				<template #content>
					<p class="text-sm">{{ el.descripcion }}</p>
					<Divider type="dashed" />
					<div class="flex flex-col gap-2">
						<span><i class="pi pi-users"></i> {{ el.capacidad }}</span>
						<span><i class="pi pi-clock"></i> {{ el.duracion }} min</span>
					</div>
				</template>
			</Card>
		</div>
	</div>
	<Popover ref="op">
		<div class="flex flex-col gap-1 p-0">
			<Button
				icon="pi pi-pencil"
				class="text-primary-950 hover:bg-gray-100 text-sm justify-start"
				label="Actualizar"
				text
				rounded
				@click="actionActualizarEvento(selectedId)"
			/>
			<Button
				icon="pi pi-clock"
				class="text-primary-950 hover:bg-gray-100 text-sm justify-start text-start"
				label="Generar Programación"
				text
				rounded
				@click="actionProgramacionEvento(selectedId)"
			/>
			<Divider type="dashed" class="m-0" />
			<Button
				icon="pi pi-trash"
				class="bg-red-100 text-red-600 hover:bg-red-200 text-sm justify-start"
				label="Eliminar"
				text
				rounded
				@click="confirmDelete(selectedId)"
			/>
		</div>
	</Popover>
	<Dialog
		v-model:visible="interactividad.visible"
		modal
		:header="update ? 'Actualizar Evento' : 'Crear Nuevo Evento'"
		:pt="{
			root: 'w-11/12 md:w-9/12 lg:w-6/12 text-sm',
		}"
	>
		<div class="flex flex-col gap-3">
			<div class="grid grid-cols-6 gap-2">
				<div class="col-span-4 flex flex-col">
					<label>Nombre Evento:</label>
					<InputText v-model="eventoSelected.nombre" class="h-8" />
				</div>
				<div class="flex items-end w-full col-span-2">
					<ToggleButton
						v-model="eventoSelected.activo"
						class="w-24 h-8"
						onLabel="Activado"
						offLabel="Desactivado"
					/>
				</div>
			</div>
			<div class="flex flex-col">
				<label>Descripción:</label>
				<InputText v-model="eventoSelected.descripcion" class="h-8" />
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div class="flex flex-col">
					<label>Capacidad:</label>
					<InputNumber v-model="eventoSelected.capacidad" fluid class="h-8" />
				</div>
				<div class="flex flex-col">
					<label>Duración (min):</label>
					<InputNumber v-model="eventoSelected.duracion" fluid class="h-8" />
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<div>
					<label for="precio-evento">Precios:</label>
					<InputGroup>
						<InputText
							v-model="precio.tipo"
							placeholder="Tipo"
							class="h-8 w-2/3"
						/>
						<InputNumber v-model="precio.precio" class="h-8 w-1/3" />
						<Button
							icon="pi pi-plus"
							severity="primary"
							@click="agregarPrecio"
							class="h-8"
						/>
					</InputGroup>
				</div>
				<InputGroup v-for="(el, index) in eventoSelected.precios" :key="index">
					<InputText v-model="el.tipo" placeholder="Tipo" class="h-8 w-2/3" />
					<InputNumber v-model="el.precio" class="h-8 w-1/3" />
					<Button
						icon="pi pi-trash"
						severity="danger"
						@click="eventoSelected.precios.splice(index, 1)"
						class="h-8"
					/>
				</InputGroup>
			</div>
			<div class="flex flex-wrap gap-2">
				<label class="w-full">Días que el evento no estara activo:</label>
				<div
					v-for="dia of semana"
					:key="dia.value"
					class="flex items-center gap-1"
				>
					<Checkbox
						v-model="eventoSelected.diasNoActivo"
						:inputId="dia.label"
						name="dia"
						:value="dia.value"
					/>
					<label :for="dia.label" class="text-xs">{{ dia.label }}</label>
				</div>
			</div>
		</div>
		<template #footer>
			<Button label="Cancelar" text @click="interactividad.visible = false" />
			<Button
				:label="update ? 'Actualizar' : 'Crear'"
				@click="
					update
						? actualizarEvento(eventoSelected)
						: crearEvento(eventoSelected)
				"
				:loading="interactividad.loading"
			/>
		</template>
	</Dialog>
	<Dialog
		v-model:visible="interactividad.visibleProgramacion"
		modal
		header="Programación de Evento"
		:pt="{
			root: 'w-11/12 md:w-9/12 lg:w-6/12 text-sm',
		}"
	>
		<div class="container flex flex-col gap-4">
			<div class="flex flex-col">
				<label>Selecciona rango de fechas de programación:</label>
				<DatePicker
					v-model="programacion.dates"
					selectionMode="range"
					:manualInput="false"
				/>
			</div>
			<div class="flex flex-col">
				<label>Agrega horas de inicio del horario:</label>
				<InputGroup>
					<InputMask
						id="basic"
						v-model="programacion.time"
						mask="99:99"
						placeholder="00:00"
					/>
					<Button
						icon="pi pi-plus"
						@click="
							programacion.horarios.push({
								inicioEvento: programacion.time,
							})
						"
					/>
				</InputGroup>
			</div>
			<div class="flex flex-col">
				<h3>Horarios:</h3>
				<div class="flex flex-wrap gap-2">
					<template v-for="(el, index) in programacion.horarios" :key="index">
						<Chip
							:label="el.inicioEvento"
							removable
							v-on:remove="programacion.horarios.splice(index, 1)"
						/>
					</template>
				</div>
			</div>
		</div>
		<template #footer>
			<Button
				label="Cancelar"
				text
				@click="interactividad.visibleProgramacion = false"
			/>
			<Button
				label="Generar"
				:loading="interactividad.loading"
				@click="generarProgramacion"
			/>
		</template>
	</Dialog>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useEventos } from '@/composables/useEventos'
import { useProgramaciones } from '@/composables/useProgramaciones'
import { format } from '@formkit/tempo'

const {
	eventos,
	eventoSelected,
	interactividad,
	cargarEventos,
	cargarEventoUpdate,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
	cleanEvento,
} = useEventos()
const { crearProgramaciones } = useProgramaciones()
const toast = useToast()
const confirm = useConfirm()
const op = ref()
const update = ref(false)
const selectedId = ref()
const precio = ref({
	tipo: '',
	precio: 0,
})
const semana = ref([
	{ label: 'Lunes', value: 1 },
	{ label: 'Martes', value: 2 },
	{ label: 'Miércoles', value: 3 },
	{ label: 'Jueves', value: 4 },
	{ label: 'Viernes', value: 5 },
	{ label: 'Sábado', value: 6 },
	{ label: 'Domingo', value: 0 },
])

const agregarPrecio = () => {
	eventoSelected.value.precios.push({ ...precio.value })
	precio.value = { tipo: '', precio: 0 }
}

const toggle = (event, identificador) => {
	op.value.hide()
	if (selectedId.value === identificador) {
		selectedId.value = null
	} else {
		selectedId.value = identificador
		nextTick(() => {
			op.value.show(event)
		})
	}
}
const confirmDelete = (id) => {
	confirm.require({
		message: '¿Estás seguro de eliminar este evento?',
		header: 'Precuación',
		icon: 'pi pi-info-circle',
		rejectProps: {
			label: 'Cancelar',
			severity: 'secondary',
			outlined: true,
		},
		acceptProps: {
			label: 'Eliminar',
			severity: 'danger',
			loading: interactividad.value.loading,
		},
		accept: async () => {
			await eliminarEvento(id)
		},
		reject: () => {
			toast.add({
				severity: 'warn',
				summary: 'Cancelado',
				detail: 'Operación cancelada',
				life: 3000,
			})
		},
	})
}
const actionActualizarEvento = async (id) => {
	cargarEventoUpdate(id)
	update.value = true
	interactividad.value.visible = true
}
const actionCrearEvento = () => {
	cleanEvento()
	update.value = false
	interactividad.value.visible = true
}

const actionProgramacionEvento = async (id) => {
	cargarEventoUpdate(id)
	interactividad.value.visibleProgramacion = true
}

const programacion = ref({
	dates: null,
	time: null,
	horarios: [],
})

const generarProgramacion = async () => {
	const rangoFechas = {
		inicio: format(new Date(programacion.value.dates[0]), 'YYYY-MM-DD'),
		fin: format(new Date(programacion.value.dates[1]), 'YYYY-MM-DD'),
	}

	const payloadProgramacion = {
		rangoFechas,
		horarios: programacion.value.horarios,
	}
	interactividad.value.loading = true
	await crearProgramaciones(payloadProgramacion, eventoSelected.value)
	interactividad.value.loading = false
	interactividad.value.visibleProgramacion = false
}
cargarEventos()
</script>
<style scoped></style>
