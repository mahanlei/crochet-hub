import { imgUrl } from '../services/api'

export default function StepList({ steps = [] }) {
  if (steps.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">制作教程</h2>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex gap-4 bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 mb-2">{step.description}</p>
              {step.image && (
                <img src={imgUrl(step.image)} alt="" className="rounded-lg max-h-48 object-cover" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
