<template>
    <article class="flex flex-col items-start bg-white rounded-lg shadow-md/5 p-4">
        <div class="bg-secondary/30 text-secondary inline-block font-bold text-xs rounded-full px-3 py-1 mb-2">
            {{ vacancy.experience }}
        </div>
        <h3 class="text-xl font-bold text-primary mb-4">{{ vacancy.title }}</h3>

        <ul class="mb-4">
            <li><strong>Locatie:</strong> {{ vacancy.location }}</li>
            <li v-if="vacancy.min_hours || vacancy.max_hours">
                <strong>Uren per week: </strong> 
                <span v-if="vacancy.min_hours">{{ vacancy.min_hours }} </span>
                <span v-if="vacancy.max_hours"> tot {{ vacancy.max_hours }}</span>
                <span> uur</span>
            </li>
            <li v-if="vacancy.salary_min || vacancy.salary_max">
                <strong>Salaris: </strong> 
                <span v-if="vacancy.salary_min">vanaf €{{ vacancy.salary_min }} </span>
                <span v-if="vacancy.salary_max">tot €{{ vacancy.salary_max }}</span>
            </li>
            <li><strong>Afdeling:</strong> {{ vacancy.department }}</li>
        </ul>

        <a 
            :href="vacancy.url" 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block mt-auto rounded-full px-6 py-2 bg-primary text-white hover:bg-primary/70 transition-colors"
        >Bekijk vacature</a>
    </article>
</template>

<script setup>
const props = defineProps(['vacancy'])
</script>