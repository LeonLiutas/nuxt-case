<template>
    <ul class="flex flex-wrap items-center space-x-2 mt-4">
        <li v-if="currentPage > 2">
            <button
                class="btn"
                @click="gotoPage(1)"
            >
                Eerste
            </button>
        </li>
        <li v-if="currentPage > 1">
            <button
                class="btn"
                @click="gotoPage(currentPage - 1)"
            >
                Vorige
            </button>
        </li>

        <li v-for="page in visiblePages" :key="page">
            <button
                class="btn"
                :class="{ 'bg-gray-600 cursor-default': currentPage === page }"
                @click="gotoPage(page)"
            >
                {{ page }}
            </button>
        </li>

        <li v-if="currentPage < maxPage">
            <button
                class="btn"
                @click="gotoPage(currentPage + 1)"
            >
                Volgende
            </button>
        </li>
        <li v-if="currentPage < (maxPage - 1)">
            <button
                class="btn"
                @click="gotoPage(maxPage)"
            >
                Laatste
            </button>
        </li>
    </ul>
</template>

<script setup>
const { pagination } = defineProps(['pagination']);
const emit = defineEmits(['update:currentPage']);

const { currentPage, maxPage, perPage} = pagination;

const gotoPage = (val) => {
    emit('update:currentPage', val);
}

// Only show a limited number of pages around the current page.
const visiblePages = computed(() => {
    const range = 2; // Number of pages to show on either side of the current page
    const pages = [];

    const start = Math.max(1, currentPage - range);
    const end = Math.min(maxPage, currentPage + range);

    for(let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages;
})
</script>