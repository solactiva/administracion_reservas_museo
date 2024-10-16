<template>
	<div class="my-5 text-xl text-primary font-bold">Programaciones</div>
	<div
		v-if="interactividad.action"
		class="flex h-screen justify-center items-center"
	>
		<ProgressSpinner />
	</div>
	<div v-else>
		<ScheduleXCalendar :calendar-app="calendarApp" />
	</div>
	<DynamicDialog />
</template>

<script setup>
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
	createCalendar,
	viewDay,
	viewMonthAgenda,
	viewMonthGrid,
	viewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { useProgramaciones } from '@/composables/useProgramaciones'
import { watch, shallowRef, markRaw, defineAsyncComponent } from 'vue'
import { format } from '@formkit/tempo'
import { useConfirm } from 'primevue/useconfirm'
import { useDialog } from 'primevue/usedialog'

const FormularioProgramacion = defineAsyncComponent(() =>
	import('@/components/FormularioProgramacion.vue')
)
const HeaderFormulario = defineAsyncComponent(() =>
	import('@/components/HeaderFormulario.vue')
)

const confirm = useConfirm()
const dialog = useDialog()

const confirmDrop = (event) => {
	const eventDrag = programaciones.value.find((el) => el.id === event.id)
	confirm.require({
		message: '¿Estás seguro de que deseas mover este evento?',
		header: 'Confirmar',
		icon: 'pi pi-exclamation-triangle',
		acceptProps: { label: 'Sí', icon: 'pi pi-check', size: 'small' },
		rejectProps: {
			label: 'No',
			icon: 'pi pi-times',
			size: 'small',
			text: true,
		},
		accept: async () => {
			await actualizarUpdateDrop(event)
		},
		reject: () => {
			eventsServicePlugin.update(eventDrag)
		},
	})
}

const showProgramacion = async (id) => {
	// eslint-disable-next-line no-unused-vars
	const dialogRef = dialog.open(FormularioProgramacion, {
		props: {
			breakpoints: {
				'960px': '75vw',
				'640px': '90vw',
			},
			modal: true,
		},
		templates: {
			header: markRaw(HeaderFormulario),
		},
	})
	await cargarProgramacion(id)
}

const {
	programaciones,
	interactividad,
	cargarProgramaciones,
	cargarProgramacion,
	actualizarUpdateDrop,
} = useProgramaciones()

const eventsServicePlugin = createEventsServicePlugin()
const calendarControlsPlugin = createCalendarControlsPlugin()
const calendarApp = shallowRef(
	createCalendar({
		selectedDate: format(new Date(), 'YYYY-MM-DD'),
		locale: 'es-ES',
		views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
		defaultView: viewWeek.name,
		calendars: {
			'd999971a-613f-4093-9361-9213f819d011': {
				colorName: 'normal',
				lightColors: {
					main: '#f9d71c',
					container: '#fff5aa',
					onContainer: '#594800',
				},
				darkColors: {
					main: '#fff5c0',
					onContainer: '#fff5de',
					container: '#a29742',
				},
			},
			'8ef9c902-fa84-4a35-9039-5c254fa45d2a': {
				colorName: 'especial',
				lightColors: {
					main: '#1cf9b0',
					container: '#dafff0',
					onContainer: '#004d3d',
				},
				darkColors: {
					main: '#c0fff5',
					onContainer: '#e6fff5',
					container: '#42a297',
				},
			},
		},
		plugins: [
			eventsServicePlugin,
			createDragAndDropPlugin(),
			calendarControlsPlugin,
		],
		firstDayOfWeek: 0,
		dayBoundaries: {
			start: '07:00',
			end: '17:00',
		},
		isResponsive: true,
		callbacks: {
			onEventUpdate(updatedEvent) {
				confirmDrop(updatedEvent)
			},
			onEventClick(calendarEvent) {
				showProgramacion(calendarEvent.id)
			},
			onDoubleClickDateTime(dateTime) {
				console.log('onEventClick', dateTime)
			},
		},
		weekOptions: {
			gridHeight: 750,
		},
		monthGridOptions: {
			nEventsPerDay: 3,
		},
		events: [],
	})
)

cargarProgramaciones().then(() => {
	eventsServicePlugin.set(programaciones.value)
})

watch(
	programaciones,
	(newProgramaciones) => {
		eventsServicePlugin.set(newProgramaciones)
	},
	{ deep: true }
)
</script>
