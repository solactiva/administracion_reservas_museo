<template>
	<Button
		label="Cancelar"
		icon="pi pi-times"
		class="text-sm justify-start"
		text
		rounded
		severity="danger"
		@click="actionCancelar"
	/>
	<Button
		label="Guardar"
		icon="pi pi-save"
		class="text-sm justify-start"
		text
		rounded
		type="submit"
		form="form-visitante"
	/>
</template>
<script setup>
import { inject } from 'vue'

const dialogRef = inject('dialogRef')

const actionCancelar = () => {
	dialogRef.value.close()
}
</script>
