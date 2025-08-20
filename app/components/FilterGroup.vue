<template>
    <div class="mb-4 border border-gray-200 p-4 bg-white rounded-lg">
        <div 
            class="flex items-center"
            :class="{ 'border-b border-gray-200 pb-2 mb-4': expanded }"
        >
            <h3 v-if="title">{{ title }}</h3>

            <span 
                class="ml-auto text-sm text-gray-500 cursor-pointer"
                @click="expanded = !expanded"
            >{{ expanded ? 'verberg' : 'toon' }}</span>
        </div>

        <template v-if="expanded">
            <slot />
        </template>
    </div>
</template>

<script setup>
const { title: String } = defineProps(['title']);

const expanded = ref(true);
</script>
