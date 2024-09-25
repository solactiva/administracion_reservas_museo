<template>
	<div class="container">
		<h1>Reservas Museo del Chocolate</h1>
		<div>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Fecha</th>
						<th scope="col">Cliente</th>
						<th scope="col">Total</th>
						<th scope="col">Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="reserva in reservas" :key="reserva.identificador">
						<th scope="row">{{ reserva.programacion.fecha }}</th>
						<td>{{ reserva.cliente.nombre }}</td>
						<td>{{ reserva.pago.total }}</td>
						<td>
							<button
								type="button"
								class="btn btn-primary btn-sm"
								data-bs-toggle="modal"
								data-bs-target="#exampleModal"
								@click="verReserva(reserva.identificador)"
							>
								Ver
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<!-- Modal -->
	<div
		class="modal fade"
		id="exampleModal"
		tabindex="-1"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true"
		data-bs-backdrop="static"
	>
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">
						Confirmación de Pago
					</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					></button>
				</div>
				<div class="modal-body">
					<div class="d-flex flex-row">
						<div class="col-6">
							<img
								:src="reservaFiltrada?.pago.comprobante"
								alt=""
								class="img-fluid"
							/>
						</div>
						<div class="col-6">
							<table class="table">
								<tbody>
									<tr
										v-for="(tipo, index) in reservaFiltrada?.cantidad"
										:key="index"
									>
										<td>{{ tipo?.tipo }}</td>
										<td>{{ tipo?.cantidad }}</td>
									</tr>
									<tr>
										<td>Total</td>
										<td>
											{{ reservaFiltrada?.cantidadTotal }}
										</td>
									</tr>
									<tr>
										<td>Pago Total</td>
										<td>{{ reservaFiltrada?.pago.total }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal"
					>
						Cancelar
					</button>
					<button
						type="button"
						class="btn btn-success"
						@click="confirmarReserva"
						:disabled="loading"
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const reservas = ref([])
const reservaFiltrada = ref(null)
const loading = ref(false)

onMounted(async () => {
	reservas.value = await traerReservas()
})

const traerReservas = async () => {
	const res = await fetch('https://n8ntest.friktek.com/webhook/confirmaciones')
	const data = await res.json()
	return data.data
}

const confirmarReserva = async () => {
	loading.value = true
	const res = await fetch(
		'https://n8ntest.friktek.com/webhook/confirmaciones',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				identificador: reservaFiltrada.value.identificador,
			}),
		}
	)
	loading.value = false
	const data = await res.json()
	console.log(data)
	if (data.success) {
		reservas.value.splice(reservas.value.indexOf(reservaFiltrada.value), 1)
		alert(`${data.message}`)
		return
	}

	return
}

const verReserva = (id) => {
	reservaFiltrada.value = reservas.value.find(
		(reserva) => reserva.identificador === id
	)
}
</script>
<style scoped></style>
