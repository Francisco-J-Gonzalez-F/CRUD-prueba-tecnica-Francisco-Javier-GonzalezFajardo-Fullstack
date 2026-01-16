<script setup lang="ts">
import { computed, reactive, ref, defineAsyncComponent } from "vue";
import type { ApexOptions } from "apexcharts";

const ApexChart = process.client
  ? defineAsyncComponent(() => import("vue3-apexcharts"))
  : null;
const { reportByCategory, reportByPeriod } = useExpenses();

const loading = ref(false);

const form = reactive({
  from: "2026-01-01",
  to: "2026-02-01",
  group: "month" as "day" | "month",
  category: "",
});

const pieSeries = ref<number[]>([]);
const pieLabels = ref<string[]>([]);

const lineSeries = ref<{ name: string; data: number[] }[]>([]);
const lineCategories = ref<string[]>([]);

const apply = async () => {
  loading.value = true;
  try {
    const cat = form.category.trim() || undefined;

    const [byCat, byPeriod] = await Promise.all([
      reportByCategory({ from: form.from, to: form.to, category: cat }),
      reportByPeriod({
        from: form.from,
        to: form.to,
        group: form.group,
        category: cat,
      }),
    ]);

    pieLabels.value = byCat.map((x) => x.category);
    pieSeries.value = byCat.map((x) => x.total);

    lineCategories.value = byPeriod.map((x) => {
      const d = new Date(x.period);
      return form.group === "month"
        ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
            2,
            "0"
          )}`
        : d.toISOString().slice(0, 10);
    });

    lineSeries.value = [{ name: "Total", data: byPeriod.map((x) => x.total) }];
  } finally {
    loading.value = false;
  }
};

const pieOptions = computed<ApexOptions>(() => ({
  labels: pieLabels.value,
  legend: { position: "bottom" },
}));

const lineOptions = computed<ApexOptions>(() => ({
  xaxis: { categories: lineCategories.value },
  stroke: { curve: "smooth" },
}));
</script>

<template>
  <div class="container py-4">
    <div
      class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3"
    >
      <div>
        <h1 class="h4 mb-0">Reportes</h1>
        <small class="text-muted"
          >Filtra por fechas y genera gráficas por categoría y por
          periodo.</small
        >
      </div>

      <button class="btn btn-primary" :disabled="loading" @click="apply">
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Aplicar
      </button>
    </div>

    <!-- Card filtros -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-0">
        <div class="fw-semibold">Filtros</div>
      </div>

      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-3">
            <label class="form-label">Desde</label>
            <input v-model="form.from" type="date" class="form-control" />
          </div>

          <div class="col-12 col-md-3">
            <label class="form-label">Hasta</label>
            <input v-model="form.to" type="date" class="form-control" />
          </div>

          <div class="col-12 col-md-3">
            <label class="form-label">Agrupar</label>
            <select v-model="form.group" class="form-select">
              <option value="day">Día</option>
              <option value="month">Mes</option>
            </select>
          </div>

          <div class="col-12 col-md-3">
            <label class="form-label">Categoría (opcional)</label>
            <input
              v-model="form.category"
              type="text"
              class="form-control"
              placeholder="Ej. Transporte"
            />
          </div>

          <div class="col-12 d-flex justify-content-end">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="form.category = ''"
            >
              Limpiar categoría
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficas -->
    <div class="row g-4">
      <!-- Pastel -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div
            class="card-header bg-white border-0 d-flex align-items-center justify-content-between"
          >
            <div class="fw-semibold">Pastel: totales por categoría</div>
            <span class="badge text-bg-light">
              {{ form.from }} → {{ form.to }}
            </span>
          </div>

          <div class="card-body">
            <div v-if="pieSeries.length === 0" class="text-muted">
              Sin datos. Ajusta filtros y presiona <b>Aplicar</b>.
            </div>

            <ClientOnly>
              <component
                v-if="ApexChart && pieSeries.length"
                :is="ApexChart"
                type="donut"
                :options="pieOptions"
                :series="pieSeries"
                height="320"
              />
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Línea -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div
            class="card-header bg-white border-0 d-flex align-items-center justify-content-between"
          >
            <div class="fw-semibold">
              Evolución: total por {{ form.group === "day" ? "día" : "mes" }}
            </div>
            <span class="badge text-bg-light">
              {{ form.group === "day" ? "Diario" : "Mensual" }}
            </span>
          </div>

          <div class="card-body">
            <div v-if="lineCategories.length === 0" class="text-muted">
              Sin datos. Ajusta filtros y presiona <b>Aplicar</b>.
            </div>

            <ClientOnly>
              <component
                v-if="ApexChart && lineCategories.length"
                :is="ApexChart"
                type="line"
                :options="lineOptions"
                :series="lineSeries"
                height="320"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer mini -->
    <div class="text-center text-muted mt-4">
      <small
        >Reportes generados desde el backend (agregados por
        fecha/categoría).</small
      >
    </div>
  </div>
</template>
