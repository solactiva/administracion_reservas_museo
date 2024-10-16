<template>
	<div class="flex items-center">
		<h3 class="text-xl font-semibold mr-3">
			{{
				interactividad.loading ? '' : programacionSeleccionada.evento?.nombre
			}}
		</h3>
		<Button
			label="Eliminar"
			icon="pi pi-trash"
			text
			severity="danger"
			size="small"
			@click="confirmEliminar"
			rounded
		/>
	</div>
</template>
<script setup>
import { useProgramaciones } from '@/composables/useProgramaciones'
import { useConfirm } from 'primevue/useconfirm'
import { inject } from 'vue'

const dialogRef = inject('dialogRef')
const { programacionSeleccionada, interactividad, eliminarProgramacion } =
	useProgramaciones()
const confirm = useConfirm()

const closeDialog = (e) => {
	dialogRef.value.close(e)
}

const confirmEliminar = () => {
	confirm.require({
		message: '¿Está seguro de eliminar la programación?',
		header: 'Confirmar',
		icon: 'pi pi-exclamation-triangle',
		acceptProps: { label: 'Sí', icon: 'pi pi-check', size: 'small' },
		rejectProps: {
			label: 'No',
			icon: 'pi pi-times',
			size: 'small',
			text: true,
		},
		accept: async () => {
			await eliminarProgramacion(programacionSeleccionada.value.identificador)
			closeDialog({ buttonType: 'Cancel' })
		},
	})
}
</script>
