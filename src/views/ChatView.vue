<template>
  <div class="flex flex-col h-[calc(100vh-8rem)]">
    <!-- Welcome Message -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        Welcome to my portfolio!
      </h2>
      <p class="text-gray-600 mb-4">
        I'm an AI version of the portfolio owner. Ask me about projects, experience, skills, or anything else you'd like to know!
      </p>
      
      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="prompt in quickPrompts" 
          :key="prompt"
          @click="handleQuickPrompt(prompt)"
          class="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
        >
          {{ prompt }}
        </button>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div class="flex-1 bg-white rounded-lg shadow-sm p-6 mb-4 overflow-y-auto">
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-8">
        Start a conversation by typing a message below or clicking one of the prompts above.
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="flex"
          :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
            :class="message.sender === 'user' 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-900 rounded-bl-none'"
          >
            {{ message.text }}
          </div>
        </div>
      </div>

      <!-- API Connection Status -->
      <div v-if="apiStatus" class="mt-4 p-3 rounded-lg" :class="apiStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        <div class="flex items-center">
          <div class="w-2 h-2 rounded-full mr-2" :class="apiStatus.success ? 'bg-green-500' : 'bg-red-500'"></div>
          {{ apiStatus.message }}
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex space-x-2">
        <input
          v-model="currentMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loading"
        />
        <button
          @click="sendMessage"
          :disabled="!currentMessage.trim() || loading"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiStore } from '../stores/api'

const apiStore = useApiStore()

// Chat state
const currentMessage = ref('')
const loading = ref(false)
const messages = ref<Array<{sender: 'user' | 'assistant', text: string}>>([])
const apiStatus = ref<{success: boolean, message: string} | null>(null)

// Quick prompts for user guidance
const quickPrompts = [
  'Tell me about your experience',
  'Show me your projects',
  'What technologies do you use?',
  'How can I contact you?'
]

// Test API connection on mount
onMounted(async () => {
  try {
    const response = await apiStore.fetchHello()
    apiStatus.value = {
      success: true,
      message: `Connected to API: ${response.message}`
    }
  } catch (error) {
    apiStatus.value = {
      success: false,
      message: 'Failed to connect to backend API'
    }
  }
})

const handleQuickPrompt = (prompt: string) => {
  currentMessage.value = prompt
  sendMessage()
}

const sendMessage = () => {
  if (!currentMessage.value.trim() || loading.value) return
  
  // Add user message
  messages.value.push({
    sender: 'user',
    text: currentMessage.value
  })
  
  // Simulate AI response (placeholder for now)
  loading.value = true
  setTimeout(() => {
    messages.value.push({
      sender: 'assistant',
      text: `Thanks for your message: "${currentMessage.value}". This is a placeholder response. In the next phase, this will connect to OpenAI!`
    })
    loading.value = false
  }, 1000)
  
  currentMessage.value = ''
}
</script>