import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin, type TokenResponse } from '@react-oauth/google';
import { googleLoginService, storeAuthData } from '../services/auth/authService';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleGoogleLoginSuccess = async (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
        setIsLoading(true);
        setError(null);
        try {
            const { token, user } = await googleLoginService(tokenResponse.access_token);
            storeAuthData(token, user);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Gagal masuk. Silakan coba lagi nanti.');
        } finally {
            setIsLoading(false);

        }
    };

    const handleGoogleLoginError = () => {
        setError('Otentikasi dengan Google gagal. Mohon coba kembali.');
    };

    const login = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: handleGoogleLoginError,
    });

    return {
        login,
        isLoading,
        error,
    };
};