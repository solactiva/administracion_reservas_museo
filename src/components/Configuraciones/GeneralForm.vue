<template>
	<div
		v-if="interactividad.loading"
		class="flex h-auto justify-center items-center"
	>
		<LoaderComponent />
	</div>
	<div class="flex flex-col gap-7 my-5" v-else>
		<div class="flex flex-col items-start gap-1">
			<span class="font-medium">QR pago de reservas</span>
			<Image alt="Image" preview class="w-[150px]">
				<template #image>
					<img
						:src="configuracion.qrPago"
						alt="image"
						class="rounded-3xl"
						style="width: 150px; height: 150px; object-fit: cover"
					/>
				</template>
				<template #preview="slotProps">
					<img
						:src="configuracion.qrPago"
						alt="preview"
						:style="slotProps.style"
						@click="slotProps.onClick"
					/>
				</template>
			</Image>
			<FileUpload
				mode="basic"
				name="qr-pago"
				accept="image/*"
				:maxFileSize="5000000"
				invalidFileSizeMessage="Tamaño de archivo excedido"
				invalidFileTypeMessage="Tipo de archivo no permitido"
				@select="onUpload"
				customUpload
				auto
				chooseLabel="Subir QR de pago"
				chooseIcon="pi pi-upload"
				:choose-button-props="{ size: 'small', severity: 'secondary' }"
				class="text-sm w-44"
			/>
			<small class="text-xs text-gray-500"
				>Imagen QR para el pago de reservas. Formato: PNG, JPG, JPEG. Tamaño
				máximo: 5MB.
			</small>
		</div>
		<div class="flex flex-col gap-1">
			<label for="" class="font-medium">Tiempo para liberar cupos:</label>
			<InputGroup class="w-56">
				<InputNumber
					type="number"
					showButtons
					:min="2"
					:max="15"
					v-model="configuracion.tiempoEspera"
				/>
				<InputGroupAddon>min.</InputGroupAddon>
			</InputGroup>
			<span class="text-xs text-gray-500"
				>Tiempo en minutos que se liberarán los cupos de una reserva no
				confirmada.</span
			>
		</div>
		<Button
			label="Guardar"
			@click="actualizarConfiguracion"
			:loading="interactividad.action"
			class="w-32"
		/>
	</div>
</template>
<script setup>
import LoaderComponent from '@/components/LoaderComponent.vue'
import { useConfiguraciones } from '@/composables/useConfiguraciones'
import { onMounted } from 'vue'

const {
	configuracion,
	interactividad,
	cargarConfiguracion,
	actualizarConfiguracion,
} = useConfiguraciones()

const onUpload = (event) => {
	const file = event.files[0]
	const reader = new FileReader()

	reader.onload = async (e) => {
		configuracion.value.qrPago = e.target.result
	}

	reader.readAsDataURL(file)
}

onMounted(() => {
	cargarConfiguracion()
})
</script>
