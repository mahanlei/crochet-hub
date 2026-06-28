<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-xl font-bold text-gray-800 mb-6">{{ isEdit ? '编辑作品' : '新建作品' }}</h1>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- 基本信息 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">作品标题 *</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="输入作品标题"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">工艺类别 *</label>
          <select
            v-model="form.craft_type"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="crochet">🧶 钩针</option>
            <option value="knitting">🪡 棒针</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">难度 *</label>
          <select
            v-model="form.difficulty"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="beginner">入门</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
      </div>

      <!-- 封面图 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
        <div class="flex items-center gap-4">
          <img v-if="coverPreview" :src="coverPreview" alt="" class="w-20 h-20 rounded-lg object-cover" />
          <label class="cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition">
            选择图片
            <input type="file" accept="image/*" @change="handleCoverChange" class="hidden" />
          </label>
        </div>
      </div>

      <!-- AI 生成区域 -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-bold text-purple-700">✨ AI 智能填充</h3>
          <button
            type="button"
            @click="handleAiGenerate"
            :disabled="aiLoading"
            class="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {{ aiLoading ? '生成中...' : 'AI 生成' }}
          </button>
        </div>
        <p class="text-xs text-purple-500 mb-2">上传作品图片，AI 将自动生成描述、材料和工具推荐</p>
        <label class="cursor-pointer inline-flex items-center gap-1 bg-white border border-purple-200 rounded px-3 py-1.5 text-xs text-purple-600 hover:bg-purple-50 transition">
          📷 选择 AI 识别图片
          <input type="file" accept="image/*" @change="aiImageFile = $event.target.files[0]" class="hidden" />
        </label>
        <span v-if="aiImageFile" class="text-xs text-gray-400 ml-2">{{ aiImageFile.name }}</span>
      </div>

      <!-- 描述 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">作品描述</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          placeholder="描述你的作品..."
        />
      </div>

      <!-- 材料 & 工具 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">材料清单</label>
          <textarea
            v-model="form.materials"
            rows="2"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            placeholder="用「、」分隔，如：钩针、毛线"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">工具清单</label>
          <textarea
            v-model="form.tools"
            rows="2"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            placeholder="用「、」分隔，如：剪刀、缝合针"
          />
        </div>
      </div>

      <!-- 教程步骤 -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <label class="text-sm font-medium text-gray-700">制作教程</label>
          <button type="button" @click="addStep" class="text-xs text-pink-600 hover:underline">
            + 添加步骤
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="(step, idx) in steps" :key="idx" class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div class="flex gap-3 items-start">
              <span class="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                {{ idx + 1 }}
              </span>
              <div class="flex-1 space-y-2">
                <textarea
                  v-model="step.description"
                  rows="2"
                  class="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  :placeholder="`步骤 ${idx + 1} 的说明...`"
                />
                <div class="flex items-center gap-2">
                  <img v-if="step.image" :src="step.image" alt="" class="w-12 h-12 rounded object-cover" />
                  <label class="cursor-pointer text-xs text-gray-500 hover:text-pink-600">
                    📷 上传图片
                    <input type="file" accept="image/*" @change="handleStepImage(idx, $event)" class="hidden" />
                  </label>
                </div>
              </div>
              <button type="button" @click="removeStep(idx)" class="text-gray-400 hover:text-red-500 text-sm">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="saving"
          class="bg-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50 transition"
        >
          {{ saving ? '保存中...' : isEdit ? '更新作品' : '创建作品' }}
        </button>
        <button
          type="button"
          @click="router.push('/admin')"
          class="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWork, createWork, updateWork, saveSteps, aiGenerate, imgUrl } from '../services/api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => Boolean(route.params.id))

const form = ref({
  title: '',
  description: '',
  craft_type: 'crochet',
  difficulty: 'beginner',
  materials: '',
  tools: '',
})
const coverFile = ref(null)
const coverPreview = ref('')
const steps = ref([])
const saving = ref(false)
const aiLoading = ref(false)
const aiImageFile = ref(null)

// 编辑模式：加载数据
onMounted(() => {
  if (!isEdit.value) return
  getWork(route.params.id).then((res) => {
    if (!res.success) return
    const w = res.data
    form.value = {
      title: w.title,
      description: w.description,
      craft_type: w.craft_type,
      difficulty: w.difficulty,
      materials: (w.materials || []).join('、'),
      tools: (w.tools || []).join('、'),
    }
    coverPreview.value = imgUrl(w.cover_image)
    steps.value = (w.steps || []).map((s) => ({
      id: s.id,
      description: s.description,
      image: imgUrl(s.image),
      imageFile: null,
    }))
  })
})

const handleCoverChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
}

// AI 生成
const handleAiGenerate = async () => {
  const imageFile = aiImageFile.value || coverFile.value
  if (!imageFile) {
    alert('请先选择一张作品图片（封面图或 AI 识别图）')
    return
  }

  aiLoading.value = true
  try {
    const fd = new FormData()
    fd.append('image', imageFile)
    if (form.value.craft_type) fd.append('craft_type', form.value.craft_type)

    const res = await aiGenerate(fd)
    if (res.success && res.data) {
      form.value.description = res.data.description || form.value.description
      form.value.materials = (res.data.materials || []).join('、')
      form.value.tools = (res.data.tools || []).join('、')
    } else {
      alert(res.message || 'AI 生成失败')
    }
  } catch {
    alert('AI 生成失败，请检查 OpenAI API Key 配置')
  } finally {
    aiLoading.value = false
  }
}

// 步骤管理
const addStep = () => steps.value.push({ description: '', image: '', imageFile: null })
const removeStep = (idx) => steps.value.splice(idx, 1)

const handleStepImage = (idx, e) => {
  const file = e.target.files[0]
  if (!file) return
  steps.value[idx].imageFile = file
  steps.value[idx].image = URL.createObjectURL(file)
}

// 提交
const handleSubmit = async () => {
  if (!form.value.title.trim()) { alert('请填写作品标题'); return }

  saving.value = true
  try {
    const fd = new FormData()
    fd.append('title', form.value.title)
    fd.append('description', form.value.description)
    fd.append('craft_type', form.value.craft_type)
    fd.append('difficulty', form.value.difficulty)
    fd.append('materials', JSON.stringify(form.value.materials.split('、').filter(Boolean)))
    fd.append('tools', JSON.stringify(form.value.tools.split('、').filter(Boolean)))
    if (coverFile.value) fd.append('cover_image', coverFile.value)

    let workId = route.params.id
    if (isEdit.value) {
      await updateWork(route.params.id, fd)
    } else {
      const res = await createWork(fd)
      if (res.success) workId = res.data.id
    }

    // 保存步骤
    if (steps.value.length > 0 && workId) {
      const stepFd = new FormData()
      const stepsData = steps.value.map((s, i) => ({
        ...(s.id ? { id: s.id } : {}),
        sort_order: i,
        description: s.description,
      }))
      stepFd.append('steps', JSON.stringify(stepsData))
      steps.value.forEach((s, i) => {
        if (s.imageFile) stepFd.append(`step_images_${i}`, s.imageFile)
      })
      await saveSteps(workId, stepFd)
    }

    router.push('/admin')
  } catch {
    alert('保存失败')
  } finally {
    saving.value = false
  }
}
</script>
