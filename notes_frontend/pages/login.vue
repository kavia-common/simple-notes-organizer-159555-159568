<template>
  <div style="min-height:100dvh; display:grid; place-items:center; padding:24px;">
    <div style="width:min(520px, 100%); background:var(--color-bg); border:1px solid var(--color-border); border-radius: var(--radius); box-shadow: var(--shadow-md); padding:24px;">
      <h1 style="margin-top:0;">{{ config.public.appName }}</h1>
      <p style="margin-top:0; color:var(--color-text-muted)">Sign in or create an account to continue.</p>

      <div style="display:grid; gap:12px;">
        <label>
          Email
          <input v-model="email" type="email" placeholder="you@example.com" required
                 style="width:100%; padding:10px; border:1px solid var(--color-border); border-radius:8px;" />
        </label>
        <label>
          Password
          <input v-model="password" type="password" placeholder="••••••••" required
                 style="width:100%; padding:10px; border:1px solid var(--color-border); border-radius:8px;" />
        </label>
      </div>

      <div style="display:flex; gap:8px; margin-top:16px;">
        <button class="btn btn-primary" @click="submit">{{ mode === 'login' ? 'Sign In' : 'Register' }}</button>
        <button class="button" @click="toggle">
          {{ mode === 'login' ? 'Create account' : 'Have an account? Sign in' }}
        </button>
      </div>

      <p v-if="error" style="color:#c62828; font-weight:600;">{{ error }}</p>

      <p style="font-size:12px; color:var(--color-text-muted); margin-top:16px;">
        This demo uses local storage for authentication data. Do not use real credentials.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const config = useRuntimeConfig()

const email = ref('')
const password = ref('')
const error = ref('')
const mode = ref<'login'|'register'>('login')

function toggle() {
  error.value = ''
  mode.value = mode.value === 'login' ? 'register' : 'login'
}

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }
  const action = mode.value === 'login' ? auth.login : auth.register
  const res = await action(email.value.trim(), password.value)
  if (!res.ok) {
    error.value = res.error || 'Something went wrong'
    return
  }
  navigateTo('/')
}
</script>
