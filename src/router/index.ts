import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('../views/BrowseView.vue')
    },
    {
      path: '/case-study/:slug',
      name: 'case-study-detail',
      component: () => import('../views/CaseStudyDetailView.vue'),
      props: true
    },
    {
      path: '/test-page',
      name: 'test-iage',
      component: () => import('../views/TestPage.vue'),
    },
    {
      path: '/tailwind',
      name: 'tailwind',
      component: () => import('../views/TailwindPlayground.vue')
    }
  ]
})

export default router