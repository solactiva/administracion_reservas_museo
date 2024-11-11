<template>
	<div class="container flex flex-col gap-4">
		<div class="flex flex-col">
			<label>Selecciona rango de fechas de programación:</label>
			<DatePicker
				v-model="programacionGenerador.dates"
				selectionMode="range"
				:manualInput="false"
			/>
		</div>
		<div class="flex flex-col">
			<label>Agrega horas de inicio del horario:</label>
			<InputGroup>
				<InputMask
					id="basic"
					v-model="programacionGenerador.time"
					mask="99:99"
					placeholder="00:00"
				/>
				<Button
					icon="pi pi-plus"
					@click="
						programacionGenerador.horarios.push({
							inicioEvento: programacionGenerador.time,
						})
					"
				/>
			</InputGroup>
		</div>
		<div class="flex flex-col">
			<h3>Horarios:</h3>
			<div class="flex flex-wrap gap-2">
				<template
					v-for="(el, index) in programacionGenerador.horarios"
					:key="index"
				>
					<Chip
						:label="el.inicioEvento"
						removable
						v-on:remove="programacionGenerador.horarios.splice(index, 1)"
					/>
				</template>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useProgramaciones } from '@/composables/useProgramaciones'

const { programacionGenerador } = useProgramaciones()
</script>
