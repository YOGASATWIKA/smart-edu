// src/components/ModulCard.tsx

import {Modul} from '../services/modul/modulService.tsx';
import { useNavigate } from 'react-router-dom';

interface ModulCardProps {
    modul: Modul;
    isSelected?: boolean;
    isDisabled: boolean;
    onSelect?: (id: string) => void;
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
            if (onSelect) {
                onSelect(modul._id);
            }
        }
    };

    const handleDetailClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewDetail(modul);
    };
    const handleEbookClick = () => {
        navigate('/ebook', { state: { moduleId: modul._id } });
    };

    const stateColors: { [key: string]: string } = {
        DRAFT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
        OUTLINE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
        EBOOK: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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

            <div className="flex-grow">
                <h3 className="pr-8 text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {modul.materi_pokok.nama_jabatan}
                </h3>
                <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        stateColors[modul.state] || stateColors.default
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
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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