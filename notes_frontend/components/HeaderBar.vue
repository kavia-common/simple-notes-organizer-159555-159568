<template>
  <header class="app-header">
    <button class="btn btn-primary" @click="$emit('newNote')">
      + New Note
    </button>
    <h1 class="header-title">{{ appName }}</h1>
    <div class="header-spacer" />
    <div class="header-search" role="search">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="opacity:.6" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.156a5 5 0 1 1 0-10.001 5 5 0 0 1 0 10.001z"/>
      </svg>
      <input
        :value="search"
        @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        placeholder="Search notes..."
        aria-label="Search notes"
      />
    </div>
    <div class="header-actions">
      <NuxtLink class="button" to="/settings">Settings</NuxtLink>
      <button class="button" @click="$emit('logout')">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  appName: string
  search: string
}>()

defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'logout'): void
  (e: 'newNote'): void
}>()
</script>
