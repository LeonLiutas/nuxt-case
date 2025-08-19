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
                        v-model="localFilters.locations"
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
                        v-model="localFilters.departments"
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
            v-model="localFilters.searchQuery"
        />

        <h3 class="text-xl font-bold">Aantal uren</h3>
        <input 
            type="number"
            :placeholder="`Aantal uren per week (${hours.min} - ${hours.max})`"
            class="border border-gray-300 rounded p-2 w-full bg-white mb-4"
            :min="hours.min"
            :max="hours.max"
            v-model.number="localFilters.hours"
            step="4"
        />

        <h3 class="text-xl font-bold">Salaris</h3>
        <div class="flex gap-4 mb-4">
            <input 
                type="number"
                placeholder="Min. salaris"
                class="border border-gray-300 rounded p-2 w-full bg-white"
                :min="salary.min"
                :max="localFilters.salary.max || salary.max"
                step="500"
                v-model.number="localFilters.salary.min"
            />

            <input 
                type="number"
                placeholder="Max. salaris"
                class="border border-gray-300 rounded p-2 w-full bg-white"
                :min="localFilters.salary.min || salary.min"
                :max="salary.max"
                step="500"
                v-model.number="localFilters.salary.max"
            />
        </div>

        <button 
            class="btn"
            @click="resetSelectedFilters"
        >Herstel alle filters</button>
    </div>
</template>

<script setup>
import debounce from 'lodash/debounce';

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
});

const emit = defineEmits([
    'update:selectedDepartments', 
    'update:selectedHours', 
    'update:selectedLocations', 
    'update:selectedSalary',
    'update:searchQuery', 
    'resetSelectedFilters'
]);

// Local state for selected filters
const localFilters = reactive({
    departments: [...selectedDepartments],
    hours: selectedHours,
    locations: [...selectedLocations],
    salary: {
        min: Number(selectedSalary.min) || null,
        max: Number(selectedSalary.max) || null,
    },
    searchQuery: searchQuery,
});

// Logic for resetting filters
const isResettingFilters = ref(false);

const resetSelectedFilters = () => {
    isResettingFilters.value = true;

    localFilters.departments = [];
    localFilters.hours = null;
    localFilters.locations = [];
    localFilters.salary.min = null;
    localFilters.salary.max = null;
    localFilters.searchQuery = '';

    nextTick(() => {
        isResettingFilters.value = false;

        // Manually emit the reset events to avoid the debounced emits
        emit('update:selectedDepartments', localFilters.departments);
        emit('update:selectedHours', localFilters.hours);
        emit('update:selectedLocations', localFilters.locations);
        emit('update:selectedSalary', localFilters.salary);
        emit('update:searchQuery', localFilters.searchQuery);
    });
}

// create handler function for hours filter to use debounce
const updateSelectedHours = debounce((val) => {
    emit('update:selectedHours', val);
}, 350);

// create handler function for salary filter to use debounce
const updateSelectedSalary = debounce((val) => {
    emit('update:selectedSalary', val);
}, 350);

// create handler function for search query to use debounce
const updateSearchQuery = debounce((val) => {
    emit('update:searchQuery', val);
}, 350);

// Emit departments and locations filter immediately when they change
watch(
    () => [localFilters.departments, localFilters.locations],
    () => {
        if(isResettingFilters.value) return;

        // Update departments
        emit('update:selectedDepartments', localFilters.departments);

        // Update locations
        emit('update:selectedLocations', localFilters.locations);
    }
)

// Emit hours
watch(
    () => localFilters.hours, 
    () => {
        if(isResettingFilters.value) return;

        updateSelectedHours(localFilters.hours);
    }
)

// Emit salary
watch(
    () => localFilters.salary, 
    () => {
        if(isResettingFilters.value) return;

        updateSelectedSalary(localFilters.salary);
    }, 
    { deep: true }
)

// Emit search query
watch(
    () => localFilters.searchQuery, 
    () => {
        if(isResettingFilters.value) return;

        updateSearchQuery(localFilters.searchQuery);
    }
)
</script>