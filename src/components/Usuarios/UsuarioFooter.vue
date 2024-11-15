<template>
	<Button label="Cancelar" text @click="closeDialog" />
	<Button
		type="submit"
		:label="update ? 'Actualizar' : 'Crear'"
		form="usuarioForm"
		:loading="interactividad.action"
	/>
</template>
<script setup>
import { inject, onMounted, ref } from 'vue'
import { useUsuarios } from '@/composables/useUsuarios'

const { interactividad } = useUsuarios()
const dialogRef = inject('dialogRef')
const update = ref(false)

onMounted(() => {
	update.value = dialogRef.value.data.update
})

const closeDialog = () => {
	dialogRef.value.close()
}
</script>
