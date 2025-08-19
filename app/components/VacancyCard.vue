<template>
    <article class="flex flex-col items-start bg-white rounded-lg shadow-md/5 p-4">
        <h3 class="text-xl font-bold text-primary">
            {{ vacancy.title }}
        </h3>

        <span 
            v-if="vacancy.experience" 
            class="bg-secondary/30 text-secondary font-bold text-xs rounded-full px-2 py-0.5 mt-2"
        >
            {{ vacancy.experience }}
        </span>

        <ul class="my-4">
            <li v-if="vacancy.location"><strong>Locatie:</strong> {{ vacancy.location }}</li>
            <li v-if="vacancy.min_hours || vacancy.max_hours">
                <strong>Uren per week: </strong> 
                <span v-if="vacancy.min_hours">{{ vacancy.min_hours }} </span>
                <span v-if="vacancy.max_hours"> tot {{ vacancy.max_hours }}</span>
                <span> uur</span>
            </li>
            <li v-if="vacancy.salary_min || vacancy.salary_max">
                <strong>Salaris: </strong> 
                <span v-if="vacancy.salary_min"> vanaf €{{ vacancy.salary_min }} </span>
                <span v-if="vacancy.salary_max"> tot €{{ vacancy.salary_max }}</span>
            </li>
            <li v-if="vacancy.department"><strong>Afdeling:</strong> {{ vacancy.department }}</li>
        </ul>

        <a 
            v-if="vacancy.url"
            :href="vacancy.url" 
            target="_blank"
            rel="noopener noreferrer"
            class="btn"
        >Bekijk vacature</a>
    </article>
</template>

<script setup>
const props = defineProps(['vacancy'])
</script>