<template>
	<div class="my-5 text-xl text-primary font-bold">Programaciones</div>
	<div
		v-if="interactividad.action"
		class="flex h-screen justify-center items-center"
	>
		<ProgressSpinner />
	</div>
	<div v-else>
		<ScheduleXCalendar v-if="calendarApp" :calendar-app="calendarApp" />
	</div>
	<Dialog
		v-model:visible="visible"
		modal
		header="Header"
		:style="{ width: '50vw' }"
		:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
	>
		<p class="m-0">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
			veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
			commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
			velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
			cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
			est laborum.
		</p>
	</Dialog>
</template>

<script setup>
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
	createCalendar,
	createViewDay,
	createViewMonthAgenda,
	createViewMonthGrid,
	createViewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { useProgramaciones } from '@/composables/useProgramaciones'
import { onMounted, watch, ref } from 'vue'
import { format } from '@formkit/tempo'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()
const visible = ref(false)

const confirmDrop = (event) => {
	const eventDrag = programaciones.value.find((el) => el.id === event.id)
	confirm.require({
		message: '¿Estás seguro de que deseas mover este evento?',
		header: 'Confirmar',
		icon: 'pi pi-exclamation-triangle',
		accept: async () => {
			console.log('Evento movido')
			await actualizarUpdateDrop(event)
		},
		reject: () => {
			console.log('Movimiento cancelado')
			console.log('Evento original', eventDrag)

			eventsServicePlugin.update(eventDrag)
		},
	})
}

const {
	programaciones,
	interactividad,
	cargarProgramaciones,
	actualizarUpdateDrop,
} = useProgramaciones()

const eventsServicePlugin = createEventsServicePlugin()
const calendarApp = createCalendar(
	{
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
		locale: 'es-ES',
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
				console.log('onEventClick', calendarEvent)
				visible.value = true
			},
			onDoubleClickDateTime(dateTime) {
				console.log('onEventClick', dateTime)
			},
		},
		selectedDate: format(new Date(), 'YYYY-MM-DD'),
		weekOptions: {
			gridHeight: 750,
		},
		monthGridOptions: {
			nEventsPerDay: 3,
		},
		views: [
			createViewDay(),
			createViewWeek(),
			createViewMonthGrid(),
			createViewMonthAgenda(),
		],
		events: [],
	},
	[eventsServicePlugin, createDragAndDropPlugin()]
)

onMounted(async () => {
	await cargarProgramaciones()
	eventsServicePlugin.set(programaciones.value)
})

watch(
	programaciones,
	(newProgramaciones) => {
		console.log('New Fetched Programaciones')
		eventsServicePlugin.set(newProgramaciones)
	},
	{ deep: true }
)
</script>
