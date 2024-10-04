<template>
	<div class="container py-4 mx-auto">
		<h1 class="text-xl font-bold text-primary-300 px-3">Eventos</h1>
		<Divider class="mt-2 mb-6" />
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<Card style="overflow: hidden">
				<template #header>
					<div class="bg-green-200 h-full text-end">
						<Button
							icon="pi pi-cog"
							class="text-gray-500 hover:bg-green-300"
							severity="secondary"
							text
							rounded
						/>
					</div>
				</template>
				<template #title> evento.nombre </template>
				<template #content>
					<p class="text-sm">evento.descripcion</p>
					<Divider type="dashed" />
					<div class="flex flex-col gap-2">
						<span><i class="pi pi-users"></i> 0</span>
						<span><i class="pi pi-clock"></i> 0 min</span>
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>
