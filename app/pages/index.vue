<template>
    <div>
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-3">
                <VacanciesFilter 
                    :locations
                    :departments
                    :hours
                    :selectedLocations
                    :selectedDepartments
                    :searchQuery
                    :selectedHours
                    @update:selectedLocations="val => selectedLocations = val"
                    @update:selectedDepartments="val => selectedDepartments = val"
                    @update:searchQuery="val => searchQuery = val"
                    @update:selectedHours="val => selectedHours = val"
                />
            </div>

            <div class="col-span-12 lg:col-span-9">
                <div v-if="pending">Loading...</div>
                <div v-else-if="error">Error loading vacancies: {{ error.message }}</div>
                <div v-else-if="!vacancies.length">Geen vacatures gevonden</div>
                <div v-else>
                    <VacanciesList :vacancies="vacancies" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// Filtering
// Define the active filters
const selectedLocations = ref(route.query.locations?.toLowerCase().split(',') || []);
const selectedDepartments = ref(route.query.departments?.toLowerCase().split(',') || []);
const searchQuery = ref(route.query.search || '');
const selectedHours = ref(route.query.minHours ? Number(route.query.minHours) : 0); 

// Get the vacancies data from the API
const { data, pending, error, refresh } = await useFetch('/api/vacancies', {
    query: {  
        locations: selectedLocations,
        departments: selectedDepartments,
        search: searchQuery,
        minHours: selectedHours,
    }
})

// Get the filter options from the API
const locations = computed(() => data.value.filters.locations || [])
const departments = computed(() => data.value.filters.departments || []);
const hours = computed(() => data.value.filters.hours || { min: 0, max: 40 });
const vacancies = computed(() => data.value.vacancies || []);

// Watchers for filters to update the URL query parameters
watch(selectedLocations, (val) => {
    const query = {...route.query};

    if(val.length) {
        query.locations = val.join(',');
    } else {
        delete query.locations;
    }

    router.push({ query });
})

watch(selectedDepartments, (val) => {
    const query = {...route.query};

    if(val.length) {
        query.departments = val.join(',');
    } else {
        delete query.departments;
    }

    router.push({ query });
})

watch(searchQuery, (val) => {
    const query = {...route.query};

    if(val.length) {
        query.search = val;
    } else {
        delete query.search;
    }

    router.push({ query });
})

watch(selectedHours, (val) => {
    const query = {...route.query};

    if(val) {
        query.minHours = val;
    } else {
        delete query.minHours;
    }

    router.push({ query });
})
</script>