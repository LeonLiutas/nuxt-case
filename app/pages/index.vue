<template>
    <div class="grid grid-cols-12 lg:gap-8 xl:gap-16">
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
            <h2 class="text-3xl mb-6 flex items-start gap-2">
                Openstaande vacatures
                <span class="bg-red-500 text-white rounded-full p-1 text-[8px] font-bold">{{ data.meta.total }}</span>
            </h2>

            <div v-if="pending">Laden...</div>
            <div v-else-if="error">Error bij het laden van de vacatures: {{ error.message }}</div>
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
</template>

<script setup>
const route = useRoute();
const router = useRouter();

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

// Setup the filter options for the useFetch requests
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
const { data, pending, error } = await useFetch('/api/vacancies', {
    query: fetchQuery,
})

// Get the filterable options from the API
const locations = computed(() => data.value.filters.locations || []);
const departments = computed(() => data.value.filters.departments || []);
const hours = computed(() => data.value.filters.hours || { min: 0, max: 40 });
const vacancies = computed(() => data.value.vacancies || []);
const salary = computed(() => data.value.filters.salary || { min: 0, max: 10000 });
const pagination = computed(() => data.value.meta.pagination || { currentPage: 1, maxPage: 1, perPage: 1 });

// Watch the fetchQuery for changes, change the route query
watch(fetchQuery, (newValues, oldValues) => {
    const query = {...route.query};

    const { 
        locations,
        departments,
        search: searchQuery, 
        minHours: selectedHours, 
        minSalary, 
        maxSalary, 
        page,
    } = newValues;

    const { page: oldPage } = oldValues;

    // Locations
    if(locations && locations.length) {
        query.locations = locations.join(',');
    } else {
        delete query.locations;
    }

    // Departments
    if(departments && departments.length) {
        query.departments = departments.join(',');
    } else {
        delete query.departments;
    }

    // Search query
    if(searchQuery && searchQuery.length) {
        query.search = searchQuery;
    } else {
        delete query.search;
    }

    // Hours
    if(selectedHours && Number(selectedHours) > 0) {
        query.minHours = selectedHours;
    } else {
        delete query.minHours;
    }

    // Min salary
    if(minSalary && Number(minSalary) > 0) {
        query.minSalary = minSalary;
    } else {
        delete query.minSalary;
    }

    // Max Salary
    if(maxSalary && Number(maxSalary) > 0) {
        query.maxSalary = maxSalary;
    } else {
        delete query.maxSalary;
    }

    // Page
    if(page && oldPage && (page === oldPage)) {
        // Any filter is changed except the page number itself, so reset the page to 1
        delete query.page;
        currentPage.value = 1;
    } else {
        // Regular page change
        if(page > 1) {
            query.page = page;
        } else {
            delete query.page;
        }
    }

    // Update the route query
    router.push({ query });
}, 
{ deep: true });
</script>