export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface GoogleLoginPayload {
    name: string;
    email: string;
    googleId: string;
    picture: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        picture?: string;
    };
}