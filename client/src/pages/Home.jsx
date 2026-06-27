import { useState, useEffect } from 'react'
import { getWorks } from '../services/api'
import FilterBar from '../components/FilterBar'
import WorkCard from '../components/WorkCard'

export default function Home() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ craft_type: '', difficulty: '' })

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.craft_type) params.craft_type = filters.craft_type
    if (filters.difficulty) params.difficulty = filters.difficulty

    getWorks(params)
      .then((res) => {
        if (res.success) setWorks(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">手工作品集</h1>
        <p className="text-sm text-gray-500">分享钩针与棒针编织的美好</p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : works.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">🧶</div>
          <p>暂无作品，快去后台添加吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  )
}
