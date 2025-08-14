<template>
  <div role="list" aria-label="Notes list">
    <div
      v-for="n in notes"
      :key="n.id"
      class="note-card"
      :class="{ active: n.id === activeNoteId }"
      @click="$emit('select', n.id)"
      role="listitem"
    >
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
        <h3 class="note-title">{{ n.title || 'Untitled' }}</h3>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="button" title="Pin/Unpin" @click.stop="$emit('togglePin', n.id)">{{ n.pinned ? '📌' : '📍' }}</button>
          <button class="button" title="Delete" @click.stop="$emit('delete', n.id)">🗑</button>
        </div>
      </div>
      <p class="note-snippet">{{ snippet(n.content) }}</p>
      <div class="note-meta">
        <span>{{ formatDate(n.updatedAt || n.createdAt) }}</span>
        <span v-if="n.folderId">· Folder</span>
      </div>
      <div class="tags" v-if="n.tags?.length">
        <span class="tag-chip" v-for="t in n.tags" :key="t">#{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '@/types/note'

defineProps<{
  notes: Note[]
  activeNoteId: string | null
}>()

defineEmits<{
  (e: 'select', id: string): void
  (e: 'togglePin', id: string): void
  (e: 'delete', id: string): void
}>()

function snippet(content: string) {
  const text = (content || '').replace(/\s+/g, ' ').trim()
  return text.length > 140 ? text.slice(0, 140) + '…' : text
}
function formatDate(d: string | number | Date) {
  const date = new Date(d)
  return date.toLocaleString()
}
</script>
