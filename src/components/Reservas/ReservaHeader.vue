<template>
	<div class="flex flex-col w-full">
		<h2 class="text-lg font-bold mb-1">Datos de reserva</h2>
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-sm">
			<div class="flex flex-col items-center">
				<span class="font-bold">HORARIO</span>
				<span>{{ `${horario.inicioEvento} - ${horario.finEvento}` }}</span>
			</div>
			<div class="flex flex-col items-center">
				<span class="font-bold">CUPOS</span>
				<span>{{ cuposRestantes }}</span>
			</div>
			<div class="flex flex-col items-center">
				<span class="font-bold">TOTAL</span>
				<span>{{ precioTotal }} BOB</span>
			</div>
			<div class="flex flex-col items-center">
				<span class="font-bold">TOTAL Desc.</span>
				<span>{{ precioTotalDesc }} BOB</span>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useReservas } from '@/composables/useReservas'
import { useEventos } from '@/composables/useEventos'
import { computed, watch } from 'vue'

const { reserva, horario } = useReservas()
const { evento } = useEventos()

const precioTotal = computed(() => {
	const total = reserva.value.cantidad.reduce(
		(acc, curr, index) =>
			acc + curr.cantidad * evento.value.precios[index].precio,
		0
	)
	const adicionales = reserva.value.cantidadAdicional.reduce(
		(acc, curr, index) =>
			acc + curr.cantidad * evento.value.precios[index].precio,
		0
	)
	return total + adicionales
})

const precioTotalDesc = computed(() => {
	const total = reserva.value.cantidad.reduce(
		(acc, curr, index) =>
			acc + curr.cantidad * evento.value.precios[index].precio,
		0
	)
	const adicionales = reserva.value.cantidadAdicional.reduce(
		(acc, curr, index) =>
			acc + curr.cantidad * evento.value.precios[index].precio,
		0
	)
	return total + adicionales - reserva.value.pago.descuento
})

const cuposRestantes = computed(() => {
	return (
		horario.value.spots -
		reserva.value.cantidad.reduce((acc, curr) => acc + curr.cantidad, 0)
	)
})

watch(precioTotal, (value) => {
	reserva.value.pago.total = value
})
watch(precioTotalDesc, (value) => {
	reserva.value.pago.totalDesc = value
})
</script>
