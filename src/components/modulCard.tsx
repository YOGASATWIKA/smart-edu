// src/components/ModulCard.tsx

import {Modul} from '../services/modul/modulService.tsx';
import { useNavigate } from 'react-router-dom';

interface ModulCardProps {
    modul: Modul;
    isSelected: boolean;
    isDisabled: boolean;
    onSelect: (id: string) => void;
    onViewDetail: (modul: Modul) => void;
}

const formatDate = (dateString: string) => {
    if (!dateString) {
        return '-';
    }
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function ModulCard({ modul, isSelected, isDisabled, onSelect, onViewDetail }: ModulCardProps) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        if (!isDisabled) {
            onSelect(modul._id);
        }
    };

    const handleDetailClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewDetail(modul);
    };
    const handleEbookClick = () => {
        navigate('/ebook', { state: { moduleId: modul._id } });
    };

    return (
        <div
            onClick={handleCardClick}
            className={`
                relative flex h-full flex-col rounded-xl border p-6 shadow-md transition-all duration-200 
                ${isDisabled
                ? 'cursor-not-allowed bg-gray-50 opacity-70 dark:bg-gray-800/50'
                : 'cursor-pointer bg-white hover:shadow-xl dark:bg-gray-800'}
                ${isSelected && !isDisabled
                ? 'border-blue-500 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-gray-700'}
            `}
        >
            {/* Checkbox hanya ditampilkan untuk modul yang bisa dipilih */}
            {!isDisabled && (
                <div className="absolute top-4 right-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                    />
                </div>
            )}

            <div className="flex-grow">
                <h3 className="pr-8 text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {modul.materi_pokok.nama_jabatan}
                </h3>
                <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        modul.state === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                >
                    {modul.state}
                </span>
            </div>

            <div className="mt-6 mb-4 flex items-center gap-3">
                {['DRAFT', 'OUTLINE'].includes(modul.state) && (
                    <button
                        onClick={handleDetailClick}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Lihat Detail
                    </button>
                )}
                {modul.state === 'EBOOK' && (
                    <button
                        onClick={handleEbookClick}
                        className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-800 transition hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                    >
                        Lihat Ebook
                    </button>
                )}
            </div>


            <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                <p>Dibuat: {formatDate(modul.created_at)}</p>
                <p>
                    Diperbarui: {modul.updated_at ? formatDate(modul.updated_at) : '-'}
                </p>
            </div>
        </div>
    );
}