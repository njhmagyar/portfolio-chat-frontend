<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Main Container -->
    <div class="max-w-4xl mx-auto px-6 py-6 h-[calc(100vh-120px)] flex flex-col">
      <!-- Welcome Section (only show if no messages) -->
      <div v-if="messages.length === 0" class="bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg shadow-gray-500/10 p-10 mb-8">
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Start a conversation
          </h2>
          <p class="text-gray-600 mb-8 max-w-lg mx-auto text-base leading-relaxed">
            I'm an AI assistant trained on Nathan's portfolio. Ask me about his projects, skills, or experience.
          </p>
          
          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap gap-3 justify-center">
            <button 
              v-for="prompt in quickPrompts" 
              :key="prompt"
              @click="handleQuickPrompt(prompt)"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
            >
              {{ prompt }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Active Conversation Header -->
      <div v-else class="flex items-center justify-between mb-6 bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 text-base">Nathan Magyar AI</h3>
            <p class="text-xs text-blue-600 font-medium" v-if="apiStore.sessionId">🟢 Session active • Shareable</p>
          </div>
        </div>
        
        <button
          @click="startNewConversation"
          class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-white/70 rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium border border-gray-200/50 hover:border-gray-300/70 backdrop-blur-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      <!-- Chat Messages Area -->
      <div class="flex-1 overflow-y-auto mb-6 pr-2">
        <div class="space-y-6">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="flex items-start space-x-4"
            :class="message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
          >
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-md"
                :class="message.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300/50'"
              >
                {{ message.sender === 'user' ? 'U' : 'AI' }}
              </div>
            </div>
            
            <!-- Message -->
            <div 
              class="max-w-xs lg:max-w-lg px-5 py-4 rounded-3xl shadow-lg backdrop-blur-sm"
              :class="message.sender === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-600/20' 
                : 'bg-white/70 border border-white/30 text-gray-900 shadow-gray-500/10'"
            >
              <p class="text-sm leading-relaxed font-medium">{{ message.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- API Connection Status -->
      <div v-if="apiStatus && !apiStatus.success" class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200/60 backdrop-blur-sm">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span class="text-sm text-red-700 font-medium">{{ apiStatus.message }}</span>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="bg-white/60 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl shadow-gray-500/10">
        <div class="flex items-end space-x-4 p-5">
          <div class="flex-1">
            <input
              v-model="currentMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Ask me anything about Nathan's work..."
              class="w-full px-0 py-3 text-base placeholder-gray-500 border-0 focus:outline-none focus:ring-0 resize-none bg-transparent font-medium"
              :disabled="loading"
            />
          </div>
          <button
            @click="sendMessage"
            :disabled="!currentMessage.trim() || loading"
            class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transform hover:scale-105 disabled:hover:scale-100"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useApiStore } from '../stores/api'
import { useRoute, useRouter } from 'vue-router'

const apiStore = useApiStore()
const route = useRoute()
const router = useRouter()

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

// Initialize session from URL and test API connection
onMounted(async () => {
  // Load session ID from URL query parameter
  const urlSessionId = route.query.session as string
  if (urlSessionId) {
    apiStore.sessionId = urlSessionId
    
    // Load conversation history for this session
    try {
      const historyData = await apiStore.fetchConversationHistory(urlSessionId)
      
      // Convert backend messages to frontend format
      messages.value = historyData.messages.map((msg: any) => ({
        sender: msg.message_type === 'user_query' ? 'user' : 'assistant',
        text: msg.content
      }))
      
      console.log(`Loaded ${messages.value.length} messages from conversation`)
      
      // Scroll to bottom after messages load
      await nextTick()
      scrollToBottom()
    } catch (error) {
      console.error('Failed to load conversation history:', error)
      // Don't show error to user - they can start fresh conversation
    }
  }
  
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

// Watch for session ID changes and update URL
watch(() => apiStore.sessionId, (newSessionId) => {
  if (newSessionId && newSessionId !== route.query.session) {
    // Update URL with session ID
    router.push({
      query: { ...route.query, session: newSessionId }
    })
  }
}, { immediate: true })

const handleQuickPrompt = (prompt: string) => {
  currentMessage.value = prompt
  sendMessage()
}

const startNewConversation = () => {
  // Clear the current session
  apiStore.clearSession()
  
  // Clear the chat messages
  messages.value = []
  
  // Clear any API status
  apiStatus.value = null
  
  // Remove session from URL
  router.push({
    query: { ...route.query, session: undefined }
  })
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || loading.value) return
  
  const userMessage = currentMessage.value
  
  // Add user message
  messages.value.push({
    sender: 'user',
    text: userMessage
  })
  
  // Clear input immediately
  currentMessage.value = ''
  loading.value = true
  
  try {
    // Send to backend API
    const response = await apiStore.sendChatQuery(userMessage)
    
    // Add AI response
    messages.value.push({
      sender: 'assistant',
      text: response.response || 'Sorry, I didn\'t receive a proper response.'
    })
    
    // Scroll to bottom to show new message
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Chat error:', error)
    
    // Add error message
    messages.value.push({
      sender: 'assistant',
      text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.'
    })
  } finally {
    loading.value = false
  }
}

const scrollToBottom = () => {
  const chatArea = document.querySelector('.overflow-y-auto')
  if (chatArea) {
    chatArea.scrollTop = chatArea.scrollHeight
  }
}
</script>