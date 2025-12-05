<template>
  <div class="">
    <Navigation @update-mode="isDark = $event"/>
    <div class="snap-y snap-mandatory overflow-y-scroll h-screen">
      <section class="snap-start lg:h-[calc(100vh-7rem)] lg:flex items-center justify-center lg:relative">
        <!-- Main content - centered -->
        <div class="container mx-auto px-4 lg:px-8 xl:px-0 lg:flex flex-wrap lg:flex-row-reverse lg:h-full lg:max-h-[calc(500px)]">
          <div class="py-16 lg:py-0 flex items-center justify-center w-full lg:w-1/2">
            <img :src="headshotImage" class="rounded-3xl w-full lg:w-auto lg:h-full mx-auto lg:ml-auto lg:mr-0 object-cover" />
          </div>
          <div class="lg:flex lg:flex-col justify-between h-full w-full lg:w-1/2">
            <div>
              <h1 class="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-text dark:text-white">
                Nathan<br>Haynes-Magyar
              </h1>
              <p class="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
                Product Designer & Full-Stack Developer
              </p>
            </div>
            <div class="lg:mt-auto flex flex-col space-y-3 lg:space-x-4 lg:space-y-0 lg:flex-row">
              <a href="" class="w-full lg:w-auto px-8 py-4 text-lg font-medium text-center text-white bg-blue-500 rounded-md">
                View Projects
              </a>
              <a href="" class="w-full lg:w-auto px-8 py-4 text-lg font-medium text-center text-gray-500 dark:text-gray-400 rounded-md">
                Chat with My Clone
              </a>
            </div>
          </div>
        </div>
        <!-- Ticker tape - absolutely positioned at bottom -->
        <ticker-tape :is-dark class="my-8 lg:my-0 lg:absolute top-100 h-[calc(62px)] bottom-0 left-0 right-0"/>
      </section>
      <section class="snap-start h-[calc(100vh)] overflow-y-auto lg:flex items-center justify-center py-8 px-6">
        <div class="container mx-auto px-4 lg:px-8 xl:px-0 lg:flex flex-wrap lg:flex-row-reverse lg:h-full lg:max-h-[calc(500px)]">
          <div class="py-16 lg:py-0 flex items-center justify-center w-full lg:w-1/2">
            <img :src="headshotImage" class="rounded-3xl w-full lg:w-auto lg:h-full mx-auto lg:ml-auto lg:mr-0 object-cover" />
          </div>
          <div class="lg:flex lg:flex-col justify-between h-full w-full lg:w-1/2">
            <div>
              <h1 class="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-text dark:text-white">
                Nathan<br>Haynes-Magyar
              </h1>
              <p class="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
                Product Designer & Full-Stack Developer
              </p>
            </div>
            <div class="lg:mt-auto flex flex-col space-y-3 lg:space-x-4 lg:space-y-0 lg:flex-row">
              <a href="" class="w-full lg:w-auto px-8 py-4 text-lg font-medium text-center text-white bg-blue-500 rounded-md">
                View Projects
              </a>
              <a href="" class="w-full lg:w-auto px-8 py-4 text-lg font-medium text-center text-gray-500 dark:text-gray-400 rounded-md">
                Chat with My Clone
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Navigation from "@/components/Navigation.vue";
import TickerTape from "@/components/TickerTape.vue";
import headshotImage from '@/assets/headshot.jpeg';

const isDark = ref(false);
</script>