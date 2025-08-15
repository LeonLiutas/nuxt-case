<template>
    <h2 class="text-3xl font-bold mb-6 flex items-start gap-2">
        Openstaande vacatures
        <span class="bg-red-500 text-white rounded-full p-1 text-[8px] font-bold">{{ vacancies.length }}</span>
    </h2>

    <div class="grid gap-8 my-8 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
        <VacancyCard v-for="(vacancy, index) in vacancies" :key="index" :vacancy="vacancy" />
    </div>
</template>

<script setup>
const props = defineProps(['vacancies'])
</script>