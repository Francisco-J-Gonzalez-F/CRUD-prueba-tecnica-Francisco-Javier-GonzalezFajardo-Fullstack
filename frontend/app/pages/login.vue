<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
    <div class="card shadow-sm border-0" style="max-width: 420px; width: 100%;">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <div
            class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10"
            style="width: 56px; height: 56px;"
          >
            <span class="text-primary fs-4">🔒</span>
          </div>

          <h1 class="h4 mt-3 mb-1">Iniciar sesión</h1>
          <p class="text-muted mb-0">Accede para administrar tus gastos</p>
        </div>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              v-model.trim="state.email"
              type="email"
              class="form-control"
              placeholder="correo@dominio.com"
              autocomplete="email"
              :disabled="loading"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
              v-model="state.password"
              type="password"
              class="form-control"
              placeholder="••••••••"
              autocomplete="current-password"
              :disabled="loading"
              required
            />
          </div>

          <div v-if="error" class="alert alert-warning py-2 small" role="alert">
            <strong>Error:</strong> {{ error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="loading || !canSubmit"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Entrar
          </button>

          <div class="text-center mt-3">
            <small class="text-muted">¿Problemas para entrar? Verifica tus credenciales.</small>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { login, loading } = useAuth();

const state = reactive({ email: '', password: '' });
const error = ref<string | null>(null);

const canSubmit = computed(() => state.email.trim().length > 0 && state.password.trim().length > 0);

const onSubmit = async () => {
  error.value = null;
  try {
    await login(state.email, state.password);
    await navigateTo('/'); 
  } catch (e: any) {
    const msg = e?.data?.message;
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Credenciales inválidas');
  }
};
</script>
