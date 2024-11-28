<template>
	<div class="flex flex-col-reverse md:flex-row gap-2 mt-5 w-full">
		<Button
			label="Cerrar"
			severity="secondary"
			@click="closeDialog"
			class="w-full mt-3 md:mt-0 md:w-auto"
		/>
		<Button
			label="Cancelar Reserva"
			severity="danger"
			:loading="interactividad.action"
			@click="actionRechazarReserva"
			size="small"
			text
			class="w-full md:w-auto mr-auto md:order-first"
		/>
		<Button
			label="Confirmar Reserva"
			severity="primary"
			:loading="interactividad.action"
			@click="actionConfirmarReserva"
			class="w-full md:w-auto"
		/>
	</div>
</template>
<script setup>
import { inject } from 'vue'
import { useReservas } from '@/composables/useReservas'
import { useConfirm } from 'primevue/useconfirm'

const { interactividad, rechazarReserva, confirmarReserva } = useReservas()
const dialogRef = inject('dialogRef')

const confirm = useConfirm()
const actionRechazarReserva = () => {
	confirm.require({
		group: 'danger',
		header: 'Rechazar Reserva',
		message: '¿Está seguro que desea cancelar la reserva?',
		icon: 'pi pi-exclamation-triangle',
		accept: async () => {
			await rechazarReserva()
			closeDialog()
		},
		reject: () => {},
	})
}
const actionConfirmarReserva = () => {
	confirm.require({
		message: '¿Está seguro que desea confirmar la reserva?',
		header: 'Confirmación',
		icon: 'pi pi-check',
		rejectProps: {
			label: 'No',
			severity: 'secondary',
			text: true,
		},
		acceptProps: {
			label: 'Si',
		},
		accept: async () => {
			await confirmarReserva()
			closeDialog()
		},
		reject: () => {},
	})
}
const closeDialog = () => {
	dialogRef.value.close()
}
</script>
