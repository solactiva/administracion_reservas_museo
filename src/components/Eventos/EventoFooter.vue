<template>
	<Button label="Cancelar" text @click="closeDialog" />
	<Button
		:label="update ? 'Actualizar' : 'Crear'"
		@click="
			update ? actualizarEvento(eventoSelected) : crearEvento(eventoSelected)
		"
		:loading="interactividad.loading"
	/>
</template>
<script setup>
import { useEventos } from '@/composables/useEventos'
import { inject, onMounted, ref } from 'vue'

const { eventoSelected, interactividad, actualizarEvento, crearEvento } =
	useEventos()
const dialogRef = inject('dialogRef')
const update = ref(false)

onMounted(() => {
	update.value = dialogRef.value.data.update
})

const closeDialog = () => {
	dialogRef.value.close()
}
</script>
