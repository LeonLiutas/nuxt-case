<template>
    <h1>{{ vacancy.title }}</h1>

    <VacancyInfo :vacancy />

    <p class="mb-4">{{ stripHtml(vacancy.description).result }}</p>

    <div class="mb-8">
        <a 
            :href="vacancy.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="underline text-primary hover:text-primary/70"
        >Bekijk vacature op onze externe website</a>
    </div>

    <div>
        <button class="btn" @click="$router.back()">
            &larr; Terug naar overzicht
        </button>
    </div>
</template>
<script setup>
import { stripHtml } from 'string-strip-html';

const route = useRoute();
const { slug } = route.params;

// Fetch the vacancy data based on the slug
const { data: vacancy, pending, error } = await useFetch('/api/vacancies', {
    query: {
        slug
    },
})

// Check if the vacancy exists (check by slug)
if (error.value?.statusCode === 404 || !vacancy.value) {
  throw createError({ statusCode: 404, statusMessage: 'Vacancy not found' });
}
</script>