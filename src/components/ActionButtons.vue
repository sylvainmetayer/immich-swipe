<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

defineProps<{
  canUndo: boolean
}>()

const emit = defineEmits<{
  keep: []
  delete: []
  undo: []
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-4 py-4">
    <!-- Delete (desktop) -->
    <button
      @click="emit('delete')"
      class="hidden sm:flex w-16 h-16 rounded-full items-center justify-center transition-all active:scale-90 shadow-lg"
      :class="[
        uiStore.isDarkMode
          ? 'bg-gray-800 hover:bg-red-600 text-white'
          : 'bg-white hover:bg-red-500 hover:text-white text-red-500 border border-red-200'
      ]"
      aria-label="Delete photo"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Keep (desktop) -->
    <button
      @click="emit('keep')"
      class="hidden sm:flex w-16 h-16 rounded-full items-center justify-center transition-all active:scale-90 shadow-lg"
      :class="[
        uiStore.isDarkMode
          ? 'bg-gray-800 hover:bg-green-600 text-white'
          : 'bg-white hover:bg-green-500 hover:text-white text-green-500 border border-green-200'
      ]"
      aria-label="Keep photo"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <!-- Separator (desktop) -->
    <div
      class="hidden sm:block w-px h-12"
      :class="uiStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-300'"
    ></div>

    <!-- Undo -->
    <button
      @click="emit('undo')"
      :disabled="!canUndo"
      class="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
      :class="[
        uiStore.isDarkMode
          ? 'bg-gray-800 hover:bg-yellow-600 text-white disabled:hover:bg-gray-800'
          : 'bg-white hover:bg-yellow-500 hover:text-white text-yellow-600 border border-yellow-200 disabled:hover:bg-white disabled:hover:text-yellow-600'
      ]"
      aria-label="Undo last deletion"
      :title="canUndo ? 'Undo last deletion' : 'Nothing to undo'"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2M3 10l6 6M3 10l6-6" />
      </svg>
    </button>
  </div>
</template>
