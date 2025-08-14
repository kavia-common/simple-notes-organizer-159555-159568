<template>
  <div class="app-shell">
    <HeaderBar
      :app-name="config.public.appName"
      :search="notes.filters.search"
      @update:search="onSearch"
      @logout="onLogout"
      @newNote="notes.createNote"
    />
    <main class="app-main">
      <aside class="sidebar">
        <SidebarNav
          :folders="notes.folders.value"
          :activeFolderId="notes.filters.folderId"
          :tags="notes.uniqueTags.value"
          :selectedTag="notes.filters.tag"
          :counts="notes.counts.value"
          @selectFolder="notes.setFolderFilter"
          @selectTag="notes.setTagFilter"
          @clearTag="notes.clearTagFilter"
          @createFolder="notes.addFolder"
          @renameFolder="notes.renameFolder"
          @deleteFolder="notes.deleteFolder"
          @showAll="notes.clearFolderFilter"
          @showPinned="() => notes.setPinnedFilter(true)"
          @showUntagged="notes.showUntagged"
          @clearFilters="notes.clearAllFilters"
        />
      </aside>
      <section class="content-area">
        <div class="list-pane">
          <NoteList
            :notes="notes.filteredNotes.value"
            :activeNoteId="notes.activeNoteId.value"
            @select="notes.setActiveNote"
            @togglePin="notes.togglePinned"
            @delete="notes.deleteNote"
          />
        </div>
        <div class="editor-pane">
          <NoteEditor
            v-if="notes.activeNote.value"
            :note="notes.activeNote.value"
            :folders="notes.folders.value"
            @save="notes.updateNote"
            @updateTags="notes.setTags"
            @moveToFolder="notes.moveToFolder"
            @delete="notes.deleteNote"
          />
          <div v-else class="editor" style="opacity:.8">
            <h2>Welcome</h2>
            <p>Select a note from the list or create a new one to get started.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuth()
const notes = useNotes()

onMounted(() => {
  // Initialize notes from storage once authenticated
  if (auth.isAuthenticated.value) {
    notes.init()
  }
})

watch(() => auth.isAuthenticated.value, (val) => {
  if (val) notes.init()
})

function onLogout() {
  auth.logout()
  navigateTo('/login')
}
function onSearch(q: string) {
  notes.setSearch(q)
}
</script>
