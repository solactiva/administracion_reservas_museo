<template>
	<div class="my-5">
		<Form
			v-slot="form"
			:resolver="resolver"
			:initialValues="usuario"
			@submit="onFormSubmit"
			class="flex flex-col gap-4 w-full sm:w-1/2"
		>
			<div class="flex flex-col gap-1">
				<label for="password" class="font-medium">Contraseña Anterior</label>
				<Password
					name="password"
					type="password"
					fluid
					v-model="usuario.password"
					:feedback="false"
				/>
				<Message
					v-if="form.password?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ form.password.error?.message }}</Message
				>
			</div>
			<div class="flex flex-col gap-1">
				<label for="nuevaContrasena" class="font-medium"
					>Nueva Contraseña</label
				>
				<Password
					name="nuevaContrasena"
					type="password"
					fluid
					v-model="usuario.nuevaContrasena"
				/>
				<Message
					v-if="form.nuevaContrasena?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ form.nuevaContrasena.error?.message }}</Message
				>
			</div>
			<div class="flex flex-col gap-1">
				<label for="confirmarContrasena" class="font-medium"
					>Confirmar Contraseña</label
				>
				<Password
					name="confirmarContrasena"
					type="password"
					fluid
					v-model="usuario.confirmarContrasena"
					:feedback="false"
				/>
				<Message
					v-if="form.confirmarContrasena?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ form.confirmarContrasena.error?.message }}</Message
				>
			</div>
			<Button type="submit" label="Guardar" class="w-32" />
		</Form>
	</div>
</template>
<script setup>
import { useUsuarios } from '@/composables/useUsuarios'
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const { usuario, interactividad } = useUsuarios()

const resolver = ref(
	zodResolver(
		z.object({
			password: z.string().min(1, 'La contraseña anterior es requerida'),
			nuevaContrasena: z.string().min(1, 'La nueva contraseña es requerida'),
			confirmarContrasena: z
				.string()
				.min(1, 'La confirmación de la contraseña es requerida')
				.refine((data) => data === usuario.value.nuevaContrasena, {
					message: 'Las contraseñas no coinciden',
				}),
		})
	)
)

const onFormSubmit = async (form) => {
	console.log(form)
}
</script>
