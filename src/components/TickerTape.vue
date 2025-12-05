<template>
  <div ref="container" class="overflow-hidden whitespace-nowrap py-4">
    <div ref="scrollContent" class="inline-flex gap-20 ticker-scroll">
      <div 
        class="flex items-center justify-center gap-4 flex-shrink-0 w-36" 
        v-for="(tech, index) in displayTechnologies" 
        :key="`${tech.name}-${tech.id}`"
        :ref="el => itemRefs[index] = el"
      >
        <component 
          :is="tech.component" 
          :width="24" 
          :height="24" 
          :fill="isDark ? '#99a1af' : '#6a7282'"
          :stroke="isDark ? '#99a1af' : '#6a7282'"
          class="tech-icon"
        />
        <span class="font-medium text-gray-500 dark:text-gray-400">{{ tech.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import FigmaIcon from '@/components/icons/FigmaIcon.vue'
import ClaudeIcon from '@/components/icons/ClaudeIcon.vue'
import CursorIcon from '@/components/icons/CursorIcon.vue'
import HtmlIcon from '@/components/icons/HtmlIcon.vue'
import CssIcon from '@/components/icons/CssIcon.vue'
import VueIcon from '@/components/icons/VueIcon.vue'
import DjangoIcon from '@/components/icons/DjangoIcon.vue'

defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

const container = ref(null)
const scrollContent = ref(null)
const itemRefs = ref([])

const technologies = [
  { name: 'Figma', component: FigmaIcon },
  { name: 'Claude', component: ClaudeIcon },
  { name: 'Cursor', component: CursorIcon },
  { name: 'HTML', component: HtmlIcon },
  { name: 'CSS', component: CssIcon },
  { name: 'Vue.js', component: VueIcon },
  { name: 'Django', component: DjangoIcon },
]

// Create display array with unique IDs and duplicates to fill screen
const displayTechnologies = ref([])
let animationId = null
let currentTranslateX = 0
const speed = 0.5 // pixels per frame

const initializeItems = () => {
  // Create enough items to fill screen + some extra
  const items = []
  let idCounter = 0
  
  // Add items until we have enough to fill screen width + extra
  for (let i = 0; i < 20; i++) { // Start with 20 items, adjust if needed
    const tech = technologies[i % technologies.length]
    items.push({
      ...tech,
      id: idCounter++
    })
  }
  
  displayTechnologies.value = items
}

// Fixed dimensions for predictable math (reduced by 25%)
const ITEM_WIDTH = 144 // w-36 in pixels (36 * 4 = 144px)
const GAP_WIDTH = 80 // gap-20 in pixels (20 * 4 = 80px) 
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP_WIDTH // 224px total

const animate = () => {
  if (!container.value || !scrollContent.value) return
  
  currentTranslateX -= speed
  scrollContent.value.style.transform = `translateX(${currentTranslateX}px)`
  
  // Check if we've scrolled one full item width
  if (Math.abs(currentTranslateX) >= TOTAL_ITEM_WIDTH) {
    // Move first item to end
    const firstTech = displayTechnologies.value.shift()
    firstTech.id = Date.now() + Math.random() // New unique ID
    displayTechnologies.value.push(firstTech)
    
    // Reset position by exactly one item width
    currentTranslateX += TOTAL_ITEM_WIDTH
    scrollContent.value.style.transform = `translateX(${currentTranslateX}px)`
  }
  
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  initializeItems()
  nextTick(() => {
    animate()
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.ticker-scroll {
  transition: none;
}
</style>