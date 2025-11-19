import React, { useState } from "react";
import { Link } from "react-router-dom";
import {forgotPasswordRequest} from "../../services/auth/authService.tsx";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const result = await forgotPasswordRequest(email);

        if (result.ok) {
            setMessage(result.message);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
                <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-3">
                    Lupa Password
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-6 text-sm">
                    Masukkan email Anda untuk menerima link reset password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                            required
                            className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    {message && (
                        <p className="text-green-600 text-sm text-center">{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Mengirim..." : "Kirim Link Reset"}
                    </button>

                    <Link
                        to="/signin"
                        className="block w-full text-center rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 text-sm transition"
                    >
                        Kembali Sign In
                    </Link>
                </form>
            </div>
        </div>
    );
}
