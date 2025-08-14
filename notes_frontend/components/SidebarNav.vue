<template>
  <div>
    <div class="sidebar-section">
      <p class="section-title">Overview</p>
      <div class="nav-item" :class="{active: activeFolderId === null && !selectedTag && !showingPinned && !showingUntagged}" @click="$emit('showAll')">
        <span>All Notes</span>
        <span class="badge">{{ counts.all }}</span>
      </div>
      <div class="nav-item" :class="{active: showingPinned}" @click="$emit('showPinned')">
        <span>Pinned</span>
        <span class="badge">{{ counts.pinned }}</span>
      </div>
      <div class="nav-item" :class="{active: showingUntagged}" @click="$emit('showUntagged')">
        <span>Untagged</span>
        <span class="badge">{{ counts.untagged }}</span>
      </div>
    </div>

    <div class="sidebar-section">
      <p class="section-title">Folders</p>
      <div class="folders-list">
        <div
          v-for="f in folders"
          :key="f.id"
          class="nav-item"
          :class="{active: activeFolderId === f.id}"
        >
          <div @click="$emit('selectFolder', f.id)" style="display:flex; align-items:center; gap:8px; flex:1;">
            <span>{{ f.name }}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="button" title="Rename" @click="rename(f)">✏️</button>
            <button class="button" title="Delete" @click="$emit('deleteFolder', f.id)">🗑</button>
          </div>
        </div>
      </div>
      <div style="margin-top:10px; display:flex; gap:8px;">
        <input v-model="newFolder" placeholder="New folder name" style="flex:1; padding:8px; border-radius:8px; border:1px solid var(--color-border);" />
        <button class="btn btn-primary" @click="create">Add</button>
      </div>
    </div>

    <div class="sidebar-section">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <p class="section-title" style="margin:0;">Tags</p>
        <button class="button" v-if="selectedTag" @click="$emit('clearTag')">Clear</button>
      </div>
      <div class="tags-list">
        <div
          class="nav-item"
          v-for="t in tags"
          :key="t"
          :class="{active: selectedTag === t}"
          @click="$emit('selectTag', t)"
        >
          <span>#{{ t }}</span>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <button class="button" @click="$emit('clearFilters')">Clear all filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '@/types/folder'

const props = defineProps<{
  folders: Folder[]
  activeFolderId: string | null
  tags: string[]
  selectedTag: string | null
  counts: { all: number; pinned: number; untagged: number }
}>()

const emit = defineEmits<{
  (e: 'showAll'): void
  (e: 'showPinned'): void
  (e: 'showUntagged'): void
  (e: 'selectFolder', id: string): void
  (e: 'createFolder', name: string): void
  (e: 'renameFolder', payload: { id: string; name: string }): void
  (e: 'deleteFolder', id: string): void
  (e: 'selectTag', tag: string): void
  (e: 'clearTag'): void
  (e: 'clearFilters'): void
}>()

const newFolder = ref('')

function create() {
  const name = newFolder.value.trim()
  if (!name) return
  emit('createFolder', name)
  newFolder.value = ''
}

async function rename(f: Folder) {
  const name = window.prompt('Rename folder', f.name)
  if (!name) return
  emit('renameFolder', { id: f.id, name })
}

// These flags can be passed as props in the future; for now, keep UI stable.
const showingPinned = computed(() => false)
const showingUntagged = computed(() => false)
</script>
