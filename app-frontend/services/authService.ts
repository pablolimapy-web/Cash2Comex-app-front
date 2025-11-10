
export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string; name: string; email: string };

export type RegisterRequest = { name: string; email: string; password: string };
export type UserResponse = { id: string; name: string; email: string };

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

const TOKEN_KEY = 'c2c_token';

export const authStorage = {
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken(token: string) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
        // opcional: cookie para SSR/middleware
        document.cookie = `c2c_token=${token}; path=/; SameSite=Lax;`;
    },
    clear() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
        document.cookie = 'c2c_token=; path=/; Max-Age=0;';
    },
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
        },
    });
    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const body = isJSON ? await res.json() : (await res.text());
    if (!res.ok) {
        const msg =
            (isJSON && (body?.message || body?.error)) ||
            (typeof body === 'string' ? body : 'Erro inesperado');
        throw new Error(msg);
    }
    return body as T;
}

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const resp = await apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        authStorage.setToken(resp.token);
        return resp;
    },

    async register(data: RegisterRequest): Promise<UserResponse> {
        const resp = await apiFetch<UserResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return resp;
    },

    async me(): Promise<UserResponse> {
        const token = authStorage.getToken();
        if (!token) throw new Error('Não autenticado');
        return apiFetch<UserResponse>('/auth/me', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    logout() {
        authStorage.clear();
    },
};
