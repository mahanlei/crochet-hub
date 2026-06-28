<template>
  <div v-if="images.length === 0" class="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-6xl text-gray-300">
    🧶
  </div>

  <div v-else class="relative">
    <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
      <img :src="images[current]" alt="" class="w-full h-full object-cover" />
    </div>

    <template v-if="images.length > 1">
      <button
        @click="prev"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition"
      >
        ‹
      </button>
      <button
        @click="next"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition"
      >
        ›
      </button>
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        <button
          v-for="(_, i) in images"
          :key="i"
          @click="current = i"
          :class="['w-2 h-2 rounded-full transition', i === current ? 'bg-white' : 'bg-white/50']"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
})

const current = ref(0)

const prev = () => {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}
const next = () => {
  current.value = (current.value + 1) % props.images.length
}
</script>
