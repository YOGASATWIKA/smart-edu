// src/components/auth/login.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginService, storeAuthData } from '../../services/auth/authService';
import PasswordInput from './password_input.tsx';

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login: loginWithGoogle, isLoading: isGoogleLoading, error: googleError } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            const { token, user } = await loginService({ email, password });
            storeAuthData(token, user);
            navigate('/');
        } catch (error: any) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        SmartEdu
                    </h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email</label>
                        <input
                            id="email" type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-sky-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {formError && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                        {formError}
                    </div>
                )}
                <div className="relative my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300"></div>
                    <span className="mx-4 flex-shrink text-sm text-slate-400">Or</span>
                    <div className="flex-grow border-t border-slate-300"></div>
                </div>
                <button
                    onClick={() => !isGoogleLoading && loginWithGoogle()}
                    disabled={isGoogleLoading || isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isGoogleLoading ? (
                        <span>Signing In...</span>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
                                <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
                                <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
                                <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
                            </svg>
                            <span>Login with Google</span>
                        </>
                    )}
                </button>

                {/* Kode ini yang diperbaiki */}
                {googleError && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                        {googleError}
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>Don&apos;t have an account? <Link to="/signup" className="font-semibold text-sky-600 hover:underline">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}