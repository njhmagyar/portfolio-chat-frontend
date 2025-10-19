<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Portfolio Projects
      </h2>
      <p class="text-gray-600">
        Browse through my work and case studies. Click on any project to learn more.
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
            <option value="all">All Projects</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
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

    <!-- Projects Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        @click="selectProject(project)"
      >
        <!-- Project Image Placeholder -->
        <div class="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center">
          <div class="text-4xl">{{ project.emoji }}</div>
        </div>
        
        <!-- Project Content -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ project.title }}
            </h3>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getTagColor(project.category)"
            >
              {{ project.category }}
            </span>
          </div>
          
          <p class="text-gray-600 text-sm mb-3">
            {{ currentView === 'summary' ? project.summary : project.description }}
          </p>
          
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ project.timeline }}</span>
            <span>{{ project.role }}</span>
          </div>
          
          <!-- Technologies -->
          <div class="mt-3 flex flex-wrap gap-1">
            <span 
              v-for="tech in project.technologies.slice(0, 3)" 
              :key="tech"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {{ tech }}
            </span>
            <span 
              v-if="project.technologies.length > 3"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              +{{ project.technologies.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProjects.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="text-gray-400 text-4xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
      <p class="text-gray-500">Try adjusting your filters to see more projects.</p>
    </div>

    <!-- Project Detail Modal (placeholder) -->
    <div 
      v-if="selectedProject"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="selectedProject = null"
    >
      <div 
        class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedProject.title }}</h2>
            <button 
              @click="selectedProject = null"
              class="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p class="text-gray-600 mb-4">{{ selectedProject.description }}</p>
          <div class="text-sm text-gray-500">
            <p><strong>Role:</strong> {{ selectedProject.role }}</p>
            <p><strong>Timeline:</strong> {{ selectedProject.timeline }}</p>
            <p><strong>Technologies:</strong> {{ selectedProject.technologies.join(', ') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Project type definition
interface Project {
  id: number
  title: string
  summary: string
  description: string
  category: string
  role: string
  timeline: string
  technologies: string[]
  emoji: string
}

// Mock project data - this will come from the API later
const projects = ref<Project[]>([
  {
    id: 1,
    title: 'E-commerce Mobile App',
    summary: 'Redesigned mobile checkout flow increasing conversion by 23%',
    description: 'Led the complete redesign of the mobile checkout experience for a major e-commerce platform. Conducted user research, created prototypes, and collaborated with engineering to implement a streamlined 3-step checkout process.',
    category: 'Design',
    role: 'Lead UX Designer',
    timeline: '6 months',
    technologies: ['Figma', 'React Native', 'Firebase', 'Analytics'],
    emoji: '📱'
  },
  {
    id: 2,
    title: 'Portfolio Chat Platform',
    summary: 'AI-powered conversational portfolio with voice cloning',
    description: 'Built this conversational portfolio platform using Django, Vue.js, and OpenAI. Features include voice cloning, RAG-powered content retrieval, and dynamic case study generation.',
    category: 'Development',
    role: 'Full-Stack Developer',
    timeline: '3 months',
    technologies: ['Django', 'Vue.js', 'OpenAI', 'PostgreSQL', 'Heroku'],
    emoji: '🤖'
  },
  {
    id: 3,
    title: 'SaaS Dashboard Redesign',
    summary: 'Improved user engagement and reduced support tickets by 40%',
    description: 'Redesigned the main dashboard for a B2B SaaS platform serving 10k+ users. Focused on information hierarchy, data visualization, and mobile responsiveness.',
    category: 'Design',
    role: 'Senior Product Designer',
    timeline: '4 months',
    technologies: ['Sketch', 'InVision', 'D3.js', 'React'],
    emoji: '📊'
  },
  {
    id: 4,
    title: 'Product Roadmap Tool',
    summary: 'Internal tool for managing product roadmaps across teams',
    description: 'Managed the development of an internal roadmap planning tool. Coordinated with stakeholders, defined requirements, and oversaw the product launch to 200+ team members.',
    category: 'Product',
    role: 'Product Manager',
    timeline: '8 months',
    technologies: ['Jira', 'Confluence', 'React', 'Node.js'],
    emoji: '🗺️'
  }
])

const selectedFilter = ref('all')
const currentView = ref('summary')
const selectedProject = ref<Project | null>(null)

const filteredProjects = computed(() => {
  if (selectedFilter.value === 'all') {
    return projects.value
  }
  return projects.value.filter(project => 
    project.category.toLowerCase() === selectedFilter.value
  )
})

const getTagColor = (category: string) => {
  const colors: Record<string, string> = {
    'Design': 'bg-purple-100 text-purple-700',
    'Development': 'bg-green-100 text-green-700',
    'Product': 'bg-blue-100 text-blue-700'
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

const selectProject = (project: Project) => {
  selectedProject.value = project
}
</script>