<template>
	<Form
		v-slot="$form"
		:resolver="resolver"
		:initialValues="visitante"
		@submit="seleccionarAccion"
		class="flex flex-col gap-4"
		id="form-visitante"
		name="form-visitante"
	>
		<div class="flex flex-col gap-1">
			<label for="nombre" class="font-medium">Nombre</label>
			<InputText name="nombre" type="text" fluid v-model="visitante.nombre" />
			<small class="text-xs text-gray-500">Nombre del tipo de visitante.</small>
			<Message
				v-if="$form.nombre?.invalid"
				severity="error"
				size="small"
				variant="simple"
				>{{ $form.nombre.error?.message }}</Message
			>
		</div>
		<div class="flex flex-col gap-1">
			<label for="descripcion" class="font-medium">Descripción</label>
			<Textarea
				name="descripcion"
				type="text"
				fluid
				v-model="visitante.descripcion"
			/>
			<small class="text-xs text-gray-500"
				>Descripción del tipo de visitante.</small
			>
		</div>
	</Form>
</template>
<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { inject, ref } from 'vue'
import { z } from 'zod'
import { useTipoVisitantes } from '@/composables/useTipoVisitantes'

const dialogRef = inject('dialogRef')
const { visitante, createTipoVisitante, updateTipoVisitante } =
	useTipoVisitantes()

const resolver = ref(
	zodResolver(
		z.object({
			nombre: z.string().min(1, { message: 'El nombre es requerido.' }),
		})
	)
)

const seleccionarAccion = ({ valid }) => {
	if (!valid) return
	if (dialogRef.value.data.update) actualizarVisitante()
	else guardarVisitante()
}

const guardarVisitante = async () => {
	console.log('Guardando...')
	await createTipoVisitante(visitante.value)
	dialogRef.value.close()
}

const actualizarVisitante = async () => {
	console.log('Actualizando...')
	await updateTipoVisitante(visitante.value)
	dialogRef.value.close()
}
</script>
