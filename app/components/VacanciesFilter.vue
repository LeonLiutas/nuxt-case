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
            v-model.number="inputHoursHandler"
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
    locations, 
    departments, 
    hours,
    salary,
    searchQuery, 
    selectedLocations, 
    selectedDepartments,
    selectedHours,
    selectedSalary
} = defineProps({
    hours: Object,
    locations: Array,
    departments: Array,
    salary: Object,
    searchQuery: {
        type: String,
        default: '',
    },
    selectedLocations: {
        type: Array,
        default: [],
    },
    selectedDepartments: {
        type: Array,
        default: [],
    },
    selectedHours: {
        type: [String, Number],
        default: 0,
    },
    selectedSalary: Object,
})

const emit = defineEmits(['update:selectedLocations', 'update:selectedDepartments', 'update:searchQuery', 'update:selectedHours', 'update:selectedSalary'])

const selectedLocationsLocal = ref([...selectedLocations])
const selectedDepartmentsLocal = ref([...selectedDepartments])
const searchQueryLocal = ref(searchQuery)
const selectedSalaryLocal = reactive({
    min: Number(selectedSalary.min) || null,
    max: Number(selectedSalary.max) || null
})

const updateSelectedSalary = debounce((val) => {
    console.log('Updating selected salary with debounce:', val)
    emit('update:selectedSalary', val)
}, 350)

watch(() => selectedSalaryLocal, (val) => {
    updateSelectedSalary(val);    
}, { deep: true })

const updateSelectedHours = debounce((val) => {
    emit('update:selectedHours', val === '' ? 0 : val)
}, 350)

// create handler function for input ofhours filter
const inputHoursHandler = computed({
    get: () => selectedHours,
    set: (val) => updateSelectedHours(val)
})

watch(selectedLocationsLocal, (val) => {
    emit('update:selectedLocations', val)
})

watch(selectedDepartmentsLocal, (val) => {
    emit('update:selectedDepartments', val)
})

const updateSearchQuery = debounce((val) => {
    emit('update:searchQuery', val)
}, 250)

watch(searchQueryLocal, (val) => {
    updateSearchQuery(val)
})
</script>