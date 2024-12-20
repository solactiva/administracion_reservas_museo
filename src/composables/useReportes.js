import { getDatosReporte } from '@/services/reportesService'
import { ref } from 'vue'

export const useReportes = () => {
	const dataReporte = ref(null)
	const filteredData = ref([])

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

		console.log(res)

		filteredData.value = segmento
			? res.filter((item) => item.segmento === segmento)
			: res
	}

	return {
		filteredData,
		generarReporte,
	}
}
