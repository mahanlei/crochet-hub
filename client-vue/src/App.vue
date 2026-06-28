<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold text-pink-600 tracking-tight">
          🧶 CrochetHub
        </router-link>
        <div class="flex gap-6 text-sm">
          <router-link to="/" class="text-gray-600 hover:text-pink-600 transition">
            作品展示
          </router-link>
          <router-link to="/admin" class="text-gray-600 hover:text-pink-600 transition">
            作品管理
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <main class="max-w-6xl mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>
