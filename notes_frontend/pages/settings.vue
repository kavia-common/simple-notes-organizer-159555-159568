<template>
  <div style="padding:16px;">
    <h2>Settings</h2>
    <p style="color:var(--color-text-muted)">Manage your data for this device.</p>
    <div style="display:flex; gap:8px;">
      <button class="button" @click="exportData">Export Data</button>
      <button class="button" @click="importData">Import Data</button>
      <button class="button" @click="clearAll">Clear All (logout)</button>
    </div>
    <pre style="margin-top:16px; background:var(--color-surface); padding:12px; border-radius:8px; border:1px solid var(--color-border); white-space: pre-wrap;">App: {{ config.public.appName }}
Site: {{ config.public.siteUrl }}
Storage Prefix: {{ config.public.storagePrefix }}</pre>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuth()
const { getItem, setItem, removeItem } = useStorage()

function exportData() {
  const dump = {
    user: getItem('user', null),
    session: getItem('session', null),
    notes: getItem('notes', []),
    folders: getItem('folders', []),
  }
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'notes-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

async function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      if (data.user) setItem('user', data.user)
      if (data.session) setItem('session', data.session)
      if (data.notes) setItem('notes', data.notes)
      if (data.folders) setItem('folders', data.folders)
      alert('Data imported. Reloading...')
      location.reload()
    } catch {
      alert('Invalid file')
    }
  }
  input.click()
}

function clearAll() {
  if (!confirm('Clear all data for this app on this device?')) return
  removeItem('user')
  removeItem('session')
  removeItem('notes')
  removeItem('folders')
  auth.logout()
  navigateTo('/login')
}
</script>
