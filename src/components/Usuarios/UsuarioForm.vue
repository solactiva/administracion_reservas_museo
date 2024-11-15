<template>
	<Form
		id="usuarioForm"
		name="usuarioForm"
		v-slot="$form"
		:resolver="resolver"
		:initial-values="usuarioPayload"
		@submit="submitForm"
		class="flex flex-col gap-4 w-full"
	>
		<div class="flex flex-col gap-1">
			<label for="nombreCompleto" class="font-medium">Nombre Completo</label>
			<InputText
				name="nombreCompleto"
				type="text"
				fluid
				v-model="usuarioPayload.nombreCompleto"
			/>
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
			<InputText
				name="correo"
				type="text"
				fluid
				v-model="usuarioPayload.correo"
			/>
			<Message
				v-if="$form.correo?.invalid"
				severity="error"
				size="small"
				variant="simple"
				>{{ $form.correo.error?.message }}</Message
			>
		</div>
		<div class="flex flex-col gap-1">
			<label for="username" class="font-medium">Usuario</label>
			<InputText
				name="username"
				type="text"
				fluid
				v-model="usuarioPayload.username"
				:disabled="update"
			/>
			<Message
				v-if="$form.username?.invalid"
				severity="error"
				size="small"
				variant="simple"
				>{{ $form.username.error?.message }}</Message
			>
		</div>
		<div class="flex flex-col gap-1">
			<label for="rol" class="font-medium">Rol de Usuario</label>
			<Dropdown
				name="rol"
				v-model="usuarioPayload.rol"
				:options="roles"
				optionLabel="nombre"
				optionValue="identificador"
			/>
			<Message
				v-if="$form.rol?.invalid"
				severity="error"
				size="small"
				variant="simple"
				>{{ $form.rol.error?.message }}</Message
			>
		</div>
		<div class="flex flex-col gap-1">
			<label for="password" class="font-medium">Contraseña</label>
			<Password
				name="password"
				type="password"
				fluid
				v-model="usuarioPayload.password"
				:feedback="false"
				toggleMask
			/>
			<Message
				v-if="$form.password?.invalid"
				severity="error"
				size="small"
				variant="simple"
				>{{ $form.password.error?.message }}</Message
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
				v-model="usuarioPayload.confirmarContrasena"
				:feedback="false"
				toggleMask
			/>
			<Message
				v-if="$form.confirmarContrasena?.invalid"
				severity="error"
				size="small"
				variant="simple"
				>{{ $form.confirmarContrasena.error?.message }}</Message
			>
		</div>
	</Form>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue'
import { useUsuarios } from '@/composables/useUsuarios'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const { usuarioPayload, registrarUsuario, actualizarUsuario } = useUsuarios()

const roles = ref([
	{ identificador: 1, nombre: 'Administrador' },
	{ identificador: 2, nombre: 'Usuario' },
])

const resolver = ref(
	zodResolver(
		z.object({
			nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
			correo: z
				.string()
				.min(1, { message: 'Dirección de correo es requerido' })
				.email('El correo electrónico no es válido'),
			username: z.string().min(1, 'El nombre de usuario es requerido'),
			rol: z.number().min(1, 'El rol de usuario es requerido'),
			password: z.string().min(1, 'La contraseña es requerida'),
			confirmarContrasena: z
				.string()
				.min(1, 'La confirmación de contraseña es requerida')
				.refine((data) => data === usuarioPayload.value.password, {
					message: 'Las contraseñas no coinciden',
				}),
		})
	)
)

const submitForm = ({ valid }) => {
	if (!valid) return
	if (update.value) {
		actualizarUsuario()
	} else {
		registrarUsuario()
	}
}

const dialogRef = inject('dialogRef')
const update = ref(false)

onMounted(() => {
	update.value = dialogRef.value.data.update
})
</script>
