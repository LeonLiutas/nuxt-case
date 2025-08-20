<template>
    <article 
        class="flex flex-col items-start border border-gray-200 p-4 bg-white rounded-lg cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
        @click="gotoVacancy(vacancy.url)"
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

        <ul class="my-4 text-sm [&_.iconify]:text-secondary [&_.iconify]:inline-block [&_.iconify]:mr-2">
            <li v-if="vacancy.department">
                <Icon name="ion:business-sharp" />
                <span>{{ vacancy.department }}</span>
            </li>
            <li v-if="vacancy.location">
                <Icon name="ion:location-sharp" />
                <span v-if="vacancy.city">{{ vacancy.city }}, </span>
                <span>{{ vacancy.location }}</span>
            </li>
            <li v-if="vacancy.min_hours || vacancy.max_hours">
                <Icon name="ion:time-sharp" />
                <span v-if="vacancy.min_hours">{{ vacancy.min_hours }} </span>
                <span v-if="vacancy.max_hours"> tot {{ vacancy.max_hours }}</span>
                <span> uur</span>
            </li>
            <li v-if="vacancy.salary_min || vacancy.salary_max">
                <Icon name="ion:logo-euro" />
                <span v-if="vacancy.salary_min">vanaf €{{ vacancy.salary_min }} </span>
                <span v-if="vacancy.salary_max"> tot €{{ vacancy.salary_max }}</span>
            </li>
        </ul>

        <a 
            v-if="vacancy.url"
            :href="vacancy.url" 
            target="_blank"
            rel="noopener noreferrer"
            class="btn group-hover:bg-primary/70"
            @click.prevent
        >Bekijk vacature</a>
    </article>
</template>

<script setup>
const props = defineProps(['vacancy'])

const gotoVacancy = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
}
</script>