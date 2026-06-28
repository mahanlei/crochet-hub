<template>
  <div>
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-1">小马甲手作集</h1>
      <p class="text-sm text-gray-500">分享钩针与棒针编织的美好</p>
    </div>

    <FilterBar v-model:filters="filters" />

    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>

    <div v-else-if="works.length === 0" class="text-center py-20 text-gray-400">
      <div class="text-4xl mb-3">🧶</div>
      <p>暂无作品，快去后台添加吧</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <WorkCard v-for="work in works" :key="work.id" :work="work" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getWorks } from '../services/api'
import FilterBar from '../components/FilterBar.vue'
import WorkCard from '../components/WorkCard.vue'

const works = ref([])
const loading = ref(true)
const filters = ref({ craft_type: '', difficulty: '' })

const loadWorks = () => {
  loading.value = true
  const params = {}
  if (filters.value.craft_type) params.craft_type = filters.value.craft_type
  if (filters.value.difficulty) params.difficulty = filters.value.difficulty

  getWorks(params)
    .then((res) => {
      if (res.success) works.value = res.data
    })
    .catch(console.error)
    .finally(() => { loading.value = false })
}

watch(filters, loadWorks, { immediate: true, deep: true })
</script>
