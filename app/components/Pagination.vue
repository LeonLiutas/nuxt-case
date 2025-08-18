<template>
    <div>
        <ul class="pagination">
            <li v-if="currentPage > 2">
                <button
                    @click="gotoPage(1)"
                >
                    First
                </button>
            </li>
            <li v-if="currentPage > 1">
                <button
                    @click="gotoPage(currentPage - 1)"
                >
                    Previous
                </button>
            </li>

            <li v-for="page in visiblePages" :key="page">
                <button
                    :class="{ 'active': currentPage === page }"
                    @click="gotoPage(page)"
                >
                    {{ page }}
                </button>
            </li>

            <li v-if="currentPage < maxPage">
                <button
                    @click="gotoPage(currentPage + 1)"
                >
                    Next
                </button>
            </li>
            <li v-if="currentPage < (maxPage - 1)">
                <button
                    @click="gotoPage(maxPage)"
                >
                    Last
                </button>
            </li>
        </ul>
    </div>
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