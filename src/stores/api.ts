import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-chat-backend-45247c01c107.herokuapp.com'

export const useApiStore = defineStore('api', {
  state: () => ({
    loading: false,
    error: null as string | null,
    sessionId: null as string | null,
  }),

  actions: {
    async fetchHello() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/hello/`)
        return response.data
      } catch (error) {
        this.error = 'Failed to connect to API'
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendChatQuery(query: string) {
      this.loading = true
      this.error = null
      
      try {
        const requestData: { query: string; session_id?: string } = { query }
        
        // Include session ID if we have one
        if (this.sessionId) {
          requestData.session_id = this.sessionId
        }
        
        const response = await axios.post(`${API_BASE_URL}/api/chat/`, requestData)
        
        // Store session ID from response for future requests
        if (response.data.session_id) {
          this.sessionId = response.data.session_id
        }
        
        return response.data
      } catch (error) {
        this.error = 'Failed to send chat message'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProjects() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/projects/`)
        return response.data
      } catch (error) {
        this.error = 'Failed to fetch projects'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchConversationHistory(sessionId: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/conversation/${sessionId}/`)
        return response.data
      } catch (error) {
        this.error = 'Failed to fetch conversation history'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearSession() {
      this.sessionId = null
    }
  }
})