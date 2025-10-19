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
        
        <div class="flex items-center space-x-3">
          <!-- Voice Toggle -->
          <button
            @click="toggleVoice"
            class="px-3 py-2 text-sm rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium border backdrop-blur-sm"
            :class="voiceEnabled 
              ? 'text-blue-700 bg-blue-50/70 border-blue-200/70 hover:bg-blue-100/70' 
              : 'text-gray-600 bg-gray-50/70 border-gray-200/50 hover:bg-gray-100/70'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path v-if="voiceEnabled" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              <path v-else d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <span>{{ voiceEnabled ? 'Voice On' : 'Voice Off' }}</span>
          </button>
          
          <!-- New Chat Button -->
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
              
              <!-- Audio Controls for AI Messages -->
              <div v-if="message.sender === 'assistant' && voiceEnabled && message.id" class="flex items-center mt-3 pt-3 border-t border-gray-200/50">
                <!-- Play/Stop Button -->
                <button
                  v-if="currentPlayingMessageId !== message.id"
                  @click="playAudio(message.id!, message.audio_url)"
                  :disabled="audioLoadingStates[message.id!]"
                  class="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-gray-100/50 disabled:opacity-50"
                  :class="message.has_audio ? 'text-blue-600 hover:text-blue-700' : 'text-gray-500 hover:text-gray-600'"
                >
                  <svg v-if="!audioLoadingStates[message.id!]" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="audioLoadingStates[message.id!]">Generating...</span>
                  <span v-else-if="message.has_audio">Replay</span>
                  <span v-else>Play</span>
                </button>
                
                <!-- Stop Button -->
                <button
                  v-else
                  @click="stopAudio"
                  class="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h12v12H6z"/>
                  </svg>
                  <span>Stop</span>
                </button>
                
                <!-- Audio Status Indicator -->
                <div v-if="message.has_audio" class="ml-auto flex items-center space-x-1 text-xs text-gray-500">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  <span>Audio ready</span>
                </div>
              </div>
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
const messages = ref<Array<{
  id?: number,
  sender: 'user' | 'assistant', 
  text: string,
  has_audio?: boolean,
  audio_url?: string
}>>([])
const apiStatus = ref<{success: boolean, message: string} | null>(null)

// Audio controls state
const playingAudio = ref<HTMLAudioElement | null>(null)
const currentPlayingMessageId = ref<number | null>(null)
const audioLoadingStates = ref<Record<number, boolean>>({})
const voiceEnabled = ref(true)

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
        id: msg.id,
        sender: msg.message_type === 'user_query' ? 'user' : 'assistant',
        text: msg.content,
        has_audio: msg.has_audio || false,
        audio_url: msg.audio_url || null
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
    
    // Add AI response with message ID for audio generation
    const aiMessage = {
      id: response.ai_message_id,
      sender: 'assistant' as const,
      text: response.response || 'Sorry, I didn\'t receive a proper response.',
      has_audio: false,
      audio_url: undefined
    }
    
    messages.value.push(aiMessage)
    
    // Auto-generate audio if voice is enabled
    if (voiceEnabled.value && response.ai_message_id) {
      // Don't await this - let it run in background
      playAudio(response.ai_message_id).catch(console.error)
    }
    
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

// Audio control functions
const playAudio = async (messageId: number, audioUrl?: string) => {
  try {
    // Stop any currently playing audio
    if (playingAudio.value) {
      playingAudio.value.pause()
      playingAudio.value = null
      currentPlayingMessageId.value = null
    }

    let url = audioUrl
    
    // If no audio URL provided, try to generate audio for this message
    if (!url && messageId) {
      audioLoadingStates.value[messageId] = true
      try {
        const response = await apiStore.generateMessageAudio(messageId)
        url = response.audio_url
        
        // Update the message in our local array
        const messageIndex = messages.value.findIndex(m => m.id === messageId)
        if (messageIndex !== -1) {
          messages.value[messageIndex].has_audio = true
          messages.value[messageIndex].audio_url = url
        }
      } catch (error) {
        console.error('Failed to generate audio:', error)
        return
      } finally {
        audioLoadingStates.value[messageId] = false
      }
    }

    if (url) {
      const audio = new Audio(url)
      audio.onended = () => {
        currentPlayingMessageId.value = null
        playingAudio.value = null
      }
      audio.onerror = () => {
        console.error('Failed to play audio')
        currentPlayingMessageId.value = null
        playingAudio.value = null
      }
      
      currentPlayingMessageId.value = messageId
      playingAudio.value = audio
      audio.play()
    }
  } catch (error) {
    console.error('Error playing audio:', error)
    audioLoadingStates.value[messageId] = false
  }
}

const stopAudio = () => {
  if (playingAudio.value) {
    playingAudio.value.pause()
    playingAudio.value = null
    currentPlayingMessageId.value = null
  }
}

const toggleVoice = () => {
  voiceEnabled.value = !voiceEnabled.value
  if (!voiceEnabled.value) {
    stopAudio()
  }
}
</script>