import { useApi } from '~/composables/useApi';

export type Role = 'admin' | 'user';

export type MeUser = {
  id: number;
  email: string;
  role: Role;
};

export function useAuth() {
  const api = useApi();
  const user = useState<MeUser | null>('auth_user', () => null);
  const loading = useState<boolean>('auth_loading', () => false);

  const me = async () => {
    loading.value = true;
    try {
      const data = await api.request<MeUser>('/auth/me');
      user.value = data;
      return data;
    } catch {
      user.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const data = await api.request<MeUser>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      user.value = data;
      return data;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await api.request('/auth/logout', { method: 'POST' });
    } finally {
      user.value = null;
      loading.value = false;
    }
  };

  return { user, loading, me, login, logout };
}
