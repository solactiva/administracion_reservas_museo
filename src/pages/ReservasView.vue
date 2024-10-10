<template>
	<Accordion value="0" class="mb-5">
		<AccordionPanel value="0">
			<AccordionHeader>Registrar reserva</AccordionHeader>
			<AccordionContent>
				<div class="grid grid-cols-1 md:grid-cols-2">
					<div class="flex justify-center mb-5 md:mb-0">
						<DatePicker
							inline
							v-model="fechaSeleccionada"
							:disabled-days="evento?.diasNoActivo"
							:minDate="new Date()"
							@update:modelValue="actualizarHorarios"
						/>
					</div>
					<div class="grid grid-cols-2 gap-4 justify-center" v-if="action">
						<Skeleton
							width="100%"
							height="5rem"
							v-for="index in 6"
							:key="index"
						></Skeleton>
					</div>
					<div class="grid grid-cols-2 gap-4 justify-center" v-else>
						<template v-for="horario in horarios" :key="horario.identificador">
							<Button
								severity="secondary"
								class="flex flex-col items-center"
								@click="registrarDatosReserva(horario.identificador)"
							>
								<div class="text-center font-semibold text-xl">
									{{ `${horario.inicioEvento} - ${horario.finEvento}` }}
								</div>
								<div class="text-center text-sm">
									{{ horario.spots }} disponibles
								</div>
							</Button>
						</template>
					</div>
				</div>
			</AccordionContent>
		</AccordionPanel>
	</Accordion>
	<Dialog
		v-model:visible="visible"
		modal
		:pt="{
			root: 'w-11/12 md:w-9/12 lg:w-6/12',
		}"
	>
		<template #header>
			<div class="flex flex-col w-full">
				<h2 class="text-lg font-bold mb-1">Datos de reserva</h2>
				<div class="grid grid-cols-3 w-full text-sm">
					<div class="flex flex-col items-center">
						<span class="font-bold">HORARIO</span>
						<span>{{ `${horario.inicioEvento} - ${horario.finEvento}` }}</span>
					</div>
					<div class="flex flex-col items-center">
						<span class="font-bold">CUPOS</span>
						<span>{{ cuposRestantes }}</span>
					</div>
					<div class="flex flex-col items-center">
						<span class="font-bold">TOTAL</span>
						<span>{{ precioTotal }} BOB</span>
					</div>
				</div>
			</div>
		</template>
		<div class="w-full mt-2">
			<div class="flex gap-2 md:gap-7">
				<div class="w-5/12 sm:w-1/4 flex flex-col gap-2">
					<div
						v-for="(pago, index) in evento.precios"
						:key="index"
						class="flex flex-col"
					>
						<label :for="`cantidad-personas${index}`" class="text-sm">
							{{ pago.tipo }}
						</label>
						<InputNumber
							inputClass="h-8 w-full"
							:inputId="`cantidad-personas${index}`"
							:invalid="invalid"
							v-model="reserva.cantidad[index].cantidad"
							showButtons
							buttonLayout="horizontal"
							:min="0"
							:max="
								cuposRestantes <= 0
									? reserva.cantidad[index].cantidad
									: horario.spots
							"
						>
							<template #incrementbuttonicon>
								<span class="pi pi-plus" />
							</template>
							<template #decrementbuttonicon>
								<span class="pi pi-minus" />
							</template>
						</InputNumber>
					</div>
				</div>
				<div class="w-7/12 sm:w-3/4">
					<Fieldset
						legend="Adicionales"
						:toggleable="true"
						:collapsed="true"
						v-on:toggle="console.log($event.value ? 'collapsed' : 'expanded')"
					>
						<div
							class="flex flex-col sm:flex-row mb-2"
							v-for="(pago, index) in evento.precios"
							:key="index"
						>
							<label
								:for="`cantidad-adicionales${index}`"
								class="text-sm mt-2 w-full sm:w-3/4"
							>
								{{ pago.tipo }}
							</label>
							<InputNumber
								inputClass="h-8 w-full"
								:inputId="`cantidad-adicionales${index}`"
								:invalid="invalid"
								v-model="reserva.cantidadAdicional[index].cantidad"
								showButtons
								buttonLayout="horizontal"
								:min="0"
							>
								<template #incrementbuttonicon>
									<span class="pi pi-plus" />
								</template>
								<template #decrementbuttonicon>
									<span class="pi pi-minus" />
								</template>
							</InputNumber>
						</div>
					</Fieldset>
				</div>
			</div>
			<Divider type="dashed" />
			<div class="flex flex-col gap-2">
				<div>
					<label for="nombre-cliente" class="text-sm">Nombre completo</label>
					<InputText
						class="uppercase h-8"
						type="text"
						id="nombre-cliente"
						fluid
						v-model="reserva.cliente.nombre"
						:invalid="reserva.cliente.nombre === '' && invalid"
					/>
				</div>
				<div>
					<label for="correo-cliente" class="text-sm">Correo electrónico</label>
					<InputText
						class="lowercase h-8"
						type="email"
						id="correo-cliente"
						fluid
						v-model="reserva.cliente.email"
						:invalid="reserva.cliente.email === '' && invalid"
					/>
				</div>
				<div>
					<label for="lugar-cliente" class="text-sm"
						>Desde donde nos visitas</label
					>
					<InputGroup class="h-8">
						<Select
							v-model="selectedPlace.pais"
							:options="countries"
							optionLabel="country"
							placeholder="🌎"
							class="w-1/3"
							labelClass="text-sm pt-[0.4rem]"
							v-on:update:model-value="loadStates($event.code)"
						>
						</Select>
						<Select
							v-model="selectedPlace.estado"
							:options="world.states"
							optionLabel="name"
							placeholder="Seleccione..."
							class="w-1/3"
							labelClass="text-sm pt-[0.4rem]"
							v-on:update:model-value="loadCities($event.id)"
							:disabled="world.states.length === 0"
							:loading="world.states.length === 0 && interactividad.loading"
						>
						</Select>
						<Select
							v-model="reserva.cliente.ciudad"
							:options="world.cities"
							optionLabel="name"
							optionValue="name"
							placeholder="Seleccione..."
							class="w-1/3"
							labelClass="text-sm pt-[0.4rem]"
							:disabled="world.cities.length === 0"
							:loading="world.cities.length === 0 && interactividad.loading"
						>
						</Select>
					</InputGroup>
				</div>
				<div>
					<label for="numero-cliente" class="text-sm">Número de teléfono</label>
					<InputGroup class="h-8">
						<Select
							v-model="selectedCountry"
							:options="countries"
							optionLabel="country"
							placeholder="🌎"
							class="w-2/5 sm:w-3/12"
							labelClass="text-sm pt-[0.4rem]"
						>
							<template #value="slotProps">
								<div v-if="slotProps.value" class="flex items-center">
									<img
										:alt="slotProps.value.country"
										:src="slotProps.value.flag"
										:class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
										style="width: 18px"
									/>
									<div>
										{{ `(+${slotProps.value.countryCode})` }}
									</div>
								</div>
								<span v-else>
									{{ slotProps.placeholder }}
								</span>
							</template>
							<template #option="slotProps">
								<div class="flex items-center">
									<img
										:alt="slotProps.option.label"
										:src="slotProps.option.flag"
										:class="`mr-2`"
										style="width: 18px"
									/>
									<div>
										{{ slotProps.option.country }} (+
										{{ slotProps.option.countryCode }})
									</div>
								</div>
							</template>
						</Select>
						<InputNumber
							v-model="numero"
							:invalid="numero === null && invalid"
							inputId="numero-cliente"
							:useGrouping="false"
							class="w-3/5 sm:w-9/12"
						/>
					</InputGroup>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="flex gap-2 mt-5">
				<Button
					label="Cancelar"
					@click="visible = false"
					severity="secondary"
				/>
				<Button
					label="Registrar"
					severity="primary"
					:loading="interactividad.loading"
					@click="actionRegistrarReserva"
				/>
			</div>
		</template>
	</Dialog>
	<Tabs :value="`${idEvento.value}/pendientes`">
		<TabList>
			<Tab v-for="(tab, index) in items" :key="index" :value="tab.route">
				<router-link v-slot="{ href, navigate }" :to="tab.route" custom>
					<a
						v-ripple
						:href="href"
						@click="navigate"
						class="flex items-center gap-2 text-inherit"
					>
						<i :class="tab.icon" />
						<span>{{ tab.label }}</span>
					</a>
				</router-link>
			</Tab>
		</TabList>
	</Tabs>
	<Suspense>
		<RouterView />
		<template #fallback>
			<p>Cargando...</p>
		</template>
	</Suspense>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEventos } from '@/composables/useEventos'
import { useHorarios } from '@/composables/useHorarios'
import { useReservas } from '@/composables/useReservas'
import countries from '@/assets/countries.json'

const ruta = useRoute()
const { evento, cargarEvento } = useEventos()
const { horarios, action, cargarHorarios } = useHorarios()
const {
	reserva,
	horario,
	world,
	selectedPlace,
	interactividad,
	loadStates,
	loadCities,
	registrarReserva,
	cleanReserva,
} = useReservas()

const fechaSeleccionada = ref(new Date())
const visible = ref(false)

const idEvento = computed(() => ruta.params.idEvento)

const actualizarHorarios = async () => {
	await cargarHorarios(fechaSeleccionada.value, idEvento.value)
}

const items = computed(() => [
	{
		route: `/reservas/${idEvento.value}/pendientes`,
		label: 'Pendientes',
		icon: 'pi pi-hourglass',
	},
	{
		route: `/reservas/${idEvento.value}/confirmados`,
		label: 'Confirmados',
		icon: 'pi pi-check-square',
	},
])

watch(
	idEvento,
	async (nuevoId, antiguoId) => {
		if (nuevoId !== antiguoId) {
			await cargarEvento(nuevoId)
			await actualizarHorarios()
		}
	},
	{ immediate: true }
)

const registrarDatosReserva = (idProg) => {
	reserva.value.cantidad = evento.value.precios.map((pago) => ({
		tipo: pago.tipo,
		cantidad: 0,
	}))
	reserva.value.cantidadAdicional = evento.value.precios.map((pago) => ({
		tipo: pago.tipo,
		cantidad: 0,
	}))
	horario.value = horarios.value.find(
		(horario) => horario.identificador === idProg
	)
	visible.value = true
}

const selectedCountry = ref({
	country: 'Bolivia',
	countryCode: 591,
	code: 'BO',
	flag: 'https://flagcdn.com/bo.svg',
})

const numero = ref(null)
const invalid = ref(false)

const precioTotal = computed(() => {
	const total = reserva.value.cantidad.reduce(
		(acc, curr, index) =>
			acc + curr.cantidad * evento.value.precios[index].precio,
		0
	)
	const adicionales = reserva.value.cantidadAdicional.reduce(
		(acc, curr, index) =>
			acc + curr.cantidad * evento.value.precios[index].precio,
		0
	)
	return total + adicionales
})

const cuposRestantes = computed(() => {
	return (
		horario.value.spots -
		reserva.value.cantidad.reduce((acc, curr) => acc + curr.cantidad, 0)
	)
})

const actionRegistrarReserva = async () => {
	interactividad.value.loading = true
	reserva.value.cliente.telefono = `${selectedCountry.value.countryCode}${numero.value}`
	reserva.value.pago.total = precioTotal.value

	const res = await registrarReserva()
	interactividad.value.loading = false
	if (res.success) {
		visible.value = false
		cleanReserva()
		return
	}
}
</script>
