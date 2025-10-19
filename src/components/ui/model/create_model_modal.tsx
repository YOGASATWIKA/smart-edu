import React, { useEffect, useId } from "react";
import { X } from "lucide-react";
import CreateModelForm from "./create_model.tsx";

interface CreateModelModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateModelModal = ({ isOpen, onClose }: CreateModelModalProps) => {
    const titleId = useId();

    // Efek untuk menutup modal saat 'Escape' ditekan
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Handle klik di luar (overlay)
    const handleOverlayClick = () => {
        onClose();
    };

    // Mencegah klik di dalam modal ikut menutup
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // Jangan render apapun jika tidak 'isOpen'
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 relative animate-slide-up"
                onClick={handleModalClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Tutup modal"
                >
                    <X size={20} />
                </button>
                <h2
                    id={titleId}
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
                >
                    Buat Model Baru
                </h2>
                <CreateModelForm />
                {/* Anda mungkin ingin menambahkan prop onSuccess ke CreateModelForm
                    untuk memanggil onClose() saat submit berhasil */}
            </div>
        </div>
    );
};

export default CreateModelModal;