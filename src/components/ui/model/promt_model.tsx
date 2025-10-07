import React from 'react';
import { Promt } from '../../../services/model/modelService';

interface PromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: Promt | null;
}

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, prompt }) => {
    if (!isOpen || !prompt) return null;

    // Mencegah modal tertutup saat konten di dalam modal di-klik
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        // Overlay dengan backdrop blur, konsisten dengan AddMateriModal
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Kontainer Modal */}
            <div
                className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800 max-h-[90vh] flex flex-col"
                onClick={handleContentClick}
            >
                {/* Header Modal */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Detail Prompt
                </h2>

                {/* Body Modal (dibuat scrollable jika konten panjang) */}
                <div className="space-y-6 overflow-y-auto mb-6 pr-2">
                    {/* Bagian System Prompt */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            System Prompt
                        </label>
                        <div className="w-full rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 whitespace-pre-wrap dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            {prompt.system_prompt}
                        </div>
                    </div>

                    {/* Bagian User Prompts */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            User Prompts
                        </label>
                        <div className="space-y-3">
                            {prompt.user_prompts.map((userPrompt, index) => (
                                <div key={index} className="w-full rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 whitespace-pre-wrap dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                    <p>{userPrompt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptModal;