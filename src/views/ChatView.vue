<template>
  <div class="min-h-screen">
    <!-- Welcome Screen (full width when no messages) -->
    <div v-if="messages.length === 0" class="max-w-4xl mx-auto px-6 py-6 h-[calc(100vh-120px)] flex flex-col">
      <!-- Welcome Section -->
      <div class="bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg shadow-gray-500/10 p-10 mb-8">
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
    </div>

    <!-- Split Screen Layout (when conversation is active) -->
    <div v-else class="fixed top-16 bottom-0 left-0 right-0">
      <div class="max-w-7xl mx-auto h-full flex">
        <!-- Chat Panel (1/3 width on desktop, hidden on mobile) -->
        <div class="hidden lg:flex lg:w-1/3 h-full flex-col border-r border-white/20 bg-white/10 backdrop-blur-sm">
        <!-- Chat Header -->
        <div class="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm border-b border-white/30">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-sm">Nathan Haynes-Magyar AI</h3>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- Voice Toggle -->
            <button
              @click="toggleVoice"
              class="px-2 py-1 text-xs rounded-lg transition-all duration-200 flex items-center space-x-1 font-medium border backdrop-blur-sm"
              :class="voiceEnabled 
                ? 'text-blue-700 bg-blue-50/70 border-blue-200/70 hover:bg-blue-100/70' 
                : 'text-gray-600 bg-gray-50/70 border-gray-200/50 hover:bg-gray-100/70'"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path v-if="voiceEnabled" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                <path v-else d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            </button>
            
            <!-- New Chat Button -->
            <button
              @click="startNewConversation"
              class="px-2 py-1 text-xs text-gray-700 hover:text-gray-900 hover:bg-white/70 rounded-lg transition-all duration-200 flex items-center space-x-1 font-medium border border-gray-200/50 hover:border-gray-300/70 backdrop-blur-sm"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div class="flex-1 overflow-y-auto p-3" style="height: calc(100vh - 204px);">
          <div class="space-y-4 pb-24">
            <div 
              v-for="(message, index) in messages" 
              :key="index"
              class="flex items-start space-x-3"
            >
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-md"
                  :class="message.sender === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300/50'"
                >
                  {{ message.sender === 'user' ? 'Q' : 'A' }}
                </div>
              </div>
              
              <!-- Message -->
              <div 
                class="max-w-xs px-3 py-2 rounded-2xl shadow-lg backdrop-blur-sm"
                :class="message.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-600/20' 
                  : 'bg-white/70 border border-white/30 text-gray-900 shadow-gray-500/10'"
              >
                <!-- Audio Controls for AI Messages -->
                <div v-if="message.sender === 'assistant' && voiceEnabled && message.id" class="flex items-center" :class="{'mt-2': index === messages.length - 1}">
                  <!-- Play/Stop Button -->
                  <button
                    v-if="currentPlayingMessageId !== message.id"
                    @click="playAudio(message.id!, message.audio_url)"
                    :disabled="audioLoadingStates[message.id!]"
                    class="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-gray-100/50 disabled:opacity-50"
                    :class="message.has_audio ? 'text-blue-600 hover:text-blue-700' : 'text-gray-500 hover:text-gray-600'"
                  >
                    <svg v-if="!audioLoadingStates[message.id!]" class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg v-else class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span v-if="audioLoadingStates[message.id!]">...</span>
                    <span v-else-if="message.has_audio">Play</span>
                    <span v-else>🔊</span>
                  </button>
                  
                  <!-- Stop Button -->
                  <button
                    v-else
                    @click="stopAudio"
                    class="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200"
                  >
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                    <span>Stop</span>
                  </button>
                </div>
                <p class="text-sm leading-relaxed" :class="{'mt-3 mb-3 pt-2 border-t border-gray-200/50': message.sender === 'assistant'}" v-html="renderSynchronizedText(message)"></p>
                
                <!-- Follow-up Suggestions for AI Messages -->
                <div v-if="message.sender === 'assistant' && message.follow_up_suggestions && message.follow_up_suggestions.length > 0 && index === messages.length - 1 && !playingAudio && !preparingAudio" class="">
                  <p class="text-xs text-gray-600 mb-2 font-medium">Continue the conversation:</p>
                  <div class="space-y-1">
                    <button
                      v-for="(suggestion, idx) in message.follow_up_suggestions"
                      :key="idx"
                      @click="useFollowUpSuggestion(suggestion)"
                      class="block w-full text-left text-xs px-2 py-1 rounded bg-blue-50/70 text-blue-700 hover:bg-blue-100/70 transition-colors border border-blue-200/50"
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Thinking Loading State -->
            <div v-if="isThinking" class="flex items-start space-x-3">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Thinking Message -->
              <div class="flex-1 max-w-md">
                <div class="bg-white/70 border border-white/30 text-gray-900 shadow-gray-500/10 max-w-xs px-3 py-2 rounded-2xl shadow-lg backdrop-blur-sm">
                  <p class="text-sm leading-relaxed text-gray-500 italic">
                    <span class="inline-flex items-center">
                      Thinking
                      <span class="ml-1 animate-pulse">...</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input - Fixed to bottom -->
        <div class="absolute bottom-0 left-0 right-0 p-3 bg-white/60 backdrop-blur-md border-t border-white/30">
          <div class="flex items-center space-x-2 mb-2">
              <label class="text-xs font-medium text-gray-600">Response length:</label>
              <div class="flex space-x-1">
                <button
                  v-for="length in ['short', 'medium', 'long']" 
                  :key="length"
                  @click="responseLength = length"
                  :class="responseLength === length 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : 'bg-white/50 text-gray-600 border-gray-200/50 hover:bg-white/70'"
                  class="px-2 py-1 text-xs rounded border transition-colors capitalize"
                  :disabled="loading"
                >
                  {{ length }}
                </button>
              </div>
            </div>
          <div class="flex items-end space-x-3">
            <div class="flex-1">
              <input
                v-model="currentMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Ask about Nathan's work..."
                class="w-full px-3 py-2 text-sm placeholder-gray-500 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                :disabled="loading"
              />
            </div>
            <button
              @click="sendMessage"
              :disabled="!currentMessage.trim() || loading"
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transform hover:scale-105 disabled:hover:scale-100"
            >
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </div>
        </div>

        <!-- Presentation Area (full width on mobile, 2/3 width on desktop) -->
        <div class="w-full lg:w-2/3 flex flex-col min-h-0 relative">
        <!-- Presentation Header -->
        <div class="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-b border-white/30 flex-shrink-0">
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ slides.length > 0 && slides[currentSlideIndex] ? slides[currentSlideIndex]?.title : 'Portfolio Presentation' }}
            </h2>
            <p class="text-sm text-gray-600">Slide {{ currentSlideIndex + 1 }} of {{ slides.length }}</p>
          </div>
          
          <!-- Slide Navigation -->
          <div class="flex items-center space-x-2">
            <button
              @click="prevSlide"
              :disabled="currentSlideIndex === 0"
              class="p-2 rounded-lg bg-white/70 border border-gray-200/50 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <!-- Slide Dots -->
            <div class="flex space-x-1">
              <button
                v-for="(slide, index) in slides"
                :key="slide.id"
                @click="goToSlide(index)"
                class="w-2 h-2 rounded-full transition-all duration-200"
                :class="index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'"
              ></button>
            </div>
            
            <button
              @click="nextSlide"
              :disabled="currentSlideIndex === slides.length - 1"
              class="p-2 rounded-lg bg-white/70 border border-gray-200/50 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Slide Content -->
        <div class="flex-1 flex items-center justify-center p-4 lg:p-6 pb-24 lg:pb-6 min-h-0 overflow-auto">
          <div v-if="slides.length > 0 && slides[currentSlideIndex]" class="w-full max-w-4xl h-full flex items-center">
            <!-- Slide -->
            <div class="bg-white rounded-3xl shadow-lg backdrop-blur-sm bg-white/70 border border-white/30 shadow-gray-500/10 p-6 lg:p-8 w-full flex flex-col justify-center">
              <!-- Slide Title -->
              <h1 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {{ slides[currentSlideIndex]?.title }}
              </h1>
              
              <!-- Media Carousel -->
              <div v-if="slides[currentSlideIndex]?.media_urls && slides[currentSlideIndex]?.media_urls.length > 0" class="mb-6">
                <div class="relative group">
                  <!-- Current Image -->
                  <div class="overflow-hidden rounded-lg shadow-lg bg-gray-100 aspect-video">
                    <img 
                      :src="slides[currentSlideIndex]?.media_urls[currentCarouselIndices[slides[currentSlideIndex]?.id ?? 0] || 0]"
                      :alt="`Project image ${(currentCarouselIndices[slides[currentSlideIndex]?.id ?? 0] || 0) + 1}`"
                      class="w-full h-full object-cover transition-opacity duration-300"
                      loading="lazy"
                    />
                  </div>
                  
                  <!-- Navigation Buttons (only show if more than 1 image) -->
                  <div v-if="(slides[currentSlideIndex]?.media_urls?.length ?? 0) > 1" class="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      @click="prevCarouselImage(slides[currentSlideIndex]?.id ?? 0)"
                      class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    
                    <button 
                      @click="nextCarouselImage(slides[currentSlideIndex]?.id ?? 0)"
                      class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Image Counter -->
                  <div v-if="(slides[currentSlideIndex]?.media_urls?.length ?? 0) > 1" class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {{ (currentCarouselIndices[slides[currentSlideIndex]?.id ?? 0] || 0) + 1 }} / {{ slides[currentSlideIndex]?.media_urls?.length ?? 0 }}
                  </div>
                  
                  <!-- Dots Indicator -->
                  <div v-if="(slides[currentSlideIndex]?.media_urls?.length ?? 0) > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <button
                      v-for="(_, index) in slides[currentSlideIndex]?.media_urls"
                      :key="index"
                      @click="currentCarouselIndices[slides[currentSlideIndex]?.id ?? 0] = index"
                      class="w-2 h-2 rounded-full transition-colors duration-200"
                      :class="(currentCarouselIndices[slides[currentSlideIndex]?.id ?? 0] || 0) === index ? 'bg-white' : 'bg-white/50'"
                    ></button>
                  </div>
                </div>
              </div>
              
              <!-- Bullet Points -->
              <div class="space-y-3 lg:space-y-4">
                <div 
                  v-for="(bullet, index) in slides[currentSlideIndex]?.bullets" 
                  :key="index"
                  class="flex items-start space-x-3 lg:space-x-4 opacity-0 animate-fadeInUp"
                  :style="{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }"
                >
                  <div class="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p class="text-lg lg:text-xl text-gray-700 leading-relaxed">{{ bullet }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg">Start a conversation to see slides</p>
          </div>
        </div>
        
        <!-- Mobile Text Input - Fixed to bottom (hidden on desktop) -->
        <div class="lg:hidden absolute bottom-0 left-0 right-0 p-3 bg-white/60 backdrop-blur-md border-t border-white/30">
          <div class="flex items-center space-x-2 mb-2">
            <label class="text-xs font-medium text-gray-600">Response length:</label>
            <div class="flex space-x-1">
              <button
                v-for="length in ['short', 'medium', 'long']" 
                :key="length"
                @click="responseLength = length"
                :class="responseLength === length 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-white/50 text-gray-600 border-gray-200/50 hover:bg-white/70'"
                class="px-2 py-1 text-xs rounded border transition-colors capitalize"
                :disabled="loading"
              >
                {{ length }}
              </button>
            </div>
          </div>
          <div class="flex items-end space-x-3">
            <div class="flex-1">
              <input
                v-model="currentMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Ask about Nathan's work..."
                class="w-full px-3 py-2 text-sm placeholder-gray-500 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                :disabled="loading"
              />
            </div>
            <button
              @click="sendMessage"
              :disabled="!currentMessage.trim() || loading"
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transform hover:scale-105 disabled:hover:scale-100"
            >
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- API Connection Status -->
    <div v-if="apiStatus && !apiStatus.success" class="fixed bottom-4 right-4 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200/60 backdrop-blur-sm shadow-lg">
      <div class="flex items-center space-x-3">
        <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
        <span class="text-sm text-red-700 font-medium">{{ apiStatus.message }}</span>
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

// Local reactive state
const messages = ref<Array<{
  id?: number
  sender: 'user' | 'assistant'
  text: string
  has_audio?: boolean
  audio_url?: string
  slide_title?: string
  slide_body?: string
  slide_media_urls?: string[]
  audio_word_timestamps?: Array<{word: string, start: number, end: number}>
  follow_up_suggestions?: string[]
}>>([])

// Slide management state
const slides = ref<Array<{
  id: number,
  title: string,
  bullets: string[],
  media_urls: string[],
  messageId?: number
}>>([])

const currentSlideIndex = ref(0)

// Carousel state for each slide
const currentCarouselIndices = ref<{ [slideId: number]: number }>({})

const currentMessage = ref('')
const responseLength = ref('short')
const loading = ref(false)
const apiStatus = ref<{success: boolean, message: string} | null>(null)

// Voice-related state
const voiceEnabled = ref(true)
const playingAudio = ref<HTMLAudioElement | null>(null)
const currentPlayingMessageId = ref<number | null>(null)
const audioLoadingStates = ref<Record<number, boolean>>({})

// Text-audio synchronization state
const currentHighlightedWordIndex = ref<number | null>(null)
const audioSyncInterval = ref<number | null>(null)
const visibleWordIndices = ref<{ [messageId: number]: number }>({}) // Track how many words are visible per message
const messagesWithAudioReady = ref<Set<number>>(new Set()) // Track which messages have audio ready
const currentSpeakingWordIndex = ref<{ [messageId: number]: number }>({}) // Track currently speaking word per message

// Loading state management
const isThinking = ref(false) // When LLM is generating text
const preparingAudio = ref<{ [messageId: number]: boolean }>({}) // When audio is being generated per message
const pendingAutoPlay = ref<{ [messageId: number]: boolean }>({}) // Messages waiting for auto-play

// Quick prompts for user engagement - will be loaded from API
const quickPrompts = ref<string[]>([])

// Function to render text with word-by-word synchronization
const renderSynchronizedText = (message: any) => {
  if (message.sender === 'user' || currentPlayingMessageId.value !== message.id) {
    // For user messages, always show full text
    return message.text
  }

  // For AI messages, handle loading states and progressive display
  if (message.sender === 'assistant') {
    // Check if this message is in audio preparation
    if (preparingAudio.value[message.id]) {
      return '<span class="text-gray-500 italic">Preparing audio...</span>'
    }
    
    // If no timestamps yet or audio not ready, don't show text content
    if (!message.audio_word_timestamps || message.audio_word_timestamps.length === 0) {
      return ''
    }

    // For AI messages with timestamps, show words progressively
    const timestamps = message.audio_word_timestamps || []
    const visibleWordCount = visibleWordIndices.value[message.id] || 0
    // const currentSpeakingWord = currentSpeakingWordIndex.value[message.id] || -1
    
    // If audio hasn't started yet (no visible words and audio not ready), show empty
    if (visibleWordCount === 0 && !messagesWithAudioReady.value.has(message.id)) {
      return ''
    }
    
    // Split text into words while preserving their positions
    const words = message.text.split(/\s+/).filter((word: string) => word.length > 0)
    let result = ''
    
    for (let i = 0; i < words.length && i < timestamps.length; i++) {
      const word = words[i]
      
      // Only show words that should be visible
      if (i < visibleWordCount) {
        result += word;        
        // Add space after word (except for last visible word)
        if (i < visibleWordCount - 1) {
          result += ' '
        }
      }
    }
    
    return result
  }
  
  // Fallback for other message types
  return message.text
}

// Default fallback prompts
const defaultPrompts = [
  "What projects have you worked on?",
  "Tell me about your experience",
]

// Slide functions
const generateSlideFromBackendData = (slideTitle: string, slideBody: string, messageId?: number, mediaUrls: string[] = []) => {
  // Parse HTML bullets from backend
  const bullets: string[] = []
  
  if (slideBody) {
    // Extract bullet points from HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(slideBody, 'text/html')
    const listItems = doc.querySelectorAll('li')
    
    listItems.forEach(li => {
      const text = li.textContent?.trim()
      if (text) {
        bullets.push(text)
      }
    })
  }
  
  // Create new slide
  const slideId = Date.now()
  const newSlide = {
    id: slideId,
    title: slideTitle || 'Portfolio Information',
    bullets: bullets.length > 0 ? bullets : ['Key information from conversation'],
    media_urls: mediaUrls,
    messageId
  }
  
  // Initialize carousel index for this slide
  if (mediaUrls.length > 0) {
    currentCarouselIndices.value[slideId] = 0
  }
  
  slides.value.push(newSlide)
  currentSlideIndex.value = slides.value.length - 1
}

const nextSlide = () => {
  if (currentSlideIndex.value < slides.value.length - 1) {
    currentSlideIndex.value++
  }
}

const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < slides.value.length) {
    currentSlideIndex.value = index
  }
}

// Carousel navigation functions
const nextCarouselImage = (slideId: number) => {
  const slide = slides.value.find(s => s.id === slideId)
  if (slide && slide.media_urls.length > 1) {
    const currentIndex = currentCarouselIndices.value[slideId] || 0
    currentCarouselIndices.value[slideId] = (currentIndex + 1) % slide.media_urls.length
  }
}

const prevCarouselImage = (slideId: number) => {
  const slide = slides.value.find(s => s.id === slideId)
  if (slide && slide.media_urls.length > 1) {
    const currentIndex = currentCarouselIndices.value[slideId] || 0
    currentCarouselIndices.value[slideId] = currentIndex === 0 ? slide.media_urls.length - 1 : currentIndex - 1
  }
}

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
        audio_url: msg.audio_url || null,
        slide_title: msg.slide_title || null,
        slide_body: msg.slide_body || null,
        slide_media_urls: msg.slide_media_urls || [],
        audio_word_timestamps: msg.audio_word_timestamps || [],
        follow_up_suggestions: msg.follow_up_suggestions || []
      }))
      
      console.log(`Loaded ${messages.value.length} messages from conversation`)
      
      // Generate slides for existing AI messages that have slide data
      messages.value.forEach(msg => {
        if (msg.sender === 'assistant' && msg.slide_title) {
          generateSlideFromBackendData(msg.slide_title, msg.slide_body || '', msg.id, msg.slide_media_urls || [])
        }
      })
      
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
  
  // Load featured questions for homepage prompts
  await loadFeaturedQuestions()
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
  
  // Clear the chat messages and slides
  messages.value = []
  slides.value = []
  currentSlideIndex.value = 0
  
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
  isThinking.value = true
  
  try {
    // Send to backend API
    const response = await apiStore.sendChatQuery(userMessage, responseLength.value)
    
    // Stop thinking state
    isThinking.value = false
    
    // Add AI response with message ID for audio generation
    const aiMessage = {
      id: response.ai_message_id,
      sender: 'assistant' as const,
      text: response.response || 'Sorry, I didn\'t receive a proper response.',
      has_audio: false,
      audio_url: undefined,
      follow_up_suggestions: response.follow_up_suggestions || [],
      audio_word_timestamps: []
    }
    
    messages.value.push(aiMessage)
    
    // Mark as preparing audio if voice is enabled
    if (voiceEnabled.value && response.ai_message_id) {
      preparingAudio.value[response.ai_message_id] = true
    }
    
    // Generate slide from backend slide data
    if (response.slide_title) {
      generateSlideFromBackendData(response.slide_title, response.slide_body || '', response.ai_message_id, response.slide_media_urls || [])
    }
    
    // Generate audio and auto-play if voice is enabled
    if (response.ai_message_id) {
      if (voiceEnabled.value) {
        // Mark for auto-play once audio is ready
        pendingAutoPlay.value[response.ai_message_id] = true
        // Generate audio in background, will auto-play when ready
        generateAudioInBackground(response.ai_message_id)
      } else {
        // Just generate audio in background for timestamps, but mark as ready
        generateAudioInBackground(response.ai_message_id)
      }
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
    isThinking.value = false
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
    // Stop any currently playing audio and clear word highlighting
    if (playingAudio.value) {
      playingAudio.value.pause()
      playingAudio.value = null
      currentPlayingMessageId.value = null
    }
    
    // Clear any existing word synchronization
    if (audioSyncInterval.value) {
      clearInterval(audioSyncInterval.value)
      audioSyncInterval.value = null
    }
    currentHighlightedWordIndex.value = null

    let url = audioUrl
    
    // If no audio URL provided, try to generate audio for this message
    if (!url && messageId) {
      audioLoadingStates.value[messageId] = true
      try {
        const response = await apiStore.generateMessageAudio(messageId)
        url = response.audio_url
        
        // Update the message in our local array
        const messageIndex = messages.value.findIndex(m => m.id === messageId)
        if (messageIndex !== -1 && messages.value[messageIndex]) {
          messages.value[messageIndex]!.has_audio = true
          messages.value[messageIndex]!.audio_url = url
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
        // Clear word highlighting when audio ends
        if (audioSyncInterval.value) {
          clearInterval(audioSyncInterval.value)
          audioSyncInterval.value = null
        }
        currentHighlightedWordIndex.value = null
      }
      audio.onerror = () => {
        console.error('Failed to play audio')
        currentPlayingMessageId.value = null
        playingAudio.value = null
        // Clear word highlighting on error
        if (audioSyncInterval.value) {
          clearInterval(audioSyncInterval.value)
          audioSyncInterval.value = null
        }
        currentHighlightedWordIndex.value = null
      }
      
      currentPlayingMessageId.value = messageId
      playingAudio.value = audio
      
      // Start word synchronization if timestamps are available
      startWordSynchronization(messageId)
      
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
  
  // Clear word highlighting when stopping audio
  if (audioSyncInterval.value) {
    clearInterval(audioSyncInterval.value)
    audioSyncInterval.value = null
  }
  currentHighlightedWordIndex.value = null
  
  // Clear speaking word highlighting for all messages
  for (const messageId in currentSpeakingWordIndex.value) {
    currentSpeakingWordIndex.value[messageId] = -1
  }
}

const toggleVoice = () => {
  voiceEnabled.value = !voiceEnabled.value
  if (!voiceEnabled.value) {
    stopAudio()
  }
}

// Generate audio in background with auto-play support
const generateAudioInBackground = async (messageId: number) => {
  try {
    audioLoadingStates.value[messageId] = true
    const response = await apiStore.generateMessageAudio(messageId)
    
    // Clear preparing audio state
    preparingAudio.value[messageId] = false
    
    // Update the message with audio info
    const messageIndex = messages.value.findIndex(m => m.id === messageId)
    if (messageIndex !== -1 && messages.value[messageIndex]) {
      messages.value[messageIndex]!.has_audio = true
      messages.value[messageIndex]!.audio_url = response.audio_url
      messages.value[messageIndex]!.audio_word_timestamps = response.audio_word_timestamps || []
    }
    
    // Mark this message as having audio ready
    messagesWithAudioReady.value.add(messageId)
    
    // Auto-play if marked for auto-play
    if (pendingAutoPlay.value[messageId]) {
      pendingAutoPlay.value[messageId] = false
      console.log('Auto-playing audio for message', messageId)
      // Auto-play the audio immediately
      await playAudio(messageId, response.audio_url)
    } else {
      console.log('Audio generated in background for message', messageId)
    }
    
  } catch (error) {
    console.error('Failed to generate background audio:', error)
    // Clear states on error
    preparingAudio.value[messageId] = false
    pendingAutoPlay.value[messageId] = false
  } finally {
    audioLoadingStates.value[messageId] = false
  }
}

// Word synchronization function
const startWordSynchronization = (messageId: number) => {
  const message = messages.value.find(m => m.id === messageId)
  
  if (!message || !message.audio_word_timestamps || message.audio_word_timestamps.length === 0) {
    console.log('No word timestamps available for message', messageId)
    return
  }
  
  const timestamps = message.audio_word_timestamps
  console.log('Starting word synchronization with', timestamps.length, 'timestamps')
  
  // Initialize visible words to 0 for this message
  visibleWordIndices.value[messageId] = 0
  currentSpeakingWordIndex.value[messageId] = -1
  
  // Start checking audio time every 50ms for smooth text reveal
  audioSyncInterval.value = setInterval(() => {
    if (!playingAudio.value) {
      return
    }
    
    const currentTime = playingAudio.value.currentTime
    
    // Find how many words should be visible based on audio time
    let visibleWordCount = 0
    
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i]
      if (timestamp && currentTime >= timestamp.start) {
        visibleWordCount = i + 1
      } else {
        break
      }
    }
    
    // Update visible word count if it increased
    if (visibleWordCount > (visibleWordIndices.value[messageId] || 0)) {
      visibleWordIndices.value[messageId] = visibleWordCount
    }
    
    // Also track the currently speaking word for highlighting
    let currentWordIndex = -1
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i]
      if (timestamp && currentTime >= timestamp.start && currentTime <= timestamp.end) {
        currentWordIndex = i
        break
      }
    }
    
    if (currentWordIndex !== currentSpeakingWordIndex.value[messageId]) {
      currentSpeakingWordIndex.value[messageId] = currentWordIndex
    }
  }, 50) // Check every 50ms for smooth text reveal
}

const useFollowUpSuggestion = (suggestion: string) => {
  // Set the suggestion as the current message and send it
  currentMessage.value = suggestion
  sendMessage()
}

const loadFeaturedQuestions = async () => {
  try {
    const response = await apiStore.fetchFeaturedQuestions()
    if (response.questions && response.questions.length > 0) {
      quickPrompts.value = response.questions.map((q: any) => q.question)
    } else {
      // Use default prompts as fallback
      quickPrompts.value = [...defaultPrompts]
    }
    console.log(`Loaded ${quickPrompts.value.length} questions from ${response.source || 'unknown source'}`)
  } catch (error) {
    console.error('Failed to load featured questions, using defaults:', error)
    // Use default prompts as fallback
    quickPrompts.value = [...defaultPrompts]
  }
}
</script>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}
</style>