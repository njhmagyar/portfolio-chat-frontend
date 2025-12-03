<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Case Studies
      </h2>
      <p class="text-gray-600">
        Explore detailed case studies of my projects and design process. Click on any case study to learn more.
      </p>
    </div>

    <!-- Filter/Sort Options -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Filter by:</label>
          <select 
            v-model="selectedFilter"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="ux_engineering">UX Engineering</option>
            <option value="product">Product Management</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">View:</label>
          <button
            v-for="view in ['summary', 'detailed']"
            :key="view"
            @click="currentView = view"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="currentView === view 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            {{ view.charAt(0).toUpperCase() + view.slice(1) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="text-gray-400 text-4xl mb-4">⏳</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Loading case studies...</h3>
      <p class="text-gray-500">Please wait while we fetch the latest content.</p>
    </div>

    <!-- Case Studies Grid -->
    <div v-else-if="!loading && filteredCaseStudies.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <router-link 
        v-for="caseStudy in filteredCaseStudies" 
        :key="caseStudy.id"
        :to="`/case-study/${caseStudy.slug}`"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow block"
      >
        <!-- Hero Image -->
        <div class="h-48 rounded-t-lg overflow-hidden">
          <img 
            v-if="caseStudy.hero_image"
            :src="caseStudy.hero_image"
            :alt="caseStudy.title"
            class="w-full h-full object-cover"
          />
          <div 
            v-else
            class="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
          >
            <div class="text-4xl">{{ getCategoryEmoji(caseStudy.category) }}</div>
          </div>
        </div>
        
        <!-- Case Study Content -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ caseStudy.title }}
            </h3>
            <span 
              class="px-2 py-1 text-xs rounded-full"
              :class="getCategoryClass(caseStudy.category)"
            >
              {{ getCategoryLabel(caseStudy.category) }}
            </span>
          </div>
          
          <p class="text-gray-600 text-sm mb-3">
            {{ currentView === 'summary' 
                ? (caseStudy.project.summary || caseStudy.description).substring(0, 120) + '...'
                : caseStudy.description 
            }}
          </p>
          
          <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{{ caseStudy.project.timeline }}</span>
            <span>{{ caseStudy.project.role }}</span>
          </div>
          
          <!-- Technologies -->
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tech in caseStudy.project.technologies.slice(0, 3)" 
              :key="tech"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {{ tech }}
            </span>
            <span 
              v-if="caseStudy.project.technologies.length > 3"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              +{{ caseStudy.project.technologies.length - 3 }}
            </span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && filteredCaseStudies.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="text-gray-400 text-4xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No case studies found</h3>
      <p class="text-gray-500">Try adjusting your filters to see more case studies.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Case Study type definitions
interface Project {
  id: number
  title: string
  slug: string
  summary: string
  role: string
  timeline: string
  technologies: string[]
  featured: boolean
  logo: string | null
  created_at: string
}

interface Section {
  id: number
  title: string
  section_type: string
  content: string
  order: number
  media_urls: string[]
}

interface CaseStudy {
  id: number
  title: string
  slug: string
  description: string
  category: string
  hero_image: string | null
  sections: Section[]
  project: Project
}

// Reactive state
const caseStudies = ref<CaseStudy[]>([])
const loading = ref(true)
const selectedFilter = ref('all')
const currentView = ref('summary')

// Computed properties
const filteredCaseStudies = computed(() => {
  if (selectedFilter.value === 'all') {
    return caseStudies.value
  }
  return caseStudies.value.filter(caseStudy => caseStudy.category === selectedFilter.value)
})

// Methods
const fetchCaseStudies = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/case-studies/')
    const data = await response.json()
    
    if (response.ok) {
      caseStudies.value = data.case_studies || []
    } else {
      console.error('Failed to fetch case studies:', data.error)
      caseStudies.value = []
    }
  } catch (error) {
    console.error('Error fetching case studies:', error)
    caseStudies.value = []
  } finally {
    loading.value = false
  }
}


const getCategoryEmoji = (category: string): string => {
  const emojiMap: { [key: string]: string } = {
    'design': '🎨',
    'development': '💻',
    'ux_engineering': '🔧',
    'product': '📊'
  }
  return emojiMap[category] || '📝'
}

const getCategoryLabel = (category: string): string => {
  const labelMap: { [key: string]: string } = {
    'design': 'Design',
    'development': 'Development',
    'ux_engineering': 'UX Engineering',
    'product': 'Product Management'
  }
  return labelMap[category] || category
}

const getCategoryClass = (category: string): string => {
  const classMap: { [key: string]: string } = {
    'design': 'bg-purple-100 text-purple-700',
    'development': 'bg-green-100 text-green-700',
    'ux_engineering': 'bg-blue-100 text-blue-700',
    'product': 'bg-orange-100 text-orange-700'
  }
  return classMap[category] || 'bg-gray-100 text-gray-700'
}

// Lifecycle
onMounted(() => {
  fetchCaseStudies()
})
</script>