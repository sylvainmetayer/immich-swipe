<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useImmich } from '@/composables/useImmich'
import { useUiStore } from '@/stores/ui'
import AppHeader from '@/components/AppHeader.vue'
import SwipeCard from '@/components/SwipeCard.vue'
import ActionButtons from '@/components/ActionButtons.vue'

const { currentAsset, lastDeletedAsset, error, loadInitialAsset, keepPhoto, deletePhoto, undoDelete } = useImmich()
const uiStore = useUiStore()

const canUndo = computed(() => lastDeletedAsset.value !== null)

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (!currentAsset.value) return

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    keepPhoto()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    deletePhoto()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    undoDelete()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    undoDelete()
  }
}

onMounted(() => {
  loadInitialAsset()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="viewport-fit flex flex-col"
    :class="uiStore.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'"
  >
    <AppHeader />

    <!-- Main content -->
    <main class="flex-1 flex flex-col px-4 safe-area-bottom min-h-0 gap-3 overflow-hidden">
      <!-- Error state -->
      <div v-if="error && !currentAsset" class="flex-1 flex flex-col items-center justify-center gap-4">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4"
            :class="uiStore.isDarkMode ? 'text-gray-600' : 'text-gray-400'"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg"
            :class="uiStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ error }}
          </p>
        </div>
        <button
          @click="loadInitialAsset"
          class="px-6 py-2 rounded-lg transition-colors"
          :class="uiStore.isDarkMode
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-black text-white hover:bg-gray-800'"
        >
          Try Again
        </button>
      </div>

      <!-- Swipe area -->
      <div v-else class="flex-1 flex flex-col min-h-0 gap-3">
        <!-- Card container -->
        <div class="flex-1 min-h-0 flex items-center justify-center p-2">
          <div v-if="currentAsset" class="w-full h-full max-w-4xl max-h-full">
            <SwipeCard
              :asset="currentAsset"
              @keep="keepPhoto"
              @delete="deletePhoto"
            />
          </div>

          <!-- Empty state while loading -->
          <div v-else class="flex h-full items-center justify-center"
            :class="uiStore.isDarkMode ? 'text-gray-600' : 'text-gray-400'"
          >
            <svg class="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div class="shrink-0 flex flex-col items-center gap-2">
          <!-- Action buttons -->
          <ActionButtons
            v-if="currentAsset"
            :can-undo="canUndo"
            @keep="keepPhoto"
            @delete="deletePhoto"
            @undo="undoDelete"
          />

          <!-- Instructions -->
          <div class="text-center text-sm py-2 flex items-center flex-col gap-y-2"
            :class="uiStore.isDarkMode ? 'text-gray-500' : 'text-gray-400'"
          >
            <!-- Mobile -->
            <div class="sm:hidden flex gap-x-2">
              <span class="px-3 py-1 rounded-full text-xs font-medium border transition-colors border-green-700 text-green-600 bg-green-300">
                RIGHT 
                
              </span>
              <div
                class="w-px h-6"
                :class="uiStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-300'"
              ></div>
              <span class="px-3 py-1 rounded-full text-xs font-medium border transition-colors border-red-700 text-red-600 bg-red-300">
                LEFT
              </span>
            </div>
            <!-- Desktop -->
            <div class="hidden sm:flex gap-x-3">
              <span class="flex gap-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors border-red-700 text-red-600 bg-red-300">
                LEFT
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </span>
              <div
                class="w-px h-6"
                :class="uiStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-300'"
              ></div>
              <span class="flex gap-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors border-green-700 bg-green-300 text-green-600">
                RIGHT 
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </span>
            </div>
            <p class="hidden sm:flex">
              (←/→) • Ctrl+Z or ↑ (undo)
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
