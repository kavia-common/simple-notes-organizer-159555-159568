import type { Note } from '@/types/note'
import type { Folder } from '@/types/folder'

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Notes state and actions, persisted in localStorage.
   * Provides CRUD, folders, tags and filter utilities.
   */
  const { getItem, setItem, ensureId } = useStorage()

  // State
  const notes = useState<Note[]>('notes', () => [])
  const folders = useState<Folder[]>('folders', () => [])
  const activeNoteId = useState<string | null>('activeNoteId', () => null)

  const filters = reactive<{ search: string; folderId: string | null; tag: string | null; pinned: boolean | null; untagged: boolean }>(
    { search: '', folderId: null, tag: null, pinned: null, untagged: false }
  )

  // PUBLIC_INTERFACE
  function init() {
    notes.value = getItem<Note[]>('notes', [])
    folders.value = getItem<Folder[]>('folders', [])
    if (notes.value.length && !activeNoteId.value) activeNoteId.value = notes.value[0].id
  }

  // Persistence
  watch(notes, (val) => setItem('notes', val), { deep: true })
  watch(folders, (val) => setItem('folders', val), { deep: true })

  // Derived
  const activeNote = computed(() => notes.value.find(n => n.id === activeNoteId.value) || null)

  const uniqueTags = computed(() => {
    const set = new Set<string>()
    for (const n of notes.value) (n.tags || []).forEach(t => set.add(t))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  const counts = computed(() => {
    const all = notes.value.length
    const pinned = notes.value.filter(n => n.pinned).length
    const untagged = notes.value.filter(n => !n.tags || n.tags.length === 0).length
    return { all, pinned, untagged }
  })

  const filteredNotes = computed<Note[]>(() => {
    let arr = [...notes.value]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      arr = arr.filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q) ||
        (n.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    if (filters.folderId) {
      arr = arr.filter(n => n.folderId === filters.folderId)
    }
    if (filters.tag) {
      arr = arr.filter(n => (n.tags || []).includes(filters.tag!))
    }
    if (filters.pinned !== null) {
      arr = arr.filter(n => !!n.pinned === filters.pinned)
    }
    if (filters.untagged) {
      arr = arr.filter(n => !n.tags || n.tags.length === 0)
    }
    // sort: pinned first, then updated desc
    arr.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    })
    return arr
  })

  // CRUD
  // PUBLIC_INTERFACE
  function createNote() {
    const now = new Date().toISOString()
    const id = ensureId()
    const n: Note = { id, title: 'New Note', content: '', createdAt: now, updatedAt: now, tags: [], folderId: null, pinned: false }
    notes.value.unshift(n)
    activeNoteId.value = id
  }

  // PUBLIC_INTERFACE
  function updateNote(payload: Note) {
    const idx = notes.value.findIndex(n => n.id === payload.id)
    if (idx !== -1) {
      notes.value[idx] = { ...notes.value[idx], ...payload, updatedAt: new Date().toISOString() }
    }
  }

  // PUBLIC_INTERFACE
  function deleteNote(id: string) {
    const i = notes.value.findIndex(n => n.id === id)
    if (i !== -1) {
      notes.value.splice(i, 1)
      if (activeNoteId.value === id) activeNoteId.value = notes.value[0]?.id || null
    }
  }

  // PUBLIC_INTERFACE
  function setActiveNote(id: string) {
    activeNoteId.value = id
  }

  // Folders
  // PUBLIC_INTERFACE
  function addFolder(name: string) {
    const id = ensureId()
    folders.value.push({ id, name })
  }

  // PUBLIC_INTERFACE
  function renameFolder(payload: { id: string; name: string }) {
    const f = folders.value.find(f => f.id === payload.id)
    if (f) f.name = payload.name
  }

  // PUBLIC_INTERFACE
  function deleteFolder(id: string) {
    const idx = folders.value.findIndex(f => f.id === id)
    if (idx !== -1) folders.value.splice(idx, 1)
    // remove folder assignment from notes
    notes.value = notes.value.map(n => (n.folderId === id ? { ...n, folderId: null } : n))
    if (filters.folderId === id) filters.folderId = null
  }

  // PUBLIC_INTERFACE
  function moveToFolder(payload: { id: string; folderId: string | null }) {
    const n = notes.value.find(n => n.id === payload.id)
    if (n) {
      n.folderId = payload.folderId || null
      n.updatedAt = new Date().toISOString()
    }
  }

  // Tags
  // PUBLIC_INTERFACE
  function setTags(payload: { id: string; tags: string[] }) {
    const n = notes.value.find(n => n.id === payload.id)
    if (n) {
      const tags = Array.from(new Set(payload.tags.map(t => t.trim()).filter(Boolean)))
      n.tags = tags
      n.updatedAt = new Date().toISOString()
    }
  }

  // PUBLIC_INTERFACE
  function togglePinned(id: string) {
    const n = notes.value.find(n => n.id === id)
    if (n) {
      n.pinned = !n.pinned
      n.updatedAt = new Date().toISOString()
    }
  }

  // Filters
  // PUBLIC_INTERFACE
  function setSearch(q: string) { filters.search = q }
  // PUBLIC_INTERFACE
  function setFolderFilter(id: string | null) { filters.folderId = id }
  // PUBLIC_INTERFACE
  function clearFolderFilter() { filters.folderId = null }
  // PUBLIC_INTERFACE
  function setTagFilter(tag: string | null) { filters.tag = tag }
  // PUBLIC_INTERFACE
  function clearTagFilter() { filters.tag = null }
  // PUBLIC_INTERFACE
  function setPinnedFilter(val: boolean | null) { filters.pinned = val }
  // PUBLIC_INTERFACE
  function showUntagged() { filters.untagged = true }
  // PUBLIC_INTERFACE
  function clearAllFilters() { filters.search = ''; filters.folderId = null; filters.tag = null; filters.pinned = null; filters.untagged = false }

  return {
    // state
    notes, folders, activeNoteId, activeNote,
    // filters and derived
    filters, filteredNotes, uniqueTags, counts,
    // lifecycle
    init,
    // crud
    createNote, updateNote, deleteNote, setActiveNote,
    // folders
    addFolder, renameFolder, deleteFolder, moveToFolder,
    // tags & pin
    setTags, togglePinned,
    // filters api
    setSearch, setFolderFilter, clearFolderFilter, setTagFilter, clearTagFilter,
    setPinnedFilter, showUntagged, clearAllFilters
  }
}
