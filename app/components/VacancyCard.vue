<template>
    <NuxtLink
        :to="vacancy.slug ? `/vacature/${vacancy.slug}` : ''"
    >
        <article 
            class="flex flex-col items-start border border-gray-200 p-4 bg-white rounded-lg transition-transform duration-300"
            :class="vacancy.slug ? 'cursor-pointer group hover:-translate-y-1' : 'cursor-default'"
        >
            <h3 class="hyphens-auto">
                {{ vacancy.title }}
            </h3>

            <span 
                v-if="vacancy.experience" 
                class="bg-secondary/30 text-secondary font-bold text-xs rounded-full px-2 py-0.5 mt-2"
            >
                {{ vacancy.experience }}
            </span>

            <VacancyInfo :vacancy />

            <button 
                v-if="vacancy.url"
                class="btn group-hover:bg-primary/70"
            >Bekijk vacature &rarr;</button>
        </article>
    </NuxtLink>
</template>

<script setup>
const props = defineProps(['vacancy'])
</script>