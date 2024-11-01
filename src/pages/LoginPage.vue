<template>
	<div class="px-6 py-20 md:px-12 lg:px-20">
		<div
			class="bg-surface-0 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto"
		>
			<div class="text-center mb-8">
				<div class="text-surface-900 text-3xl font-medium mb-4">Bienvenido</div>
			</div>

			<form @submit.prevent="login">
				<label for="usuario" class="text-surface-900 font-medium mb-2 block"
					>Usuario</label
				>
				<InputText
					id="usuario"
					v-model="loginForm.username"
					type="text"
					placeholder="Nombre de usuario"
					fluid
					class="mb-4"
				/>

				<label for="password" class="text-surface-900 font-medium mb-2 block"
					>Contraseña</label
				>
				<Password
					id="password"
					v-model="loginForm.password"
					:feedback="false"
					toggleMask
					fluid
					class="mb-4"
				/>

				<div class="flex items-center justify-between mb-4">
					<a
						class="font-medium no-underline ml-2 text-primary text-right cursor-pointer"
						>¿Olvidaste tu constraseña?
					</a>
				</div>
				<div class="mb-12">
					<Message v-if="loginData.show" severity="warn" :life="3000">{{
						loginData.message
					}}</Message>
				</div>

				<Button
					label="Iniciar Sesión"
					icon="pi pi-user"
					class="w-full"
					:type="submit"
					:loading="actionState"
				/>
			</form>
		</div>
	</div>
</template>
<script setup>
import { useAuth } from '@/composables/useAuth'
const { loginForm, loginData, actionState, login } = useAuth()
</script>
