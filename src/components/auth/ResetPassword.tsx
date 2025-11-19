import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {resetPasswordRequest} from "../../services/auth/authService.tsx";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setMessage("Password tidak boleh kosong");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("Password tidak sama");
            return;
        }

        setLoading(true);
        setMessage("");

        const result = await resetPasswordRequest(token, password, confirmPassword);

        setMessage(result.message);

        if (result.ok) {
            setTimeout(() => navigate("/signin"), 1200);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
                <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-3">
                    Reset Password
                </h2>

                {!token ? (
                    <p className="text-red-600 text-center">Token tidak valid</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>

                        {message && (
                            <p className="text-center text-sm text-red-600 dark:text-red-400">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Memproses..." : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/signin")}
                            className="w-full rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 text-sm transition"
                        >
                            Kembali Sign In
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
