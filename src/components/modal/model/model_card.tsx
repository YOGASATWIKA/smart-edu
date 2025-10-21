import React from 'react';
import { Model } from '../../../services/model/modelService.tsx';
import StatusBadge from "../status.tsx";

interface ModelCardProps {
    modelData: Model;
    onViewPrompt: (prompt: Model) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ modelData, onViewPrompt }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className={`
                flex h-full flex-col justify-between rounded-xl border p-6 
                shadow-sm transition-all duration-300 ease-in-out
                bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md
            `}
        >
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug truncate">
                    {modelData.model}
                </h3>
            </div>
            <div className="flex-1 mb-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                    {modelData.description || 'Tidak ada deskripsi'}
                </p>
            </div>
            <div className="flex items-start justify-between">
                <StatusBadge isActive={modelData.is_active} size="md" />
            </div>

            <div className="mt-4">
                <button
                    onClick={() => onViewPrompt(modelData)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                        bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 dark:bg-teal-700 dark:hover:bg-teal-800"
                >
                    Lihat Prompt
                </button>
            </div>

            {/* Footer Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-5 pt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>
                    Dibuat:&nbsp;
                    {modelData.created_at ? formatDate(modelData.created_at) : '-'}
                </p>
                <p>
                    Diperbarui:&nbsp;
                    {modelData.updated_at ? formatDate(modelData.updated_at) : '-'}
                </p>
                {modelData.deleted_at && (
                    <p className="text-red-500">
                        Dihapus:&nbsp;{formatDate(modelData.deleted_at)}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ModelCard;
