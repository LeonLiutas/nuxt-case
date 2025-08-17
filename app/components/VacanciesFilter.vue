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
        <ul class="mb-4">
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

        <h3 class="text-xl font-bold">Zoeken</h3>
        <input 
            type="search" 
            placeholder="Zoek op functietitel..." 
            class="border border-gray-300 rounded p-2 w-full bg-white mb-4"
            v-model="searchQueryLocal"
        />

        <h3 class="text-xl font-bold">Aantal uren</h3>
        <input 
            type="number"
            :placeholder="`Aantal uren per week (${hours.min} - ${hours.max})`"
            class="border border-gray-300 rounded p-2 w-full bg-white mb-4"
            :min="hours.min"
            :max="hours.max"
            v-model.number="selectedHoursLocal"
            step="4"
        />

        <h3 class="text-xl font-bold">Salaris</h3>
        <div class="flex gap-4 mb-4">
            <input 
                type="number"
                placeholder="Min. salaris"
                class="border border-gray-300 rounded p-2 w-full bg-white"
                :min="salary.min"
                :max="salary.max"
                step="500"
                v-model.number="selectedSalaryLocal.min"

            />

            <input 
                type="number"
                placeholder="Max. salaris"
                class="border border-gray-300 rounded p-2 w-full bg-white"
                :min="salary.min"
                :max="salary.max"
                step="500"
                v-model.number="selectedSalaryLocal.max"
            />
        </div>
    </div>
</template>

<script setup>
import debounce from 'lodash/debounce'

const {
    departments, 
    hours,
    locations, 
    salary,
    selectedDepartments,
    selectedHours,
    selectedLocations, 
    selectedSalary,
    searchQuery,
} = defineProps({
    departments: Array,
    hours: Object,
    locations: Array,
    salary: Object,
    selectedDepartments: Array,
    selectedHours: [String, Number],
    selectedLocations: Array,
    selectedSalary: Object,
    searchQuery: String,
})

const emit = defineEmits([
    'update:selectedDepartments', 
    'update:selectedHours', 
    'update:selectedLocations', 
    'update:selectedSalary',
    'update:searchQuery', 
])

// Local state for selected filters
const selectedDepartmentsLocal = ref([...selectedDepartments])
const selectedHoursLocal = ref(selectedHours)
const selectedLocationsLocal = ref([...selectedLocations])
const selectedSalaryLocal = reactive({
    min: Number(selectedSalary.min) || null,
    max: Number(selectedSalary.max) || null
})
const searchQueryLocal = ref(searchQuery)

// Watch for changes in (local) state and emit updates
// watch and update selectedDepartments
watch(selectedDepartmentsLocal, (val) => {
    emit('update:selectedDepartments', val)
})

// create handler function for hours filter to use debounce
const updateSelectedHours = debounce((val) => {
    emit('update:selectedHours', val)
}, 350)

// watch and update selectedHours
watch(selectedHoursLocal, (val) => {
    updateSelectedHours(val)
})

// watch and update selectedLocations
watch(selectedLocationsLocal, (val) => {
    emit('update:selectedLocations', val)
})

// create handler function for salary filter to use debounce
const updateSelectedSalary = debounce((val) => {
    emit('update:selectedSalary', val)
}, 350)

// watch and update selectedSalary (reactive)
watch(() => selectedSalaryLocal, (val) => {
    updateSelectedSalary(val);    
}, { 
    deep: true 
})

// create handler function for search query to use debounce
const updateSearchQuery = debounce((val) => {
    emit('update:searchQuery', val)
}, 250)

watch(searchQueryLocal, (val) => {
    updateSearchQuery(val)
})
</script>