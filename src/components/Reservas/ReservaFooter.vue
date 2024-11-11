<template>
	<div class="flex gap-2 mt-5">
		<Button label="Cancelar" @click="closeDialog" severity="secondary" />
		<Button
			label="Registrar"
			severity="primary"
			:loading="interactividad.action"
			@click="actionReservar"
		/>
	</div>
</template>
<script setup>
import { inject } from 'vue'
import { useReservas } from '@/composables/useReservas'
import { useHorarios } from '@/composables/useHorarios'

const { interactividad, registrarReserva } = useReservas()
const { cargarHorarios } = useHorarios()
const dialogRef = inject('dialogRef')

const closeDialog = () => {
	dialogRef.value.close()
}

const actionReservar = async () => {
	await registrarReserva()
	await cargarHorarios(dialogRef.value.data.fecha, dialogRef.value.data.id)
	closeDialog()
}
</script>
