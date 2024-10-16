<template>
	<div class="flex justify-center" v-if="interactividad.loading">
		<ProgressSpinner
			style="width: 50px; height: 50px"
			strokeWidth="8"
			fill="transparent"
			animationDuration=".5s"
			aria-label="Custom ProgressSpinner"
		/>
	</div>
	<div v-else class="flex flex-col gap-2">
		<div>
			<FloatLabel variant="in">
				<DatePicker
					inputId="fecha"
					v-model="programacionSeleccionada.fecha"
					showIcon
					iconDisplay="input"
					dateFormat="yy-mm-dd"
					showButtonBar
					fluid
				/>
				<label for="fecha">Fecha:</label>
			</FloatLabel>
		</div>
		<div class="flex gap-2">
			<FloatLabel variant="in">
				<InputText
					id="inicioEvento"
					v-model="programacionSeleccionada.inicioEvento"
					autocomplete="off"
				/>
				<label for="inicioEvento">Hora Inicio:</label>
			</FloatLabel>
			<FloatLabel variant="in">
				<InputText
					id="finEvento"
					v-model="programacionSeleccionada.finEvento"
					autocomplete="off"
				/>
				<label for="finEvento">Hora Finalización:</label>
			</FloatLabel>
		</div>
	</div>
</template>
<script setup>
import { useProgramaciones } from '@/composables/useProgramaciones'
import FloatLabel from 'primevue/floatlabel'
const { programacionSeleccionada, interactividad } = useProgramaciones()
</script>
