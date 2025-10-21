<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="h-screen overflow-hidden bg-gray-50">
    <!-- Header with Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-semibold text-gray-900">
            Portfolio Chat
          </h1>
          
          <!-- Tab Navigation -->
          <nav class="flex space-x-8">
            <RouterLink
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.name === 'chat' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
            >
              Chat
            </RouterLink>
            <RouterLink
              to="/browse"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.name === 'browse' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
            >
              Browse
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <RouterView />
    </main>
  </div>
</template>
