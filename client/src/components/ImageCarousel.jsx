import { useState } from 'react'

export default function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-6xl text-gray-300">
        🧶
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={images[current]}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
