export interface AuthTokens {
    accessToken: string;
}

export interface User {
    id: string;
    email: string;
    name: string,
    role: "ADMIN" | "USER"
}

export interface AuthContextType {
    user: User | null;
    tokens: AuthTokens | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
}