const craftTypes = [
  { value: '', label: '全部' },
  { value: 'crochet', label: '🧶 钩针' },
  { value: 'knitting', label: '🪡 棒针' },
]

const difficulties = [
  { value: '', label: '全部难度' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'advanced', label: '高级' },
]

export default function FilterBar({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex gap-1.5">
        {craftTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => handleChange('craft_type', t.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              filters.craft_type === t.value
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        {difficulties.map((d) => (
          <button
            key={d.value}
            onClick={() => handleChange('difficulty', d.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              filters.difficulty === d.value
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  )
}
