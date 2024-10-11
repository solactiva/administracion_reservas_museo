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
</template>

<script setup>
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
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
import { onMounted, watch } from 'vue'

const { programaciones, interactividad, cargarProgramaciones } =
	useProgramaciones()

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
			onEventClick(calendarEvent) {
				console.log('onEventClick', calendarEvent)
			},
		},
		selectedDate: '2024-10-11',
		views: [
			createViewDay(),
			createViewWeek(),
			createViewMonthGrid(),
			createViewMonthAgenda(),
		],
		events: [],
	},
	[createDragAndDropPlugin(), createResizePlugin(), eventsServicePlugin]
)

onMounted(async () => {
	await cargarProgramaciones()
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
