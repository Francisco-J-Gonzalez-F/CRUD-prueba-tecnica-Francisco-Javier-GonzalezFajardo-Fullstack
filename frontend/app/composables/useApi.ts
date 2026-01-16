export function useApi() {
  const config = useRuntimeConfig();

  const request = async <T>(path: string, opts: any = {}): Promise<T> => {
    const isFormData =
      typeof FormData !== 'undefined' && opts?.body instanceof FormData;

    return await $fetch<T>(`${config.public.apiBase}${path}`, {
      ...opts,
      credentials: 'include', 
      headers: {
        ...(opts.headers || {}),
        "Content-Type": "application/json",
      },
    });
  };

  return { request };
}
