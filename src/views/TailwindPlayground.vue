<template>
  <div class="">
    <Navigation @update-mode="isDark = $event"/>
    <div class="snap-y snap-mandatory overflow-y-scroll h-screen">
      <section 
        class="snap-start lg:h-[calc(100vh-7rem)] lg:flex items-center justify-center lg:relative"
        @mousemove="updateMousePosition"
        @mouseleave="clearMousePosition"
        ref="heroSection"
      >
        <!-- Programmatic dots -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            v-for="(dot, index) in dots" 
            :key="index"
            class="absolute w-1 h-1 rounded-full transition-all duration-200 ease-out"
            :style="{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              backgroundColor: dot.isNearCursor ? (isDark ? '#60a5fa' : '#3b82f6') : (isDark ? 'rgba(75, 85, 99, 0.6)' : 'rgba(156, 163, 175, 0.4)'),
              transform: `scale(${dot.scale}) translate(${dot.offsetX}px, ${dot.offsetY}px)`
            }"
          ></div>
        </div>
        <!-- Main content - centered -->
        <div class="container mx-auto px-4 lg:px-8 xl:px-0 lg:flex flex-wrap lg:flex-row-reverse lg:h-full lg:max-h-[calc(500px)] relative z-10">
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
import { ref, onMounted } from "vue";

import Navigation from "@/components/Navigation.vue";
import TickerTape from "@/components/TickerTape.vue";
import headshotImage from '@/assets/headshot.jpeg';

const isDark = ref(false);
const heroSection = ref<HTMLElement | null>(null);
const mouseX = ref(-1000); // Start off-screen
const mouseY = ref(-1000);
const dots = ref<Array<{
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  isNearCursor: boolean;
}>>([]);

const initializeDots = () => {
  if (!heroSection.value) return;
  
  const rect = heroSection.value.getBoundingClientRect();
  const spacing = 24;
  const newDots = [];
  
  for (let x = 0; x < rect.width; x += spacing) {
    for (let y = 0; y < rect.height; y += spacing) {
      newDots.push({
        x,
        y,
        originalX: x,
        originalY: y,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isNearCursor: false
      });
    }
  }
  
  dots.value = newDots;
};

const updateMousePosition = (event: MouseEvent) => {
  if (!heroSection.value) return;
  
  const rect = heroSection.value.getBoundingClientRect();
  mouseX.value = event.clientX - rect.left;
  mouseY.value = event.clientY - rect.top;
  
  updateDots();
};

const updateDots = () => {
  const cursorRadius = 100;
  
  dots.value.forEach(dot => {
    const dx = mouseX.value - dot.originalX;
    const dy = mouseY.value - dot.originalY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < cursorRadius) {
      // Dot is within cursor radius
      const influence = 1 - (distance / cursorRadius); // 1 at center, 0 at edge
      dot.scale = 1 + influence * 1.5; // Scale up to 2.5x
      dot.isNearCursor = true;
      
      // Move dot slightly towards cursor (but only if distance > 5px to avoid jittery movement)
      if (distance > 5) {
        const moveAmount = influence * 3; // Reduced from 8 to 3
        dot.offsetX = (dx / distance) * moveAmount;
        dot.offsetY = (dy / distance) * moveAmount;
      } else {
        // If cursor is very close to the dot, don't move it to avoid jitter
        dot.offsetX = 0;
        dot.offsetY = 0;
      }
    } else {
      // Dot is outside cursor radius
      dot.scale = 1;
      dot.offsetX = 0;
      dot.offsetY = 0;
      dot.isNearCursor = false;
    }
  });
};

const clearMousePosition = () => {
  mouseX.value = -1000;
  mouseY.value = -1000;
  
  // Reset all dots
  dots.value.forEach(dot => {
    dot.scale = 1;
    dot.offsetX = 0;
    dot.offsetY = 0;
    dot.isNearCursor = false;
  });
};

onMounted(() => {
  setTimeout(() => {
    initializeDots();
  }, 100); // Small delay to ensure section is rendered
});
</script>

<style scoped>
/* No additional styles needed - dots are fully programmatic */
</style>