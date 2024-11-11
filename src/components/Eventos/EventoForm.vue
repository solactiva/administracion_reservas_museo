<template>
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
				v-for="(dia, index) of semana"
				:key="index"
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
</template>
<script setup>
import { ref } from 'vue'
import { useEventos } from '@/composables/useEventos'

const { eventoSelected } = useEventos()

const semana = ref([
	{ label: 'Lunes', value: 1 },
	{ label: 'Martes', value: 2 },
	{ label: 'Miércoles', value: 3 },
	{ label: 'Jueves', value: 4 },
	{ label: 'Viernes', value: 5 },
	{ label: 'Sábado', value: 6 },
	{ label: 'Domingo', value: 0 },
])

const precio = ref({
	tipo: '',
	precio: 0,
})

const agregarPrecio = () => {
	eventoSelected.value.precios.push({ ...precio.value })
	precio.value = { tipo: '', precio: 0 }
}
</script>
