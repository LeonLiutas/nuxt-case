<template>
    <div>
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-3">
                <VacanciesFilter 
                    :departments
                    :hours
                    :locations
                    :salary

                    v-model:selectedDepartments="selectedDepartments"
                    v-model:selectedHours="selectedHours"
                    v-model:selectedLocations="selectedLocations"
                    v-model:searchQuery="searchQuery"

                    :selectedSalary
                    @update:selectedSalary="val => Object.assign(selectedSalary, val)"
                />
            </div>

            <div class="col-span-12 lg:col-span-9">
                <div v-if="pending">Loading...</div>
                <div v-else-if="error">Error loading vacancies: {{ error.message }}</div>
                <div v-else-if="!vacancies.length">Geen vacatures gevonden</div>
                <div v-else>
                    <VacanciesList 
                        :vacancies
                        :meta="data.meta"
                    />
                    <Pagination
                        v-if="pagination && pagination.maxPage > 1"
                        :pagination
                        v-model:currentPage="currentPage"
                    />
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
const selectedHours = ref(route.query.minHours ? Number(route.query.minHours) : null)
const selectedSalary = reactive({
    min: route.query.minSalary ? Number(route.query.minSalary) : null,
    max: route.query.maxSalary ? Number(route.query.maxSalary) : null
})
const currentPage = ref(Number(route.query.page) || 1)

const fetchQuery = computed(() => ({
        locations: selectedLocations.value,
        departments: selectedDepartments.value,
        search: searchQuery.value,
        minHours: selectedHours.value,
        minSalary: selectedSalary.min,
        maxSalary: selectedSalary.max,
        page: currentPage.value,
}))

// Get the vacancies data from the API
const { data, pending, error, refresh } = await useFetch('/api/vacancies', {
    query: fetchQuery
})

// Get the filter options from the API
const locations = computed(() => data.value.filters.locations || [])
const departments = computed(() => data.value.filters.departments || []);
const hours = computed(() => data.value.filters.hours || { min: 0, max: 40 });
const vacancies = computed(() => data.value.vacancies || []);
const salary = computed(() => data.value.filters.salary || { min: 0, max: 10000 });
const pagination = computed(() => data.value.meta.pagination || { currentPage: 1, maxPage: 1, perPage: 1 })

// Watchers for filters to update the URL query parameters
watch(selectedLocations, (val) => {
    const query = {...route.query};

    if(val.length) {
        query.locations = val.join(',');
    } else {
        delete query.locations;
    }

    currentPage.value = 1; 

    router.push({ query });
})

watch(selectedDepartments, (val) => {
    const query = {...route.query};

    if(val.length) {
        query.departments = val.join(',');
    } else {
        delete query.departments;
    }

    currentPage.value = 1;

    router.push({ query });
})

watch(searchQuery, (val) => {
    const query = {...route.query};

    if(val.length) {
        query.search = val;
    } else {
        delete query.search;
    }

    currentPage.value = 1; 

    router.push({ query });
})

watch(selectedHours, (val) => {
    const query = {...route.query};

    if(val) {
        query.minHours = val;
    } else {
        delete query.minHours;
    }

    currentPage.value = 1; 

    router.push({ query });
})

watch(() => selectedSalary, (val) => {
    const query = {...route.query};

    if(val.min) {
        query.minSalary = val.min;
    } else {
        delete query.minSalary;
    }

    if(val.max) {
        query.maxSalary = val.max;
    } else {
        delete query.maxSalary;
    }

    currentPage.value = 1; 

    router.push({ query });
}, {
    deep: true
})

watch(currentPage, (val) => {
    const query = {...route.query};

    if(val && val > 1) {
        query.page = val;
    } else {
        delete query.page;
    }

    router.push({ query });
})
</script>