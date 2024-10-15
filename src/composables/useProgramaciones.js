import { storeToRefs } from 'pinia'
import {
	postMassiveProgramacion,
	getProgramacionesCalendar,
	getProgramacion,
	putProgramacion,
	deleteProgramacion,
} from '@/services/programacionesService'
import { useProgramacionStore } from '@/stores/programacionStore'
import { useToast } from 'primevue/usetoast'

export const useProgramaciones = () => {
	const programacionStore = useProgramacionStore()
	const { programaciones, interactividad, programacionSeleccionada } =
		storeToRefs(programacionStore)

	const toast = useToast()
	const crearProgramaciones = async (datosHorarios, datosEvento) => {
		const evento = datosEvento
		const programacionTemplate = {
			identificador: '',
			fecha: '',
			inicioEvento: '',
			evento: {
				identificador: '',
				nombre: '',
				descripcion: '',
				duracion: 0,
				capacidad: 0,
				precios: [],
			},
			reservas: [],
			spots: 0,
			finEvento: '',
			activo: true,
		}
		const horario = datosHorarios.horarios
		const rangoFechas = datosHorarios.rangoFechas

		const programaciones = generateProgramaciones(
			evento,
			horario,
			rangoFechas,
			programacionTemplate
		)
		const response = await postMassiveProgramacion(programaciones)
		if (response.success) {
			toast.add({
				severity: 'success',
				summary: 'Creado',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al crear',
				detail: 'Ocurrio un error al crear, comuniquese con el administrador',
				life: 5000,
			})
		}
	}

	const cargarProgramaciones = async () => {
		interactividad.value.action = true
		const response = await getProgramacionesCalendar()
		interactividad.value.action = false
		if (response.success) {
			programaciones.value = response.data
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al cargar',
				detail:
					'Ocurrio un error al cargar las programaciones, comuniquese con el administrador',
				life: 5000,
			})
		}
	}

	const actualizarUpdateDrop = async (evento) => {
		const { id, start, end } = evento
		const payload = {
			identificador: id,
			inicioEvento: start.split(' ')[1],
			finEvento: end.split(' ')[1],
			fecha: start.split(' ')[0],
		}

		const response = await putProgramacion(payload)
		if (response.success) {
			programacionStore.updateDrop(evento)
			toast.add({
				severity: 'success',
				summary: 'Actualizado',
				detail: response.message,
				life: 3000,
			})
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al actualizar',
				detail:
					'Ocurrio un error al actualizar, comuniquese con el administrador',
				life: 5000,
			})
		}
	}

	const cargarProgramacion = async (id) => {
		interactividad.value.loading = true
		const response = await getProgramacion(id)
		interactividad.value.loading = false
		if (response.success) {
			programacionSeleccionada.value = response.data
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error al cargar',
				detail:
					'Ocurrio un error al cargar la programación, comuniquese con el administrador',
				life: 5000,
			})
		}
	}

	function addMinutes(time, minutes) {
		const [hours, mins] = time.split(':').map(Number)
		const date = new Date(Date.UTC(2000, 0, 1, hours, mins + minutes))
		return date.toUTCString().slice(17, 22)
	}

	function generateProgramaciones(
		evento,
		horario,
		rangoFechas,
		programacionTemplate
	) {
		const programaciones = []
		const startDate = new Date(
			Date.UTC(
				parseInt(rangoFechas.inicio.slice(0, 4)),
				parseInt(rangoFechas.inicio.slice(5, 7)) - 1,
				parseInt(rangoFechas.inicio.slice(8, 10))
			)
		)
		const endDate = new Date(
			Date.UTC(
				parseInt(rangoFechas.fin.slice(0, 4)),
				parseInt(rangoFechas.fin.slice(5, 7)) - 1,
				parseInt(rangoFechas.fin.slice(8, 10))
			)
		)

		const diasSemana = [
			'Domingo',
			'Lunes',
			'Martes',
			'Miércoles',
			'Jueves',
			'Viernes',
			'Sábado',
		]

		for (
			let date = new Date(startDate);
			date <= endDate;
			date.setUTCDate(date.getUTCDate() + 1)
		) {
			const diaSemana = date.getUTCDay()
			const fechaISO = date.toISOString().split('T')[0]

			console.log(`Procesando ${fechaISO} (${diasSemana[diaSemana]})`)

			if (evento.diasNoActivo.includes(diaSemana)) {
				console.log(`  Saltando ${diasSemana[diaSemana]} (día ${diaSemana})`)
				continue
			}

			console.log(`  Generando programaciones para ${diasSemana[diaSemana]}`)
			for (const hora of horario) {
				const programacion = {
					...programacionTemplate,
					identificador: crypto.randomUUID(),
					fecha: fechaISO,
					inicioEvento: hora.inicioEvento,
					evento: {
						identificador: evento.identificador,
						nombre: evento.nombre,
						descripcion: evento.descripcion,
						duracion: evento.duracion,
						capacidad: evento.capacidad,
						precios: [...evento.precios],
					},
					spots: evento.capacidad,
					finEvento: addMinutes(hora.inicioEvento, evento.duracion),
				}
				programaciones.push(programacion)
			}
		}

		return programaciones
	}

	return {
		programaciones,
		interactividad,
		programacionSeleccionada,
		crearProgramaciones,
		cargarProgramaciones,
		cargarProgramacion,
		actualizarUpdateDrop,
	}
}
