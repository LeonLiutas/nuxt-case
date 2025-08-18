<template>
    <h2 class="text-3xl font-bold mb-6 flex items-start gap-2">
        Openstaande vacatures
        <span class="bg-red-500 text-white rounded-full p-1 text-[8px] font-bold">{{ meta.total }}</span>
    </h2>

    <p v-if="meta.filteredTotal !== meta.total" class="text-gray-700 text-sm">
        {{ meta.filteredTotal }} van de {{ meta.total }} vacatures tonen overeen met je filter.
    </p>

    <div class="grid gap-8 my-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <VacancyCard v-for="(vacancy, index) in vacancies" :key="index" :vacancy="vacancy" />
    </div>
</template>

<script setup>
const props = defineProps(['vacancies', 'meta'])
</script>