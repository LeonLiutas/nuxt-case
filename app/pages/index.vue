<template>
    <div>
        <div class="grid grid-cols-12">
            <div class="col-span-12 lg:col-span-3">
                <VacanciesFilter 
                    :locations
                    :departments
                    :selectedLocations
                    :selectedDepartments
                    @update:selectedLocations="val => selectedLocations = val"
                    @update:selectedDepartments="val => selectedDepartments = val"
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

// Get the filter options from the API
const locations = computed(() => data.value.filters.locations || [])
const departments = computed(() => data.value.filters.departments || []);

// Get the vacancies data from the API
const { data, pending, error, refresh } = await useFetch('/api/vacancies', {
    query: {  
        locations: selectedLocations,
        departments: selectedDepartments,
    }
})

const vacancies = computed(() => data.value.vacancies || []);


// Watchers
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
</script>