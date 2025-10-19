import React, { useEffect, useRef, useId } from "react";
import { Model } from "../../../services/model/modelService";

interface ModelDetailModalProps {
    model: Model | null;
    details: string[];
    onClose: () => void;
    isDetailsLoading?: boolean;
}

const ModelDetailModal = ({ model, onClose }: ModelDetailModalProps) => {

    // --- PERBAIKAN: Pindahkan SEMUA hooks ke atas ---
    // Hooks harus dipanggil di top-level, sebelum return apapun.
    const titleId = useId();
    const descriptionId = useId();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Efek untuk tombol 'Escape'
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]); // Dependency [onClose] sudah benar

    // Efek untuk auto-fokus
    useEffect(() => {
        // Kita bisa tambahkan pengecekan 'model' di sini
        // agar fokus hanya berjalan jika modal benar-benar ada isinya
        if (model) {
            closeButtonRef.current?.focus();
        }
    }, [model]); // Tambahkan [model] sebagai dependency

    // --- Guard Clause (Sekarang di bawah hooks) ---
    // Ini adalah cara yang benar: panggil hooks dulu, baru return.
    if (!model) {
        return null;
    }

    // --- Fungsi Handler ---
    const handleOverlayClick = () => {
        onClose();
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl mx-4 p-6 relative transform transition-all animate-slide-up overflow-y-auto max-h-[90vh]"
                onClick={handleModalClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
            >
                {/* Header */}
                <h2 id={titleId} className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Detail Model: <span className="text-teal-600 dark:text-teal-400">{model.model}</span>
                </h2>
                <p id={descriptionId} className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                    {model.description || "Tidak ada deskripsi untuk model ini."}
                </p>

                {/* Bagian Langkah Prompt (Sudah aman) */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Langkah Prompt:
                    </h3>
                    {model.steps && model.steps.length > 0 ? (
                        <ul className="space-y-3">
                            {model.steps.map((step, i) => (
                                <li
                                    key={i}
                                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold uppercase text-teal-600 dark:text-teal-400">
                                            {step.role}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            Step {i + 1}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                        {step.content}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Tidak ada langkah prompt.
                        </p>
                    )}
                </section>


                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModelDetailModal;