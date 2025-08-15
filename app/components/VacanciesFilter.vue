<template>
    <h2 class="text-3xl font-bold mb-6 flex items-start gap-2">Filters</h2>

    <div>
        <h3 class="text-xl font-bold">Locaties</h3>
        <ul class="mb-4">
            <li v-for="location in locations">
                <label :for="location.toLowerCase()">
                    <input 
                        type="checkbox"
                        :id="location.toLowerCase()" 
                        :value="location.toLowerCase()" 
                        class="mr-2"
                        v-model="selectedLocationsLocal"
                    >
                    {{ location }}
                </label>
            </li>
        </ul>

        <h3 class="text-xl font-bold">Afdelingen</h3>
        <ul>
            <li v-for="department in departments">
                <label :for="department.toLowerCase()">
                    <input 
                        type="checkbox"
                        :id="department.toLowerCase()" 
                        :value="department.toLowerCase()" 
                        class="mr-2"
                        v-model="selectedDepartmentsLocal"
                    >
                    {{ department }}
                </label>
            </li>
        </ul>

    </div>
</template>

<script setup>
const { locations,departments, selectedLocations, selectedDepartments } = defineProps({
    locations: Array,
    departments: Array,
    selectedLocations: {
        type: Array,
        default: [],
    },
    selectedDepartments: {
        type: Array,
        default: [],
    },
})

const emit = defineEmits(['update:selectedLocations', 'update:selectedDepartments'])

const selectedLocationsLocal = ref([...selectedLocations])
const selectedDepartmentsLocal = ref([...selectedDepartments])

watch(selectedLocationsLocal, (value) => {
    emit('update:selectedLocations', value)
})

watch(selectedDepartmentsLocal, (value) => {
    emit('update:selectedDepartments', value)
})
</script>