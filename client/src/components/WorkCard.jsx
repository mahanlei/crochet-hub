import { Link } from 'react-router-dom'
import { imgUrl } from '../services/api'

const difficultyMap = {
  beginner: { label: '入门', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '进阶', color: 'bg-yellow-100 text-yellow-700' },
  advanced: { label: '高级', color: 'bg-red-100 text-red-700' },
}

const craftTypeMap = {
  crochet: '🧶 钩针',
  knitting: '🪡 棒针',
}

export default function WorkCard({ work }) {
  const diff = difficultyMap[work.difficulty] || { label: work.difficulty, color: 'bg-gray-100 text-gray-600' }

  return (
    <Link to={`/works/${work.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
        {/* 封面图 */}
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
          {work.cover_image ? (
            <img
              src={imgUrl(work.cover_image)}
              alt={work.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
              🧶
            </div>
          )}
        </div>

        {/* 信息 */}
        <div className="p-3">
          <h3 className="font-medium text-gray-800 text-sm mb-1.5 truncate">{work.title}</h3>
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-gray-500">{craftTypeMap[work.craft_type] || work.craft_type}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${diff.color}`}>{diff.label}</span>
          </div>
          {work.description && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{work.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
