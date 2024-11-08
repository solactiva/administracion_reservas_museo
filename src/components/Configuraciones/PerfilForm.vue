<template>
	<div class="my-5">
		<div v-if="interactividad.loading">
			<LoaderComponent />
		</div>
		<Form
			v-else
			v-slot="$form"
			:resolver="resolver"
			:initialValues="usuario"
			@submit="actualizarPerfil"
			class="flex flex-col gap-4 w-full md:w-1/2"
		>
			<div class="flex flex-col gap-1">
				<label for="nombreCompleto" class="font-medium">Nombre Completo</label>
				<InputText
					name="nombreCompleto"
					type="text"
					fluid
					v-model="usuario.nombreCompleto"
				/>
				<small class="text-xs text-gray-500"
					>Este nombre será visible en la aplicación y reportes.
				</small>
				<Message
					v-if="$form.nombreCompleto?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ $form.nombreCompleto.error?.message }}</Message
				>
			</div>
			<div class="flex flex-col gap-1">
				<label for="correo" class="font-medium">Correo Electrónico</label>
				<InputText name="correo" type="text" fluid v-model="usuario.correo" />
				<small class="text-xs text-gray-500"
					>Este correo será utilizado para recibir notificaciones y recuperar
					credenciales.
				</small>
				<Message
					v-if="$form.correo?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ $form.correo.error?.message }}</Message
				>
			</div>
			<Button
				type="submit"
				label="Guardar"
				class="w-32"
				:loading="interactividad.action"
			/>
		</Form>
	</div>
</template>
<script setup>
import LoaderComponent from '@/components/LoaderComponent.vue'
import { onMounted, ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useUsuarios } from '@/composables/useUsuarios'

const { usuario, interactividad, cargarPerfil, actualizarPerfil } =
	useUsuarios()

const resolver = ref(
	zodResolver(
		z.object({
			nombreCompleto: z.string().min(1, { message: 'El nombre es requerido' }),
			correo: z
				.string()
				.min(1, { message: 'Dirección de correo es requerido' })
				.email({ message: 'Dirección de correo invalida.' }),
		})
	)
)

onMounted(() => {
	const identificador = localStorage.getItem('identificador')
	cargarPerfil(identificador)
})
</script>
