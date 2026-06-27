import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWork, createWork, updateWork, saveSteps, aiGenerate, imgUrl } from '../services/api'

export default function AdminForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    craft_type: 'crochet',
    difficulty: 'beginner',
    materials: '',
    tools: '',
  })
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [steps, setSteps] = useState([])
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiImageFile, setAiImageFile] = useState(null)

  // 编辑模式：加载数据
  useEffect(() => {
    if (!isEdit) return
    getWork(id).then((res) => {
      if (!res.success) return
      const w = res.data
      setForm({
        title: w.title,
        description: w.description,
        craft_type: w.craft_type,
        difficulty: w.difficulty,
        materials: (w.materials || []).join('、'),
        tools: (w.tools || []).join('、'),
      })
      setCoverPreview(imgUrl(w.cover_image))
      setSteps(
        (w.steps || []).map((s) => ({
          id: s.id,
          description: s.description,
          image: imgUrl(s.image),
          imageFile: null,
        }))
      )
    })
  }, [id, isEdit])

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  // AI 生成
  const handleAiGenerate = async () => {
    const imageFile = aiImageFile || coverFile
    if (!imageFile) {
      alert('请先选择一张作品图片（封面图或 AI 识别图）')
      return
    }

    setAiLoading(true)
    try {
      const fd = new FormData()
      fd.append('image', imageFile)
      if (form.craft_type) fd.append('craft_type', form.craft_type)

      const res = await aiGenerate(fd)
      if (res.success && res.data) {
        setForm((f) => ({
          ...f,
          description: res.data.description || f.description,
          materials: (res.data.materials || []).join('、'),
          tools: (res.data.tools || []).join('、'),
        }))
      } else {
        alert(res.message || 'AI 生成失败')
      }
    } catch (e) {
      alert('AI 生成失败，请检查 OpenAI API Key 配置')
    } finally {
      setAiLoading(false)
    }
  }

  // 步骤管理
  const addStep = () => setSteps((s) => [...s, { description: '', image: '', imageFile: null }])
  const removeStep = (idx) => setSteps((s) => s.filter((_, i) => i !== idx))
  const updateStep = (idx, key, value) =>
    setSteps((s) => s.map((step, i) => (i === idx ? { ...step, [key]: value } : step)))

  const handleStepImage = (idx, e) => {
    const file = e.target.files[0]
    if (!file) return
    updateStep(idx, 'imageFile', file)
    updateStep(idx, 'image', URL.createObjectURL(file))
  }

  // 提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { alert('请填写作品标题'); return }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('craft_type', form.craft_type)
      fd.append('difficulty', form.difficulty)
      fd.append('materials', JSON.stringify(form.materials.split('、').filter(Boolean)))
      fd.append('tools', JSON.stringify(form.tools.split('、').filter(Boolean)))
      if (coverFile) fd.append('cover_image', coverFile)

      let workId = id
      if (isEdit) {
        await updateWork(id, fd)
      } else {
        const res = await createWork(fd)
        if (res.success) workId = res.data.id
      }

      // 保存步骤
      if (steps.length > 0 && workId) {
        const stepFd = new FormData()
        const stepsData = steps.map((s, i) => ({
          ...(s.id ? { id: s.id } : {}),
          sort_order: i,
          description: s.description,
        }))
        stepFd.append('steps', JSON.stringify(stepsData))
        steps.forEach((s, i) => {
          if (s.imageFile) stepFd.append(`step_images_${i}`, s.imageFile)
        })
        await saveSteps(workId, stepFd)
      }

      navigate('/admin')
    } catch (e) {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-6">{isEdit ? '编辑作品' : '新建作品'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 基本信息 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">作品标题 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="输入作品标题"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">工艺类别 *</label>
            <select
              value={form.craft_type}
              onChange={(e) => handleChange('craft_type', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="crochet">🧶 钩针</option>
              <option value="knitting">🪡 棒针</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">难度 *</label>
            <select
              value={form.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="beginner">入门</option>
              <option value="intermediate">进阶</option>
              <option value="advanced">高级</option>
            </select>
          </div>
        </div>

        {/* 封面图 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
          <div className="flex items-center gap-4">
            {coverPreview && (
              <img src={coverPreview} alt="" className="w-20 h-20 rounded-lg object-cover" />
            )}
            <label className="cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition">
              选择图片
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* AI 生成区域 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-700">✨ AI 智能填充</h3>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={aiLoading}
              className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {aiLoading ? '生成中...' : 'AI 生成'}
            </button>
          </div>
          <p className="text-xs text-purple-500 mb-2">上传作品图片，AI 将自动生成描述、材料和工具推荐</p>
          <label className="cursor-pointer inline-flex items-center gap-1 bg-white border border-purple-200 rounded px-3 py-1.5 text-xs text-purple-600 hover:bg-purple-50 transition">
            📷 选择 AI 识别图片
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAiImageFile(e.target.files[0])}
              className="hidden"
            />
          </label>
          {aiImageFile && <span className="text-xs text-gray-400 ml-2">{aiImageFile.name}</span>}
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">作品描述</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            placeholder="描述你的作品..."
          />
        </div>

        {/* 材料 & 工具 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">材料清单</label>
            <textarea
              value={form.materials}
              onChange={(e) => handleChange('materials', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="用「、」分隔，如：钩针、毛线"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">工具清单</label>
            <textarea
              value={form.tools}
              onChange={(e) => handleChange('tools', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="用「、」分隔，如：剪刀、缝合针"
            />
          </div>
        </div>

        {/* 教程步骤 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">制作教程</label>
            <button
              type="button"
              onClick={addStep}
              className="text-xs text-pink-600 hover:underline"
            >
              + 添加步骤
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(idx, 'description', e.target.value)}
                      rows={2}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      placeholder={`步骤 ${idx + 1} 的说明...`}
                    />
                    <div className="flex items-center gap-2">
                      {step.image && (
                        <img src={step.image} alt="" className="w-12 h-12 rounded object-cover" />
                      )}
                      <label className="cursor-pointer text-xs text-gray-500 hover:text-pink-600">
                        📷 上传图片
                        <input type="file" accept="image/*" onChange={(e) => handleStepImage(idx, e)} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50 transition"
          >
            {saving ? '保存中...' : isEdit ? '更新作品' : '创建作品'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
