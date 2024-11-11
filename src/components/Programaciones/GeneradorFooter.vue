<template>
	<Button label="Cancelar" text @click="closeDialog" />
	<Button
		label="Generar"
		:loading="interactividad.loading"
		@click="generarProgramacion"
	/>
</template>
<script setup>
import { useProgramaciones } from '@/composables/useProgramaciones'
import { useEventos } from '@/composables/useEventos'
import { format } from '@formkit/tempo'
import { inject } from 'vue'

const { interactividad, programacionGenerador, crearProgramaciones } =
	useProgramaciones()
const { eventoSelected } = useEventos()
const dialogRef = inject('dialogRef')

const generarProgramacion = async () => {
	const rangoFechas = {
		inicio: format(
			new Date(programacionGenerador.value.dates[0]),
			'YYYY-MM-DD'
		),
		fin: format(new Date(programacionGenerador.value.dates[1]), 'YYYY-MM-DD'),
	}

	const payloadProgramacion = {
		rangoFechas,
		horarios: programacionGenerador.value.horarios,
	}
	interactividad.value.loading = true
	await crearProgramaciones(payloadProgramacion, eventoSelected.value)
	interactividad.value.loading = false
	interactividad.value.visibleProgramacion = false
}

const closeDialog = () => {
	dialogRef.value.close()
}
</script>
