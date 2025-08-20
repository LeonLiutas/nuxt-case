<template>
    <ul v-if="vacancy" class="my-4 text-sm [&_.iconify]:text-secondary [&_.iconify]:inline-block [&_.iconify]:mr-2">
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
</template>

<script setup>
const { vacancy } = defineProps(['vacancy'])
</script>