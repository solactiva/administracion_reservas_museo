<template>
	<div class="my-5 text-xl text-primary font-bold">Reportes y Estadisticas</div>
	<Chart
		type="bar"
		:data="chartData"
		:options="chartOptions"
		class="chart-container"
	/>
</template>
<script setup>
import { ref, onMounted } from 'vue'

onMounted(() => {
	chartData.value = setChartData()
	chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
	return {
		labels: ['Q1', 'Q2', 'Q3', 'Q4'],
		datasets: [
			{
				label: 'Sales',
				data: [540, 325, 702, 620],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
				],
				borderWidth: 2,
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
		plugins: {
			legend: {
				labels: {
					color: textColor,
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: textColorSecondary,
				},
				grid: {
					color: surfaceBorder,
				},
			},
			y: {
				beginAtZero: true,
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
<style lang="css" module>
.chart-container {
	background: linear-gradient(
		to bottom,
		rgba(249, 115, 22, 0.2),
		rgba(6, 182, 212, 0.2),
		rgb(107, 114, 128, 0.2),
		rgba(139, 92, 246, 0.2)
	);
}
</style>
