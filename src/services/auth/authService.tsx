import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse, GoogleLoginPayload } from '../../types/auth';

const BASE_API_URL = import.meta.env.VITE_PATH_API;


export interface User {
    _id?: string;
    googleId?: string;
    email: string;
    name?: string;
    picture?: string;
    password?: string;
}

export interface UpdateProfileRequest {
    email: string;
    picture: string;
    name: string;
}


export const loginService = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${BASE_API_URL}/login`, credentials);
        if (!response.data || !response.data.token || !response.data.user) {
            throw new Error('Invalid response from server');
        }
        return response.data;
    } catch (error: any) {
        console.error("Login service error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to login.');
    }
};


export const registerService = async (data: RegisterData): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${BASE_API_URL}/register`, data);
        if (!response.data || !response.data.token || !response.data.user) {
            throw new Error('Invalid response from server');
        }
        return response.data;
    } catch (error: any) {
        console.error("Register service error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to register.');
    }
};

export const googleLoginService = async (googleAccessToken: string): Promise<AuthResponse> => {
    try {
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${googleAccessToken}` },
        });

        const { sub, name, email, picture } = userInfoResponse.data;
        const payload: GoogleLoginPayload = { name, email, googleId: sub, picture };

        const backendResponse = await axios.post(`${BASE_API_URL}/api/auth/google`, payload);

        if (!backendResponse.data || !backendResponse.data.token) {
            throw new Error('No token received from server.');
        }

        return backendResponse.data;

    } catch (error: any) {
        console.error("Authentication service error:", error.response?.data || error.message);
        throw new Error('Failed to authenticate with the server.');
    }
};


export const getProfile = async (token: string): Promise<User> => {
    const response = await fetch(`${BASE_API_URL}/api/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error('Session Expired Please Login');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: User = await response.json();

    if (result) {
        return result;
    } else {
        throw new Error('Format data profil dari server tidak sesuai');
    }
};

export const storeAuthData = (token: string, user: object) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const updateProfile = async (token: string, payload: UpdateProfileRequest,   userId: string) => {
    const response = await axios.put(
        `${BASE_API_URL}/api/profile/`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                id: userId,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

export const uploadImageProfile = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
        `${BASE_API_URL}/api/profile/upload`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );


    return response.data;
};

export async function resetPasswordRequest(
    token: string,
    newPassword: string,
    confirmPassword: string
) {
    try {
        const res = await fetch(`${BASE_API_URL}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }),
        });

        const data = await res.json();

        return {
            ok: res.ok,
            message: data.message || (res.ok ? "Password berhasil direset" : "Gagal reset password"),
        };
    } catch (error: any) {
        console.error("Authentication service error:", error.response?.data || error.message);
        throw new Error('Failed to authenticate with the server.');
    }
}

export async function forgotPasswordRequest(email: string) {
    try {
        const res = await fetch(`${BASE_API_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        return {
            ok: res.ok,
            message:
                data.message ||
                (res.ok
                    ? "Jika email terdaftar, link reset password telah dikirim."
                    : "Terjadi kesalahan"),
        };
    } catch (error: any) {
        console.error("Authentication service error:", error.response?.data || error.message);
        throw new Error('Failed to authenticate with the server.');
    }
}
