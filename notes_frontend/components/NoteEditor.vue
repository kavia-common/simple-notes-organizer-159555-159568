<template>
  <div class="editor">
    <div class="inline-actions" style="justify-content: space-between;">
      <div class="inline-actions">
        <button class="button" @click="$emit('moveToFolder', { id: note.id, folderId: null })">Move: None</button>
        <select v-model="folderId" @change="onMove">
          <option :value="null">No folder</option>
          <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
        <button class="button" @click="togglePin">{{ note.pinned ? 'Unpin' : 'Pin' }}</button>
      </div>
      <div class="inline-actions">
        <button class="button" @click="deleteNote">Delete</button>
        <button class="btn btn-primary" @click="save">Save</button>
      </div>
    </div>

    <input class="title-input" v-model="local.title" placeholder="Note title" />
    <textarea class="content-input" v-model="local.content" placeholder="Write your note here..." />

    <div>
      <label style="font-weight:600;">Tags</label>
      <div class="inline-actions">
        <input
          v-model="tagInput"
          placeholder="Add tags, comma separated"
          @keydown.enter.prevent="applyTags"
        />
        <button class="button" @click="applyTags">Update tags</button>
      </div>
      <div class="tags" style="margin-top:8px;">
        <span class="tag-chip" v-for="t in local.tags" :key="t">#{{ t }}</span>
      </div>
    </div>
    <hr class="divider" />
    <div style="color:var(--color-text-muted); font-size:12px;">
      Created: {{ new Date(note.createdAt).toLocaleString() }}
      · Updated: {{ new Date(note.updatedAt || note.createdAt).toLocaleString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '@/types/note'
import type { Folder } from '@/types/folder'

const props = defineProps<{
  note: Note
  folders: Folder[]
}>()

const emit = defineEmits<{
  (e: 'save', payload: Note): void
  (e: 'updateTags', payload: { id: string; tags: string[] }): void
  (e: 'moveToFolder', payload: { id: string; folderId: string | null }): void
  (e: 'delete', id: string): void
}>()

const local = reactive<Pick<Note, 'id'|'title'|'content'|'tags'|'pinned'>>({
  id: props.note.id,
  title: props.note.title,
  content: props.note.content,
  tags: [...(props.note.tags || [])],
  pinned: !!props.note.pinned
})

watch(() => props.note, (n) => {
  local.id = n.id
  local.title = n.title
  local.content = n.content
  local.tags = [...(n.tags || [])]
  local.pinned = !!n.pinned
})

const folderId = ref<string | null>(props.note.folderId || null)
watch(() => props.note.folderId, (v) => { folderId.value = v || null })

function applyTags() {
  const tags = tagInput.value.split(',').map(t => t.trim()).filter(Boolean)
  emit('updateTags', { id: props.note.id, tags })
}
function save() {
  const payload: Note = {
    ...props.note,
    title: local.title.trim(),
    content: local.content,
    tags: local.tags,
    pinned: local.pinned,
    updatedAt: new Date().toISOString()
  }
  emit('save', payload)
}
function onMove() {
  emit('moveToFolder', { id: props.note.id, folderId: folderId.value })
}
function togglePin() {
  local.pinned = !local.pinned
  save()
}
function deleteNote() {
  if (confirm('Delete this note?')) {
    emit('delete', props.note.id)
  }
}
const tagInput = ref((props.note.tags || []).join(', '))
</script>
