import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import BrowseView from '../views/BrowseView.vue'
import CaseStudyDetailView from '../views/CaseStudyDetailView.vue'
import TestPage from '../views/TestPage.vue'
import TailwindPlayground from '../views/TailwindPlayground.vue'

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
      component: BrowseView
    },
    {
      path: '/case-study/:slug',
      name: 'case-study-detail',
      component: CaseStudyDetailView,
      props: true
    },
    {
      path: '/test-page',
      name: 'test-page',
      component: TestPage,
    },
    {
      path: '/tailwind',
      name: 'tailwind',
      component: TailwindPlayground
    }
  ]
})

export default router