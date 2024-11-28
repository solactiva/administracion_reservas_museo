import { storeToRefs } from 'pinia'
import {
	getReservas,
	getReserva,
	getStates,
	getCities,
	postConfirmacion,
	postRechazo,
	postReserva,
	deleteReserva,
} from '@/services/reservasService'
import { useReservaStore } from '@/stores/reservaStore'
import { useToast } from 'primevue/usetoast'

export const useReservas = () => {
	const reservaStore = useReservaStore()
	const {
		reserva,
		horario,
		world,
		selectedPlace,
		interactividad,
		reservas,
		reservaSeleccionada,
		reservasConfirmadas,
		reservasPendientes,
		reservasRechazadas,
	} = storeToRefs(reservaStore)
	const toast = useToast()

	const loadStates = async (country_code) => {
		world.value.states = []
		world.value.cities = []
		interactividad.value.loading = true
		world.value.states = await getStates(country_code)
		interactividad.value.loading = false
	}

	const loadCities = async (state_id) => {
		world.value.cities = []
		interactividad.value.loading = true
		world.value.cities = await getCities(state_id)
		interactividad.value.loading = false
	}

	const loadReservas = async (idEvento) => {
		interactividad.value.loadingTable = true
		const response = await getReservas(idEvento)
		interactividad.value.loadingTable = false
		if (response.success) {
			reservas.value = getReservaDateFormated(response.data)
		}
	}

	const loadReserva = async (idReserva) => {
		interactividad.value.loadingModal = true
		const response = await getReserva(idReserva)
		interactividad.value.loadingModal = false
		if (response.success) {
			reservaSeleccionada.value = response.data
		}
	}

	const getReservaDateFormated = (data) => {
		return [...(data || [])].map((d) => {
			const [year, month, day] = d.programacion.fecha.split('-')
			d.fechaRegistro = new Date(d.fechaRegistro)
			d.programacion.fecha = new Date(year, month - 1, day)

			return d
		})
	}

	const confirmarReserva = async () => {
		const payload = {
			identificador: reservaSeleccionada.value.identificador,
			idProg: reservaSeleccionada.value.programacion.identificador,
			pago: reservaSeleccionada.value.pago,
		}

		interactividad.value.action = true
		const response = await postConfirmacion(payload)
		interactividad.value.action = false
		if (response.success) {
			reservaSeleccionada.value.estado = 'confirmado'
			const indiceReserva = reservas.value.findIndex(
				(r) => r.identificador === payload.identificador
			)
			reservas.value = reservas.value.with(indiceReserva, {
				...reservas.value[indiceReserva],
				estado: 'confirmado',
			})
			toast.add({
				severity: 'success',
				summary: 'Reserva confirmada',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al confirmar reserva',
				detail: response.message,
				life: 3000,
			})
		}
	}
	const rechazarReserva = async () => {
		const payload = {
			identificador: reservaSeleccionada.value.identificador,
			idProg: reservaSeleccionada.value.programacion.identificador,
		}
		interactividad.value.action = true
		const response = await postRechazo(payload)
		interactividad.value.action = false
		if (response.success) {
			reservaSeleccionada.value.estado = 'rechazado'
			const indiceReserva = reservas.value.findIndex(
				(r) => r.identificador === payload.identificador
			)
			reservas.value = reservas.value.with(indiceReserva, {
				...reservas.value[indiceReserva],
				estado: 'rechazado',
			})
			toast.add({
				severity: 'success',
				summary: 'Reserva rechazada',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al rechazar reserva',
				detail: response.message,
				life: 3000,
			})
		}
	}
	const registrarReserva = async () => {
		reserva.value.idProg = horario.value.identificador
		reserva.value.cliente.nombre = reserva.value.cliente.nombre.toUpperCase()
		reserva.value.cliente.email = reserva.value.cliente.email.toLowerCase()
		reserva.value.fechaRegistro = new Date().toISOString()
		reserva.value.cantidadTotal = reserva.value.cantidad.reduce(
			(acc, curr) => acc + curr.cantidad,
			0
		)
		reserva.value.cantidadTotalAdicional =
			reserva.value.cantidadAdicional.reduce(
				(acc, curr) => acc + curr.cantidad,
				0
			)
		interactividad.value.action = true
		const response = await postReserva(reserva.value)
		interactividad.value.action = false

		if (response.success) {
			reservas.value.push(reserva.value)
			toast.add({
				severity: 'success',
				summary: 'Reserva registrada',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al registrar reserva',
				detail: response.message,
				life: 3000,
			})
		}
	}

	const eliminarReserva = async (id) => {
		const { identificador, programacion } = reservas.value.find(
			(r) => r.identificador === id
		)
		const payload = {
			identificador,
			idProg: programacion.identificador,
		}
		interactividad.value.action = true
		const response = await deleteReserva(payload)
		interactividad.value.action = false
		if (response.success) {
			const indiceReserva = reservas.value.findIndex(
				(r) => r.identificador === id
			)
			reservas.value = reservas.value.with(indiceReserva, {
				...reservas.value[indiceReserva],
				estado: 'eliminado',
			})
			toast.add({
				severity: 'success',
				summary: 'Reserva eliminada',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al eliminar reserva',
				detail: response.message,
				life: 3000,
			})
		}
	}

	const cleanReserva = () => {
		reservaStore.resetStore()
	}

	return {
		reserva,
		horario,
		world,
		selectedPlace,
		interactividad,
		reservaSeleccionada,
		reservasConfirmadas,
		reservasPendientes,
		reservasRechazadas,

		loadStates,
		loadCities,
		loadReservas,
		loadReserva,
		registrarReserva,
		confirmarReserva,
		rechazarReserva,
		cleanReserva,
		eliminarReserva,
	}
}
