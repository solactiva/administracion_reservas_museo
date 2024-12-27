import {
	getDatosReporte,
	generatePdfReport,
	generateXlsReport,
} from '@/services/reportesService'
import { getTipoVisitantes } from '@/services/tipoVisitanteService'
import { ref } from 'vue'

export const useReportes = () => {
	const dataReporte = ref(null)
	const tiposPrecio = ref(null)
	const filteredData = ref([])
	const loading = ref(false)

	const generarReporte = async (json) => {
		const { segmento } = json

		const resTiposPrecio = await getTipoVisitantes()
		if (!resTiposPrecio.success) return
		tiposPrecio.value = resTiposPrecio.data

		const response = await getDatosReporte(json)
		if (!response.success) return
		dataReporte.value = response.data

		const resActual = dataReporte.value.actual
			.flatMap((item) => {
				const precios = item.evento?.precios || []
				return [
					...(item.cantidad || []),
					...(item.cantidadAdicional || []),
					...tiposPrecio.value.map((el) => ({
						tipo: el.nombre,
						cantidad: 0,
					})),
				].map((entry) => ({
					...entry,
					precio: precios.find((p) => p.tipo === entry.tipo)?.precio || 0,
				}))
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
						const precios = item.evento?.precios || []
						return [
							...(item.cantidad || []),
							...(item.cantidadAdicional || []),
							...tiposPrecio.value.map((el) => ({
								tipo: el.nombre,
								cantidad: 0,
							})),
						].map((entry) => ({
							...entry,
							precio: precios.find((p) => p.tipo === entry.tipo)?.precio || 0,
						}))
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
				item.cantidadGestion2 === 0
					? 0
					: ((item.cantidadGestion1 - item.cantidadGestion2) /
							item.cantidadGestion2) *
					  100,
			diferenciaImporte: item.importeGestion1 - item.importeGestion2,
			porcentajeImporte:
				item.importeGestion2 === 0
					? 0
					: ((item.importeGestion1 - item.importeGestion2) /
							item.importeGestion2) *
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

		/* generatePdfReport(json).then((response) => {
			loading.value = false
			const url = window.URL.createObjectURL(new Blob([response]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', 'reporte.pdf')
			document.body.appendChild(link)
			link.click()
		}) */

		generatePdfReport(json).then((response) => {
			loading.value = false
			// Crear un objeto URL con el PDF
			const url = window.URL.createObjectURL(
				new Blob([response], { type: 'application/pdf' })
			)
			// Abrir el PDF en una nueva pestaña
			const newWindow = window.open(url, '_blank')
			if (newWindow) {
				// Esperar a que la pestaña cargue y luego imprimir automáticamente
				newWindow.onload = () => {
					newWindow.print()
				}
			} else {
				console.error(
					'No se pudo abrir una nueva ventana. Verifica los permisos del navegador.'
				)
			}
		})
	}

	const downloadReporteXls = (data, compare, search) => {
		const json = {
			search,
			data,
			compare,
		}

		loading.value = true

		generateXlsReport(json).then((response) => {
			loading.value = false
			const url = window.URL.createObjectURL(new Blob([response]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', 'reporte.xls')
			document.body.appendChild(link)
			link.click()
		})
	}

	return {
		filteredData,
		loading,
		generarReporte,
		downloadReporte,
		downloadReporteXls,
	}
}
