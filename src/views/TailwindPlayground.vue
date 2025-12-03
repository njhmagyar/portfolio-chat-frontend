<template>
  <div class="">
    <Navigation />
    <div class="snap-y snap-mandatory overflow-y-scroll h-screen">
      <section class="snap-start h-[calc(100vh-4rem)] container p-8 mx-auto xl:px-0 flex flex-wrap">
        <div class="flex items-center w-full lg:w-1/2">
          <div class="max-w-2xl mb-8">
            <h1 class="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-text dark:text-white">
              Nathan<br>Haynes-Magyar
            </h1>
            <p class="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Product Designer & Full-Stack Developer
            </p>
            <div class="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a href="" class="px-8 py-4 text-lg font-medium text-center text-white bg-blue-500 rounded-md">
                View Projects
              </a>
              <a href="" class="px-8 py-4 text-lg font-medium text-center text-gray-500 dark:text-gray-400 rounded-md">
                Chat with My Clone
              </a>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center w-full lg:w-1/2">
          <img :src="headshotImage" class="rounded-3xl w-full lg:w-auto mx-auto lg:ml-auto lg:mr-0 object-cover" />
        </div>
      </section>
      <section class="snap-start h-[calc(100vh-4rem)] overflow-y-auto py-8 px-6">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div class="aspect-video object-cover bg-gray-200 dark:bg-gray-600"></div>
              <div class="p-6">
                <h3 class="text-2xl font-bold">Project Title</h3>
                <p class="text-lg text-gray-900 dark:text-gray-200">Project description...</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span class="px-3 py-1 bg-gray-200 dark:bg-gray-500 dark:text-gray-200 rounded-md">Django</span>
                  <span class="px-3 py-1 bg-gray-200 dark:bg-gray-500 dark:text-gray-200 rounded-md">Vue.js</span>
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div class="aspect-video object-cover bg-gray-200 dark:bg-gray-600"></div>
              <div class="p-6">
                <h3 class="text-2xl font-bold">Project Title</h3>
                <p class="text-lg text-gray-900 dark:text-gray-200">Project description...</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span class="px-3 py-1 bg-gray-200 dark:bg-gray-500 dark:text-gray-200 rounded-md">Django</span>
                  <span class="px-3 py-1 bg-gray-200 dark:bg-gray-500 dark:text-gray-200 rounded-md">Vue.js</span>
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div class="aspect-video object-cover bg-gray-200 dark:bg-gray-600"></div>
              <div class="p-6">
                <h3 class="text-2xl font-bold">Project Title</h3>
                <p class="text-lg text-gray-900 dark:text-gray-200">Project description...</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span class="px-3 py-1 bg-gray-200 dark:bg-gray-500 dark:text-gray-200 rounded-md">Django</span>
                  <span class="px-3 py-1 bg-gray-200 dark:bg-gray-500 dark:text-gray-200 rounded-md">Vue.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navigation from "../components/Navigation.vue";
import headshotImage from '@/assets/headshot.jpeg'
</script>