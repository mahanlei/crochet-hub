import axios from 'axios'

// 生产环境使用 VITE_API_BASE 指向后端，开发环境走 Vite proxy
export const API_BASE = import.meta.env.VITE_API_BASE || ''

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 30000,
})

/** 将后端返回的图片路径转为完整可访问 URL */
export const imgUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

// 作品接口
export const getWorks = (params) => api.get('/works', { params }).then((r) => r.data)
export const getWork = (id) => api.get(`/works/${id}`).then((r) => r.data)

export const createWork = (formData) =>
  api.post('/works', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)

export const updateWork = (id, formData) =>
  api.put(`/works/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)

export const deleteWork = (id) => api.delete(`/works/${id}`).then((r) => r.data)

// 步骤接口
export const getSteps = (workId) => api.get(`/works/${workId}/steps`).then((r) => r.data)

export const saveSteps = (workId, formData) =>
  api.put(`/works/${workId}/steps`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)

// AI 接口
export const aiGenerate = (formData) =>
  api.post('/ai/generate', formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }).then((r) => r.data)
