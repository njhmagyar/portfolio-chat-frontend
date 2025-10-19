import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-chat-backend-45247c01c107.herokuapp.com'

export const useApiStore = defineStore('api', {
  state: () => ({
    loading: false,
    error: null as string | null,
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
    }
  }
})