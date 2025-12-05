<template>
  <header class="w-full">
    <nav class="container relative flex flex-wrap items-center justify-between p-4 lg:p-8 mx-auto xl:px-1">
      <a href="/" aria-label="Nathan Haynes-Magyar - Home">
        <span class="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          NHM
        </span>
      </a>
      <div class="gap-3 mr-2 lg:flex ml-auto lg:ml-0 lg:order-2">
        <div class="flex items-center order-last">
          <button @click="toggleTheme" class="text-gray-500 rounded-full outline-none focus:outline-none focus-visible:ring focus-visible:ring-gray-100 focus:ring-opacity-20">
            <span class="sr-only">{{ isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode' }}</span>
            <svg v-if="isLightMode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
          </button>
        </div>
        <div class="mr-3 lg:flex">
          <a href="mailto:njhmagyar@gmail.com" class="hidden lg:block px-6 py-2 text-white bg-gray-900 dark:bg-gray-700 rounded-md md:ml-5">Contact</a>
        </div>
      </div>
      <button @click="toggleMobileMenu" aria-label="Toggle Menu" type="button" class="px-2 py-1 text-gray-500 rounded-md lg:hidden hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 focus:outline-none dark:text-gray-300 dark:focus:bg-gray-700">
        <svg class="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path></svg>
      </button>
      <div class="w-full lg:flex lg:items-center lg:w-auto" :class="{ 'hidden': !isMobileMenuOpen }">
        <ul class="items-center justify-end flex-1 pt-6 list-none lg:pt-1 lg:flex flex-col lg:flex-row">
          <li class="mr-3">
            <a href="#" class="inline-block px-4 py-2 text-lg font-normal text-gray-800 dark:text-gray-200 no-underline rounded-md hover:text-blue-500 dark:hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 focus:outline-none dark:focus:bg-gray-800">
              Projects
            </a>
          </li>
          <li class="mr-3">
            <a href="#" class="inline-block px-4 py-2 text-lg font-normal text-gray-800 dark:text-gray-200 no-underline rounded-md hover:text-blue-500 dark:hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 focus:outline-none dark:focus:bg-gray-800">
              Resume
            </a>
          </li>
          <li class="mr-3">
            <a href="#" class="inline-block px-4 py-2 text-lg font-normal text-gray-800 dark:text-gray-200 no-underline rounded-md hover:text-blue-500 dark:hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 focus:outline-none dark:focus:bg-gray-800">
              About
            </a>
          </li>
          <li class="mr-3">
            <RouterLink to="/tailwind" class="inline-block px-4 py-2 text-lg font-normal text-gray-800 dark:text-gray-200 no-underline rounded-md hover:text-blue-500 dark:hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 focus:outline-none dark:focus:bg-gray-800">
              Tailwind
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: "Navigation",
  components: {
    RouterLink
  },
  emits: ['update-mode'],
  data() {
    return {
      mode: "light",
      isMobileMenuOpen: false
    }
  },
  computed: {
    isLightMode() {
      return this.mode === "light";
    }
  },
  methods: {
    toggleTheme() {
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");

      localStorage.theme = isDark ? "dark" : "light";
      document.documentElement.style = isDark ? "color-scheme: dark;" : "";
      this.mode = isDark ? "dark" : "light";

      this.$emit('update-mode', isDark);
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  },
  mounted() {
    const savedTheme = localStorage.theme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      document.documentElement.style = "color-scheme: dark;";
      this.mode = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style = "";
      this.mode = "light";
    }
  },
}
</script>