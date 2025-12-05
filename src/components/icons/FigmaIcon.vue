<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :class="class"
    :width="width" 
    :height="height" 
    viewBox="0 0 370 555" 
    fill="none">
    <rect width="367" height="185" :fill="fill" rx="92.5"/>
    <path :fill="fill" d="M0 277.5C0 226.414 41.414 185 92.5 185H185v185H92.5C41.414 370 0 328.586 0 277.5ZM0 462.5C0 411.414 41.414 370 92.5 370H185v92.5c0 51.086-41.414 92.5-92.5 92.5S0 513.586 0 462.5Z"/>
    <circle cx="276.5" cy="277.5" r="92.5" :fill="fill" />
  </svg>
</template>

<script setup>
defineProps({
  width: {
    type: [String, Number],
    default: '24'
  },
  height: {
    type: [String, Number], 
    default: '24'
  },
  fill: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: ''
  }
})
</script>