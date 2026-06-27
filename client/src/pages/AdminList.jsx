import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getWorks, deleteWork } from '../services/api'

const craftTypeMap = { crochet: '钩针', knitting: '棒针' }
const difficultyMap = { beginner: '入门', intermediate: '进阶', advanced: '高级' }

export default function AdminList() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadWorks = () => {
    setLoading(true)
    getWorks()
      .then((res) => { if (res.success) setWorks(res.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadWorks() }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`确定删除「${title}」？`)) return
    try {
      const res = await deleteWork(id)
      if (res.success) loadWorks()
    } catch (e) {
      alert('删除失败')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">作品管理</h1>
        <Link
          to="/admin/new"
          className="bg-pink-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-pink-700 transition"
        >
          + 新建作品
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : works.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-3">暂无作品</p>
          <Link to="/admin/new" className="text-pink-600 hover:underline">创建第一个作品</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">作品</th>
                <th className="text-left px-4 py-3 font-medium">类别</th>
                <th className="text-left px-4 py-3 font-medium">难度</th>
                <th className="text-left px-4 py-3 font-medium">创建时间</th>
                <th className="text-right px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {works.map((work) => (
                <tr key={work.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        {work.cover_image ? (
                          <img src={work.cover_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">🧶</div>
                        )}
                      </div>
                      <span className="font-medium text-gray-800 truncate max-w-[200px]">{work.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{craftTypeMap[work.craft_type] || work.craft_type}</td>
                  <td className="px-4 py-3 text-gray-500">{difficultyMap[work.difficulty] || work.difficulty}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(work.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/edit/${work.id}`)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(work.id, work.title)}
                      className="text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
