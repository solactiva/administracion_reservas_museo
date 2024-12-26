import { getDatosReporte, generatePdfReport } from '@/services/reportesService'
import { ref } from 'vue'

export const useReportes = () => {
	const dataReporte = ref(null)
	const filteredData = ref([])
	const loading = ref(false)

	const generarReporte = async (json) => {
		const { segmento } = json

		const response = await getDatosReporte(json)
		if (!response.success) return
		dataReporte.value = response.data

		const resActual = dataReporte.value.actual
			.flatMap((item) => {
				const precios = item.evento.precios
				return [...item.cantidad, ...(item.cantidadAdicional || [])].map(
					(entry) => ({
						...entry,
						precio: precios.find((p) => p.tipo === entry.tipo)?.precio || 0,
					})
				)
			})
			.reduce((acc, { tipo, cantidad, precio }) => {
				if (!acc[tipo]) {
					acc[tipo] = {
						segmento: tipo,
						cantidadGestion1: 0,
						importeGestion1: 0,
					}
				}
				acc[tipo].cantidadGestion1 += cantidad
				acc[tipo].importeGestion1 += cantidad * precio
				return acc
			}, {})

		const resAnterior = dataReporte.value.anterior
			? dataReporte.value.anterior
					.flatMap((item) => {
						const precios = item.evento.precios
						return [...item.cantidad, ...(item.cantidadAdicional || [])].map(
							(entry) => ({
								...entry,
								precio: precios.find((p) => p.tipo === entry.tipo)?.precio || 0,
							})
						)
					})
					.reduce((acc, { tipo, cantidad, precio }) => {
						if (!acc[tipo]) {
							acc[tipo] = {
								segmento: tipo,
								cantidadGestion2: 0,
								importeGestion2: 0,
							}
						}
						acc[tipo].cantidadGestion2 += cantidad
						acc[tipo].importeGestion2 += cantidad * precio
						return acc
					}, {})
			: []

		const res = Object.values(resActual).map((item) => ({
			...item,
			...resAnterior[item.segmento],
		}))

		filteredData.value = segmento
			? res.filter((item) => item.segmento === segmento)
			: res

		filteredData.value = filteredData.value.map((item) => ({
			...item,
			diferenciaCantidad: item.cantidadGestion1 - item.cantidadGestion2,
			porcentajeCantidad:
				((item.cantidadGestion1 - item.cantidadGestion2) /
					item.cantidadGestion2) *
				100,
			diferenciaImporte: item.importeGestion1 - item.importeGestion2,
			porcentajeImporte:
				((item.importeGestion1 - item.importeGestion2) / item.importeGestion2) *
				100,
		}))
	}

	const downloadReporte = (data, compare, search) => {
		const json = {
			search,
			data,
			compare,
		}

		loading.value = true

		generatePdfReport(json).then((response) => {
			loading.value = false
			const url = window.URL.createObjectURL(new Blob([response]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', 'reporte.pdf')
			document.body.appendChild(link)
			link.click()
		})
	}

	return {
		filteredData,
		loading,
		generarReporte,
		downloadReporte,
	}
}
