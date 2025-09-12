import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin, type TokenResponse } from '@react-oauth/google';
import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_PATH_API;
const API_URL = `${BASE_API_URL}/auth/google`;

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleAuthSuccess = async (tokenResponse: TokenResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      
      const { sub, name, email, picture } = userInfoResponse.data;
      
      const backendResponse = await axios.post(API_URL, { name, email, googleId: sub, picture });
      
      const { token } = backendResponse.data;

      if (token) {
        const user = { name, email, picture };
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/');
      } else {
        throw new Error('Authentication failed: No token received from server.');
      }
    } catch (err) {
      console.error("Authentication process error:", err);
      setError('Gagal mendaftar. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleAuthSuccess,
    onError: () => {
      setError('Otentikasi dengan Google gagal. Mohon coba kembali.');
    },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Get started in seconds with your Google account.
          </p>
        </div>
        
        <div>
          <button
            onClick={() => !isLoading && login()}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-slate-100 px-7 py-3 text-sm font-semibold text-slate-700 ring-slate-300 transition-colors hover:bg-slate-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-slate-600"
          >
            {isLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
               <>
                  {/* ✅ Kode SVG Ikon Google yang lengkap sudah dimasukkan kembali */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
                    <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
                    <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
                    <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
                  </svg>
                  Sign up with Google
               </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}