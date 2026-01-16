export const useExportExpenses = () => {
  const config = useRuntimeConfig();

  const download = async (
    format: "csv" | "xlsx" | "pdf",
    params: { query?: string; category?: string } = {}
  ) => {
    const qs = new URLSearchParams({
      format,
      ...(params.query ? { query: params.query } : {}),
      ...(params.category ? { category: params.category } : {}),
    }).toString();

    const blob = await $fetch(`expenses/export?${qs}`, {
      baseURL: config.public.apiBase,
      responseType: "blob",
      credentials: "include",
    });

    const stamp = new Date().toISOString().slice(0, 10);
    const ext = format === "xlsx" ? "xlsx" : format;

    const url = URL.createObjectURL(blob as Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gastos_${stamp}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return { download };
};
