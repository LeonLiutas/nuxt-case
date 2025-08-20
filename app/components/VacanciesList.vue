<template>
    <p v-if="meta.filteredTotal !== meta.total" class="text-gray-700 text-sm mb-4">
        {{ meta.filteredTotal }} van de {{ meta.total }} vacatures tonen overeen met je filter.
    </p>

    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
        <VacancyCard v-for="(vacancy, index) in vacancies" :key="index" :vacancy="vacancy" />
    </div>
</template>

<script setup>
const props = defineProps(['vacancies', 'meta'])
</script>