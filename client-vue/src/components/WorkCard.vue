<template>
  <router-link :to="`/works/${work.id}`" class="group block">
    <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
      <!-- 封面图 -->
      <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          v-if="work.cover_image"
          :src="imgUrl(work.cover_image)"
          :alt="work.title"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-4xl text-gray-300">
          🧶
        </div>
      </div>

      <!-- 信息 -->
      <div class="p-3">
        <h3 class="font-medium text-gray-800 text-sm mb-1.5 truncate">{{ work.title }}</h3>
        <div class="flex gap-1.5 items-center">
          <span class="text-xs text-gray-500">{{ craftTypeLabel }}</span>
          <span :class="['text-xs px-1.5 py-0.5 rounded', diffInfo.color]">{{ diffInfo.label }}</span>
        </div>
        <p v-if="work.description" class="text-xs text-gray-400 mt-1.5 line-clamp-2">
          {{ work.description }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { imgUrl } from '../services/api'

const props = defineProps({
  work: { type: Object, required: true },
})

const difficultyMap = {
  beginner: { label: '入门', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '中级', color: 'bg-yellow-100 text-yellow-700' },
  advanced: { label: '高级', color: 'bg-red-100 text-red-700' },
}

const craftTypeMap = {
  crochet: '🧶 钩针',
  knitting: '🪡 棒针',
}

const diffInfo = computed(() => difficultyMap[props.work.difficulty] || { label: props.work.difficulty, color: 'bg-gray-100 text-gray-600' })
const craftTypeLabel = computed(() => craftTypeMap[props.work.craft_type] || props.work.craft_type)
</script>
