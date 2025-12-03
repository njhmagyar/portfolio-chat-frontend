<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="text-gray-400 text-4xl mb-4">⏳</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Loading case study...</h3>
        <p class="text-gray-500">Please wait while we fetch the details.</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="text-red-400 text-4xl mb-4">❌</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Case study not found</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <router-link 
          to="/browse" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          ← Back to Browse
        </router-link>
      </div>
    </div>

    <!-- Case Study Content -->
    <div v-else-if="caseStudy" class="max-w-4xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div class="flex items-start justify-between mb-6">
          <router-link 
            to="/browse" 
            class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Case Studies
          </router-link>
        </div>

        <div class="flex flex-col md:flex-row md:items-start gap-6">
          <!-- Hero Image -->
          <div v-if="caseStudy.hero_image" class="md:w-1/3">
            <img 
              :src="caseStudy.hero_image"
              :alt="caseStudy.title"
              class="w-full rounded-lg shadow-md"
            />
          </div>

          <!-- Title and Meta -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span 
                class="px-3 py-1 text-sm rounded-full font-medium"
                :class="getCategoryClass(caseStudy.category)"
              >
                {{ getCategoryLabel(caseStudy.category) }}
              </span>
              <span class="text-gray-500 text-sm">{{ caseStudy.project.timeline }}</span>
            </div>

            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {{ caseStudy.title }}
            </h1>

            <p class="text-lg text-gray-600 mb-6 leading-relaxed">
              {{ caseStudy.description }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Role</h3>
                <p class="text-gray-600">{{ caseStudy.project.role }}</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Timeline</h3>
                <p class="text-gray-600">{{ caseStudy.project.timeline }}</p>
              </div>
            </div>

            <!-- Technologies -->
            <div class="mt-6">
              <h3 class="font-semibold text-gray-900 mb-3">Technologies Used</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tech in caseStudy.project.technologies" 
                  :key="tech"
                  class="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table of Contents (if there are multiple sections) -->
      <div v-if="caseStudy.sections.length > 3" class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
        <nav class="space-y-2">
          <a 
            v-for="section in caseStudy.sections" 
            :key="section.id"
            :href="`#section-${section.id}`"
            class="block text-blue-600 hover:text-blue-800 transition-colors"
          >
            {{ section.title }}
          </a>
        </nav>
      </div>

      <!-- Case Study Sections -->
      <div class="space-y-8">
        <div 
          v-for="(section, index) in caseStudy.sections" 
          :key="section.id"
          :id="`section-${section.id}`"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <!-- Section Header -->
          <div class="px-8 py-6 bg-gray-50 border-b border-gray-100">
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                {{ index + 1 }}
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ section.title }}</h2>
                <p class="text-sm text-gray-600 capitalize">{{ section.section_type.replace('_', ' ') }}</p>
              </div>
            </div>
          </div>

          <!-- Section Content -->
          <div class="px-8 py-6">
            <!-- Text Content -->
            <div class="prose max-w-none mb-6">
              <p 
                v-for="paragraph in section.content.split('\n\n')" 
                :key="paragraph.substring(0, 50)"
                class="text-gray-700 leading-relaxed mb-4"
              >
                {{ paragraph.trim() }}
              </p>
            </div>

            <!-- Section Media -->
            <div v-if="section.media_urls && section.media_urls.length > 0" class="mt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Supporting Media</h4>
              
              <!-- Single Image -->
              <div v-if="section.media_urls.length === 1" class="mb-6">
                <img 
                  :src="section.media_urls[0]"
                  :alt="`${section.title} illustration`"
                  class="w-full rounded-lg shadow-md"
                />
              </div>

              <!-- Multiple Images Grid -->
              <div v-else class="grid gap-4 mb-6" :class="{
                'grid-cols-1': section.media_urls.length === 1,
                'grid-cols-1 md:grid-cols-2': section.media_urls.length === 2,
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': section.media_urls.length >= 3
              }">
                <div 
                  v-for="(mediaUrl, mediaIndex) in section.media_urls" 
                  :key="mediaIndex"
                  class="group cursor-pointer"
                  @click="openLightbox(mediaUrl, `${section.title} - Image ${mediaIndex + 1}`)"
                >
                  <img 
                    :src="mediaUrl"
                    :alt="`${section.title} - Image ${mediaIndex + 1}`"
                    class="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Projects Section -->
      <div class="bg-white rounded-lg shadow-sm p-8 mt-8">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Want to see more work?</h3>
          <router-link 
            to="/browse" 
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Case Studies
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal for Images -->
    <div 
      v-if="lightboxImage"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      @click="closeLightbox"
    >
      <div class="max-w-4xl max-h-full">
        <img 
          :src="lightboxImage.url"
          :alt="lightboxImage.alt"
          class="max-w-full max-h-full object-contain rounded-lg"
          @click.stop
        />
        <p v-if="lightboxImage.alt" class="text-white text-center mt-4 text-sm">
          {{ lightboxImage.alt }}
        </p>
        <button 
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Types
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

interface LightboxImage {
  url: string
  alt: string
}

// Reactive state
const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const caseStudy = ref<CaseStudy | null>(null)
const lightboxImage = ref<LightboxImage | null>(null)

// Methods
const fetchCaseStudy = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch('/api/case-studies/')
    const data = await response.json()
    
    if (response.ok) {
      // Find the case study by slug
      const slug = route.params.slug as string
      const foundCaseStudy = data.case_studies.find((cs: CaseStudy) => cs.slug === slug)
      
      if (foundCaseStudy) {
        // Sort sections by order
        foundCaseStudy.sections.sort((a: Section, b: Section) => a.order - b.order)
        caseStudy.value = foundCaseStudy
      } else {
        error.value = `Case study with slug "${slug}" not found.`
      }
    } else {
      error.value = data.error || 'Failed to fetch case study'
    }
  } catch (err) {
    console.error('Error fetching case study:', err)
    error.value = 'An error occurred while loading the case study.'
  } finally {
    loading.value = false
  }
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
    'design': 'bg-purple-100 text-purple-700 border-purple-200',
    'development': 'bg-green-100 text-green-700 border-green-200',
    'ux_engineering': 'bg-blue-100 text-blue-700 border-blue-200',
    'product': 'bg-orange-100 text-orange-700 border-orange-200'
  }
  return classMap[category] || 'bg-gray-100 text-gray-700 border-gray-200'
}

const openLightbox = (url: string, alt: string) => {
  lightboxImage.value = { url, alt }
}

const closeLightbox = () => {
  lightboxImage.value = null
}

// Lifecycle
onMounted(() => {
  fetchCaseStudy()
})
</script>

<style scoped>
.prose p {
  margin-bottom: 1rem;
}

.prose p:last-child {
  margin-bottom: 0;
}
</style>