import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import WorkDetail from './pages/WorkDetail'
import AdminList from './pages/AdminList'
import AdminForm from './pages/AdminForm'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <nav className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-pink-600 tracking-tight">
              🧶 CrochetHub
            </Link>
            <div className="flex gap-6 text-sm">
              <Link to="/" className="text-gray-600 hover:text-pink-600 transition">
                作品展示
              </Link>
              <Link to="/admin" className="text-gray-600 hover:text-pink-600 transition">
                后台管理
              </Link>
            </div>
          </div>
        </nav>

        {/* 页面内容 */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/works/:id" element={<WorkDetail />} />
            <Route path="/admin" element={<AdminList />} />
            <Route path="/admin/new" element={<AdminForm />} />
            <Route path="/admin/edit/:id" element={<AdminForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
