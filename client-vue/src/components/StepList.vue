<template>
  <div v-if="steps.length > 0">
    <h2 class="text-lg font-bold text-gray-800 mb-4">制作教程</h2>
    <div class="space-y-4">
      <div
        v-for="(step, idx) in steps"
        :key="step.id"
        class="flex gap-4 bg-white rounded-lg p-4 border border-gray-100"
      >
        <div class="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {{ idx + 1 }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 mb-2">{{ step.description }}</p>
          <img
            v-if="step.image"
            :src="imgUrl(step.image)"
            alt=""
            class="rounded-lg max-h-48 object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { imgUrl } from '../services/api'

defineProps({
  steps: { type: Array, default: () => [] },
})
</script>
