import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getWork, imgUrl } from '../services/api'
import ImageCarousel from '../components/ImageCarousel'
import StepList from '../components/StepList'

const difficultyMap = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
}

const craftTypeMap = {
  crochet: '🧶 钩针',
  knitting: '🪡 棒针',
}

export default function WorkDetail() {
  const { id } = useParams()
  const [work, setWork] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWork(id)
      .then((res) => {
        if (res.success) setWork(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>
  if (!work) return <div className="text-center py-20 text-gray-400">作品不存在</div>

  // 收集所有图片用于轮播
  const images = [work.cover_image, ...(work.steps || []).map((s) => s.image)].filter(Boolean).map(imgUrl)

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-pink-600 mb-4 transition">
        ← 返回列表
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 左侧：图片轮播 */}
        <ImageCarousel images={images} />

        {/* 右侧：作品信息 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{work.title}</h1>

          <div className="flex gap-2 mb-4">
            <span className="text-sm text-gray-500">{craftTypeMap[work.craft_type] || work.craft_type}</span>
            <span className="text-sm text-pink-600">{difficultyMap[work.difficulty] || work.difficulty}</span>
          </div>

          {work.description && (
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{work.description}</p>
          )}

          {/* 材料清单 */}
          {work.materials?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2">材料清单</h3>
              <div className="flex flex-wrap gap-1.5">
                {work.materials.map((m, i) => (
                  <span key={i} className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 工具清单 */}
          {work.tools?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2">工具清单</h3>
              <div className="flex flex-wrap gap-1.5">
                {work.tools.map((t, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 分步教程 */}
      <div className="mt-8">
        <StepList steps={work.steps} />
      </div>
    </div>
  )
}
