import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse, GoogleLoginPayload } from '../../types/auth';

const BASE_API_URL = import.meta.env.VITE_PATH_API;

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

        // Backend seharusnya juga mengembalikan data user, kita gunakan itu.
        return backendResponse.data;

    } catch (error: any) {
        console.error("Authentication service error:", error.response?.data || error.message);
        throw new Error('Failed to authenticate with the server.');
    }
};

// --- FUNGSI UTILITAS UNTUK MENYIMPAN DATA AUTH ---
/**
 * Menyimpan token dan data pengguna ke localStorage.
 * @param {string} token - Token otentikasi.
 * @param {object} user - Data pengguna.
 */
export const storeAuthData = (token: string, user: object) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
};