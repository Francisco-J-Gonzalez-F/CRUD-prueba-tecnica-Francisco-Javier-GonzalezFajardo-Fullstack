<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useExpenses } from "~/composables/useExpenses";
import type { Expense, ExpenseInput, ExpenseCategory } from "~/types/expense";
import { useExportExpenses } from "@/composables/useExportExpenses";
import { useAuth } from "~/composables/useAuth";
declare global {
  interface Window {
    bootstrap: any;
  }
}
const { user, logout } = useAuth();
const { list, create, update, remove } = useExpenses();

// --- catálogo de categorías (para select) ---
const categories: ExpenseCategory[] = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

// --- Toast state ---
const toastMessage = ref("");
const successToast = ref<HTMLElement | null>(null);
const errorToast = ref<HTMLElement | null>(null);

const getBootstrap = () =>
  typeof window !== "undefined" ? window.bootstrap : null;

function showSuccess(message: string) {
  toastMessage.value = message;
  const bs = getBootstrap();
  if (successToast.value && bs?.Toast) {
    const toast = bs.Toast.getOrCreateInstance(successToast.value, {
      delay: 2500,
    });
    toast.show();
  }
}

function showError(message: string) {
  toastMessage.value = message;
  const bs = getBootstrap();
  if (errorToast.value && bs?.Toast) {
    const toast = bs.Toast.getOrCreateInstance(errorToast.value, {
      delay: 3500,
    });
    toast.show();
  }
}
// composable de exportación
const { download } = useExportExpenses();

// filtros (ajústalos a los que ya tengas)
const searchText = ref("");
const selectedCategory = ref("");

// parámetros que se enviarán al backend
const exportParams = computed(() => {
  const params: { query?: string; category?: string } = {};

  if (searchText.value.trim()) {
    params.query = searchText.value;
  }

  if (selectedCategory.value) {
    params.category = selectedCategory.value;
  }

  return params;
});
// --- Estado de listado + paginación ---
const rows = ref<Expense[]>([]);
const totalPages = ref(1);
const page = ref(1);
const limit = ref(10);

const query = ref("");
const category = ref(""); // filtro (string vacío = sin filtro)

// --- UI state ---
const loading = ref(false);
const saving = ref(false);

const errorMsg = ref("");
const successMsg = ref("");

// --- Modal state ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const todayISO = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const form = ref<ExpenseInput>({
  description: "",
  amount: 0,
  date: todayISO(),
  category: "Food",
});

const canPrev = computed(() => page.value > 1);
const canNext = computed(() => page.value < totalPages.value);

const fetchData = async () => {
  errorMsg.value = "";
  try {
    loading.value = true;

    const res = await list({
      page: page.value,
      limit: limit.value,
      query: query.value,
      category: category.value,
    });
    rows.value = res.data.map((e: any) => ({ ...e, amount: Number(e.amount) }));
    totalPages.value = res.totalPages;

    const listData: Expense[] = Array.isArray(res)
      ? (res as Expense[])
      : (res as any).data ?? [];

    rows.value = listData.map((e) => ({
      ...e,
      amount: Number((e as any).amount),
    }));

    if (page.value > totalPages.value) page.value = totalPages.value || 1;
  } catch {
    errorMsg.value = "No se pudo cargar la lista de gastos.";
    showError("No se pudo cargar la lista de gastos.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

// filtros → reinicia página y recarga
watch([query, category, limit], () => {
  page.value = 1;
  fetchData();
});

// página → recarga
watch(page, () => fetchData());


const openCreate = () => {
  successMsg.value = "";
  errorMsg.value = "";
  isEditing.value = false;
  editingId.value = null;

  form.value = {
    description: "",
    amount: 0,
    date: todayISO(),
    category: "Food",
  };

  isModalOpen.value = true;
};

const openEdit = (e: Expense) => {
  successMsg.value = "";
  errorMsg.value = "";
  isEditing.value = true;
  editingId.value = e.id;

  form.value = {
    description: e.description,
    amount: Number(e.amount),
    date: (e.date || "").slice(0, 10),
    category: e.category,
  };

  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const validateForm = () => {
  if (!form.value.description.trim()) return "La descripción es obligatoria.";
  if (!form.value.amount || form.value.amount <= 0)
    return "El monto debe ser mayor a 0.";
  if (!form.value.date) return "La fecha es obligatoria.";
  if (!form.value.category) return "La categoría es obligatoria.";
  return "";
};

const save = async () => {
  errorMsg.value = "";
  successMsg.value = "";

  const v = validateForm();
  if (v) {
    errorMsg.value = v;
    showError(v);
    return;
  }

  try {
    saving.value = true;

    if (isEditing.value && editingId.value != null) {
      await update(editingId.value, form.value);
      successMsg.value = "Gasto actualizado correctamente.";
      showSuccess("Gasto actualizado correctamente.");
    } else {
      await create(form.value);
      successMsg.value = "Gasto creado correctamente.";
      showSuccess("Gasto creado correctamente.");
    }

    closeModal();
    await fetchData();
  } catch {
    errorMsg.value = "Ocurrió un error al guardar.";
    showError("Ocurrió un error al guardar.");
  } finally {
    saving.value = false;
  }
};

const onDelete = async (id: number) => {
  successMsg.value = "";
  errorMsg.value = "";

  const ok = confirm("¿Seguro que deseas eliminar este gasto?");
  if (!ok) return;

  try {
    await remove(id);
    successMsg.value = "Gasto eliminado correctamente.";
    showSuccess("Gasto eliminado correctamente.");
    await fetchData();
  } catch {
    errorMsg.value = "No se pudo eliminar el gasto.";
    showError("No se pudo eliminar el gasto.");
  }
};

const goPrev = () => {
  if (canPrev.value) page.value--;
};
const goNext = () => {
  if (canNext.value) page.value++;
};

const goTo = (p: number) => {
  if (p >= 1 && p <= totalPages.value) page.value = p;
};

const pageItems = computed(() => {
  const t = totalPages.value;
  const p = page.value;
  const window = 2;

  const start = Math.max(1, p - window);
  const end = Math.min(t, p + window);

  const pages: Array<number | "…"> = [];

  if (start > 1) pages.push(1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < t - 1) pages.push("…");
  if (end < t) pages.push(t);

  return pages;
});
</script>

<template>
  <div class="bg-primary text-white py-4 mb-4">
    <div class="container">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"
      >
        <!-- Título -->
        <div>
          <h1 class="h3 mb-1">Sistema de Gastos</h1>
          <p class="mb-0 opacity-75">CRUD con Nuxt 4 + Bootstrap 5</p>
        </div>

        <!-- Botón pagina de reportes -->
        <NuxtLink to="/reports" class="btn btn-light btn-lg shadow-sm">
          Reportes de gastos
        </NuxtLink>
      </div>
    </div>
  </div>

  <div class="container py-4">
    <div
      class="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3"
    >
      <div>
        <h3 class="mb-1">Gastos</h3>
        <p class="text-muted mb-0">Nuxt + Bootstrap 5 (CRUD con paginación).</p>
      </div>
      <div v-if="user" class="flex items-center gap-2">
        <UBadge :label="user.role" variant="subtle" />
        <span class="text-sm">{{ user.email }}</span>
      </div>

      <div class="d-flex gap-2">
        <button
          class="btn btn-outline-secondary"
          @click="fetchData"
          :disabled="loading"
        >
          Recargar
        </button>
        <button class="btn btn-primary" @click="openCreate">
          + Nuevo gasto
        </button>
      </div>
      <div class="space-y-4">
        <!-- Filtros -->
        <div class="flex flex-wrap gap-3 items-center">
          <!-- Buscar -->
          <UInput
            v-model="searchText"
            placeholder="Search expense..."
            icon="i-heroicons-magnifying-glass"
          />

          <!-- Categorías reales -->
          <USelect
            v-model="selectedCategory"
            placeholder="Category"
            :options="[
              { label: 'All', value: '' },
              { label: 'Food', value: 'Food' },
              { label: 'Transport', value: 'Transport' },
              { label: 'Bills', value: 'Bills' },
              { label: 'Shopping', value: 'Shopping' },
              { label: 'Health', value: 'Health' },
              { label: 'Entertainment', value: 'Entertainment' },
              { label: 'Other', value: 'Other' },
            ]"
          />
          <!-- Export buttons -->
          <div class="flex gap-2 ml-auto">
            <UButton
              type="button"
              color="secondary"
              icon="i-heroicons-document-text"
              @click="download('csv', exportParams)"
            >
              CSV
            </UButton>

            <UButton
              type="button"
              color="secondary"
              icon="i-heroicons-document-text"
              @click="download('xlsx', exportParams)"
            >
              EXCEL
            </UButton>

            <UButton
              type="button"
              color="secondary"
              icon="i-heroicons-document-text"
              @click="download('pdf', exportParams)"
            >
              PDF
            </UButton>
          </div>
        </div>

        <slot />
      </div>
    </div>

    <div
      v-if="errorMsg"
      class="alert alert-danger d-flex justify-content-between align-items-center"
    >
      <span>{{ errorMsg }}</span>
      <button class="btn-close" @click="errorMsg = ''"></button>
    </div>

    <div
      v-if="successMsg"
      class="alert alert-success d-flex justify-content-between align-items-center"
    >
      <span>{{ successMsg }}</span>
      <button class="btn-close" @click="successMsg = ''"></button>
    </div>

    <!-- Filtros -->
    <div class="card shadow-sm border-0 mb-3">
      <div class="card-body">
        <div class="row g-2 align-items-end">
          <div class="col-md-6">
            <label class="form-label">Buscar</label>
            <div class="input-group">
              <span class="input-group-text">🔎</span>
              <input
                v-model="query"
                class="form-control"
                placeholder="Descripción..."
              />
            </div>
          </div>

          <div class="col-md-3">
            <label class="form-label">Categoría</label>
            <select v-model="category" class="form-select">
              <option value="">Todas</option>
              <option v-for="c in categories" :key="String(c)" :value="c">
                {{ c }}
              </option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">Por página</label>
            <select v-model.number="limit" class="form-select">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Descripción</th>
                <th style="width: 140px">Monto</th>
                <th style="width: 140px">Fecha</th>
                <th style="width: 180px">Categoría</th>
                <th class="text-end" style="width: 180px">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-5">
                  <div
                    class="spinner-border"
                    role="status"
                    aria-label="Cargando"
                  ></div>
                  <div class="text-muted mt-2">Cargando...</div>
                </td>
              </tr>

              <tr v-else-if="!rows.length">
                <td colspan="5" class="text-center text-muted py-5">
                  No hay gastos para mostrar.
                </td>
              </tr>

              <tr v-else v-for="e in rows" :key="e.id">
                <td class="fw-semibold">{{ e.description }}</td>
                <td>${{ Number(e.amount).toFixed(2) }}</td>
                <td>{{ (e.date || "").slice(0, 10) }}</td>
                <td>
                  <span class="badge text-bg-secondary">{{ e.category }}</span>
                </td>
                <td class="text-end">
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="openEdit(e)"
                  >
                    Editar
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="onDelete(e.id)"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div
          class="p-3 border-top d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center"
        >
          <div class="text-muted small">
            Página <strong>{{ page }}</strong> de
            <strong>{{ totalPages }}</strong>
          </div>

          <nav aria-label="Paginación">
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: !canPrev }">
                <button class="page-link" @click="goPrev">Anterior</button>
              </li>

              <li
                v-for="(it, idx) in pageItems"
                :key="idx"
                class="page-item"
                :class="{ active: it === page, disabled: it === '…' }"
              >
                <button
                  v-if="it !== '…'"
                  class="page-link"
                  @click="goTo(it as number)"
                >
                  {{ it }}
                </button>
                <span v-else class="page-link">…</span>
              </li>

              <li class="page-item" :class="{ disabled: !canNext }">
                <button class="page-link" @click="goNext">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="modal d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.55)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Editar gasto" : "Nuevo gasto" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <input
                v-model="form.description"
                class="form-control"
                placeholder="Ej. Comida"
              />
            </div>

            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Monto</label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha</label>
                <input v-model="form.date" type="date" class="form-control" />
              </div>
            </div>

            <div class="mt-3">
              <label class="form-label">Categoría</label>
              <select v-model="form.category" class="form-select">
                <option v-for="c in categories" :key="String(c)" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light" @click="closeModal">Cancelar</button>
            <button class="btn btn-primary" :disabled="saving" @click="save">
              <span
                v-if="saving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ isEditing ? "Guardar cambios" : "Crear" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Toasts -->
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <!-- Success toast -->
    <div
      ref="successToast"
      class="toast align-items-center text-bg-success border-0"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ toastMessage }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
        ></button>
      </div>
    </div>

    <!-- Error toast -->
    <div
      ref="errorToast"
      class="toast align-items-center text-bg-danger border-0"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ toastMessage }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
        ></button>
      </div>
    </div>
  </div>
  <!-- Footer -->
  <footer class="bg-light border-top mt-5 py-4">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-center gap-4 text-center">
        <span class="fw-semibold">
          Realizó: Francisco Javier Gonzalez Fajardo
        </span>

        <span> Teléfono 9373399220 </span>

        <span> Correo: ingfranciscofajardo7@gmail.com </span>
      </div>
    </div>
  </footer>
</template>
