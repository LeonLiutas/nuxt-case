<template>
    <div>
        <div v-if="pending">Loading...</div>
        <div v-else-if="error">Error loading vacancies: {{ error.message }}</div>
        <div v-else>
            <VacanciesList :vacancies="vacancies" />
        </div>
    </div>
</template>

<script setup>
const { data, pending, error } = await useFetch('/api/vacancies')

const vacancies = computed(() => data.value.vacancies || []);
</script>