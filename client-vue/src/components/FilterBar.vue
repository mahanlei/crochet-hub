<template>
  <div class="flex flex-wrap gap-3 mb-6">
    <div class="flex gap-1.5">
      <button
        v-for="t in craftTypes"
        :key="t.value"
        @click="$emit('update:filters', { ...filters, craft_type: t.value })"
        :class="[
          'px-3 py-1.5 rounded-full text-sm transition',
          filters.craft_type === t.value
            ? 'bg-pink-600 text-white'
            : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200',
        ]"
      >
        {{ t.label }}
      </button>
    </div>
    <div class="flex gap-1.5">
      <button
        v-for="d in difficulties"
        :key="d.value"
        @click="$emit('update:filters', { ...filters, difficulty: d.value })"
        :class="[
          'px-3 py-1.5 rounded-full text-sm transition',
          filters.difficulty === d.value
            ? 'bg-pink-600 text-white'
            : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200',
        ]"
      >
        {{ d.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filters: { type: Object, required: true },
})
defineEmits(['update:filters'])

const craftTypes = [
  { value: '', label: '全部' },
  { value: 'crochet', label: '🧶 钩针' },
  { value: 'knitting', label: '🪡 棒针' },
]

const difficulties = [
  { value: '', label: '全部难度' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' },
]
</script>
