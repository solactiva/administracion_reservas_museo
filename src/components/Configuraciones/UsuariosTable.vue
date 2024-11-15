<template>
	<DataTable :value="new Array(3)" v-if="interactividad.loading">
		<template #header>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div></div>
				<Button icon="pi pi-refresh" @click="loadUsuarios" rounded raised />
			</div>
		</template>
		<Column field="name" header="Nombre">
			<template #body>
				<Skeleton></Skeleton>
			</template>
		</Column>
		<Column field="category" header="Usuario">
			<template #body>
				<Skeleton></Skeleton>
			</template>
		</Column>
		<Column field="quantity" header="Rol de Usuario">
			<template #body>
				<Skeleton></Skeleton>
			</template>
		</Column>
	</DataTable>
	<DataTable :value="usuarios" tableStyle="min-width: 50rem" v-else>
		<template #header>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div></div>
				<div class="flex gap-2">
					<Button
						icon="pi pi-plus"
						@click="actionCreateUsuario"
						rounded
						raised
					/>
					<Button icon="pi pi-refresh" @click="loadUsuarios" rounded raised />
				</div>
			</div>
		</template>
		<Column field="nombreCompleto" header="Nombre"></Column>
		<Column field="username" header="Usuario"></Column>
		<Column field="rol" header="Rol de Usuario"></Column>
		<Column bodyStyle="text-align: center; overflow: visible">
			<template #body="slotProps">
				<Button
					type="button"
					icon="pi pi-pencil"
					text
					rounded
					severity="secondary"
					size="small"
					:disabled="slotProps.data.identificador === usuario.identificador"
					@click="actionEditUsuario(slotProps.data.identificador)"
				/>
				<Button
					v-if="slotProps.data.username !== 'admin'"
					type="button"
					icon="pi pi-trash"
					text
					rounded
					severity="danger"
					size="small"
					:disabled="slotProps.data.identificador === usuario.identificador"
					@click="actionDeleteUsuario(slotProps.data.identificador)"
				/>
			</template>
		</Column>
	</DataTable>
</template>
<script setup>
import { useUsuarios } from '@/composables/useUsuarios'
import { useConfirm } from 'primevue/useconfirm'
import { useDialog } from 'primevue/usedialog'
import { defineAsyncComponent, markRaw, ref } from 'vue'

const UsuarioForm = defineAsyncComponent(() =>
	import('@/components/Usuarios/UsuarioForm.vue')
)
const UsuarioFooter = defineAsyncComponent(() =>
	import('@/components/Usuarios/UsuarioFooter.vue')
)

const {
	usuario,
	usuarios,
	interactividad,
	loadUsuarios,
	cargarUsuarioEdit,
	cleanUsuarioPayload,
	eliminarUsuario,
} = useUsuarios()

const confirm = useConfirm()
const dialog = useDialog()
const update = ref(false)

const actionDeleteUsuario = (id) => {
	confirm.require({
		message: '¿Estás seguro de eliminar este usuario?',
		header: '¡Atención!',
		icon: 'pi pi-exclamation-triangle',
		rejectProps: {
			label: 'Cancelar',
			severity: 'secondary',
			outlined: true,
		},
		acceptProps: {
			label: 'Eliminar',
		},
		accept: () => {
			eliminarUsuario(id)
		},
		reject: () => {},
	})
}

const actionCreateUsuario = () => {
	cleanUsuarioPayload()
	update.value = false
	openModalUsuario()
}
const actionEditUsuario = (id) => {
	cargarUsuarioEdit(id)
	update.value = true
	openModalUsuario()
}

const openModalUsuario = () => {
	const title = update.value ? 'Editar usuario' : 'Agregar nuevo usuario'
	// eslint-disable-next-line no-unused-vars
	const dialogRef = dialog.open(UsuarioForm, {
		props: {
			header: title,
			style: {
				width: '50vw',
			},
			breakpoints: {
				'960px': '75vw',
				'640px': '90vw',
			},
			modal: true,
		},
		templates: {
			footer: markRaw(UsuarioFooter),
		},
		data: {
			update: update.value,
		},
	})
}

loadUsuarios()
</script>
