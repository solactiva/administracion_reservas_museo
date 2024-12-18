<template>
	<div class="my-5 text-xl text-primary font-bold flex justify-between">
		<div>Reportes y Estadisticas</div>
		<div>
			<Button
				icon="pi pi-download"
				severity="secondary"
				size="small"
				outlined
				rounded
				label="Descargar"
				@click="actionDescargar"
			/>
		</div>
	</div>
	<div class="grid grid-cols-3 gap-3">
		<div class="col-span-2">
			<Panel header="Ventas por fecha">
				<Chart
					type="bar"
					:data="chartData"
					:options="chartOptions"
					class="h-[15rem]"
				/>
			</Panel>
		</div>
		<div class="col-span-1">
			<Panel header="Eventos"> </Panel>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const actionDescargar = () => {
	const confirmacion = confirm('¿Desea descargar el reporte?')
	console.log(confirmacion)
}

onMounted(() => {
	chartData.value = setChartData()
	chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
	const documentStyle = getComputedStyle(document.documentElement)

	return {
		labels: ['2024-11-19', '2024-11-21', '2024-11-29'],
		datasets: [
			{
				type: 'bar',
				label: 'Adulto (Nacional) 2024',
				backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
				data: [13, 2, 1],
				stack: 'stack0',
			},
			{
				type: 'bar',
				label: 'Adulto (Extranjero) 2024',
				backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
				data: [3, 0, 0],
				stack: 'stack0',
			},
			{
				type: 'bar',
				label: 'Niño(a) 2024',
				backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
				data: [0, 0, 1],
				stack: 'stack0',
			},
			{
				type: 'bar',
				label: 'Adulto (Nacional)',
				backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
				data: [7, 3, 0],
			},
			{
				type: 'bar',
				label: 'Adulto (Extranjero)',
				backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
				data: [1, 1, 2],
			},
			{
				type: 'bar',
				label: 'Niño(a)',
				backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
				data: [0, 5, 0],
			},
		],
	}
}
const setChartOptions = () => {
	const documentStyle = getComputedStyle(document.documentElement)
	const textColor = documentStyle.getPropertyValue('--p-text-color')
	const textColorSecondary = documentStyle.getPropertyValue(
		'--p-text-muted-color'
	)
	const surfaceBorder = documentStyle.getPropertyValue(
		'--p-content-border-color'
	)

	return {
		maintainAspectRatio: false,
		aspectRatio: 0.8,
		plugins: {
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			legend: {
				labels: {
					color: textColor,
				},
			},
		},
		scales: {
			x: {
				stacked: true,
				ticks: {
					color: textColorSecondary,
				},
				grid: {
					color: surfaceBorder,
				},
			},
			y: {
				stacked: true,
				ticks: {
					color: textColorSecondary,
				},
				grid: {
					color: surfaceBorder,
				},
			},
		},
	}
}
</script>
