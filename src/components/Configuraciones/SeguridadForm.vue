<template>
	<div class="my-5">
		<Form
			v-slot="form"
			:resolver="resolver"
			:initialValues="usuario"
			@submit="actualizarContrasena"
			class="flex flex-col gap-4 w-full md:w-1/2"
		>
			<div class="flex flex-col gap-1">
				<label for="password" class="font-medium">Contraseña Anterior</label>
				<Password
					name="password"
					type="password"
					fluid
					v-model="usuario.password"
					:feedback="false"
					toggleMask
				/>
				<small class="text-xs text-gray-500">
					Para cambiar la contraseña, es necesario ingresar la contraseña
					anterior.
				</small>
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
					toggleMask
				/>
				<small class="text-xs text-gray-500">
					La contraseña debe tener al menos 8 caracteres.
				</small>
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
					toggleMask
				/>
				<small class="text-xs text-gray-500">
					Confirma la nueva contraseña ingresada.
				</small>
				<Message
					v-if="form.confirmarContrasena?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ form.confirmarContrasena.error?.message }}</Message
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
import { useUsuarios } from '@/composables/useUsuarios'
import { onMounted, ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const { usuario, interactividad, actualizarContrasena } = useUsuarios()

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

onMounted(() => {
	usuario.value = {
		...usuario.value,
		password: '',
		nuevaContrasena: '',
		confirmarContrasena: '',
	}
})
</script>
