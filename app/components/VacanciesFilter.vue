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
            placeholder="Aantal uren per week..."
            class="border border-gray-300 rounded p-2 w-full bg-white mb-4"
            :min="hours.min"
            :max="hours.max"
            v-model.number="inputHoursHandler"
            step="4"
        />
    </div>
</template>

<script setup>
import debounce from 'lodash/debounce'

const {
    hours,
    locations, 
    departments, 
    searchQuery, 
    selectedLocations, 
    selectedDepartments,
    selectedHours
} = defineProps({
    hours: {
        type: Object,
    },
    selectedHours: {
        type: [String, Number],
        default: 0,
    },
    locations: Array,
    departments: Array,
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
})

const emit = defineEmits(['update:selectedLocations', 'update:selectedDepartments', 'update:searchQuery', 'update:selectedHours'])

const selectedLocationsLocal = ref([...selectedLocations])
const selectedDepartmentsLocal = ref([...selectedDepartments])
const searchQueryLocal = ref(searchQuery)

// create handler function for input ofhours filter
const inputHoursHandler = computed({
    // if 0, set to empty string to show placeholder, otherwise use the value
    get: () => selectedHours === 0 ? '' : selectedHours,
    set: (value) => {
        emit('update:selectedHours', value === '' ? 0 : value)
    }
})

watch(selectedLocationsLocal, (value) => {
    emit('update:selectedLocations', value)
})

watch(selectedDepartmentsLocal, (value) => {
    emit('update:selectedDepartments', value)
})

const updateSearchQuery = debounce((val) => {
    emit('update:searchQuery', val)
}, 250)

watch(searchQueryLocal, (val) => {
    updateSearchQuery(val)
})
</script>