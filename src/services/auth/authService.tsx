// src/services/auth/authService.tsx

import axios from 'axios';

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
const BACKEND_API_URL = `${import.meta.env.VITE_PATH_API}/api/auth/google`;

/**
 * Fungsi untuk menangani proses login Google.
 * 1. Mengambil info pengguna dari Google.
 * 2. Mengirim info tersebut ke backend untuk autentikasi.
 * @param {string} googleAccessToken - Token akses yang didapat dari Google Login.
 * @returns {Promise<{token: string, user: object}>} - Token JWT dan data pengguna dari backend.
 */
export const googleLoginService = async (googleAccessToken: string) => {
    try {
        // Langkah 1: Dapatkan informasi pengguna dari Google
        const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
            headers: { Authorization: `Bearer ${googleAccessToken}` },
        });

        const { sub, name, email, picture } = userInfoResponse.data;

        // Langkah 2: Kirim data ke backend Anda untuk mendapatkan token JWT
        const backendResponse = await axios.post(BACKEND_API_URL, {
            name,
            email,
            googleId: sub,
            picture,
        });

        // Pastikan backend mengembalikan token
        if (!backendResponse.data ||!backendResponse.data.token) {
            throw new Error('No token received from server.');
        }

        // Kembalikan data yang dibutuhkan oleh aplikasi
        return {
            token: backendResponse.data.token,
            user: { name, email, picture },
        };
    } catch (error: any) {
        // Lemparkan error agar bisa ditangkap oleh pemanggil (custom hook)
        // ✅ PERBAIKAN DI SINI: Mengganti '| |' menjadi '||'
        console.error("Authentication service error:", error.response?.data || error.message);
        throw new Error('Failed to authenticate with the server.');
    }
};

export const storeAuthData = (token: string, user: object) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
};