<template>
  <svg 
    :class="class"
    :width="width" 
    :height="height" 
    viewBox="0 0 32 32" 
    xmlns="http://www.w3.org/2000/svg"
    :fill="fill"
  >
    <path 
      d="M24.306 4.019h-4.806l-3.5 5.537-3-5.537h-11l14 23.981 14-23.981zM5.481 6.019h3.363l7.156 12.387 7.15-12.387h3.363l-10.512 18.012z"
    />
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