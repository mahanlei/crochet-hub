import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const distPath = join(__dirname, 'dist')
const indexPath = join(distPath, 'index.html')

// 启动时检查 dist 目录是否存在
if (!existsSync(distPath)) {
  console.error('ERROR: dist directory not found at', distPath)
}
if (!existsSync(indexPath)) {
  console.error('ERROR: index.html not found at', indexPath)
}

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', distExists: existsSync(distPath) })
})

// 托管 Vite 构建产出的静态文件
app.use(express.static(distPath))

// 所有路由都返回 index.html（支持前端 React Router）
app.get('*', (req, res) => {
  if (existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(500).send('Build artifacts not found. Check build logs.')
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CrochetHub frontend running on port ${PORT}`)
  console.log(`dist path: ${distPath}, exists: ${existsSync(distPath)}`)
})
