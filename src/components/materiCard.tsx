// src/components/MateriCard.tsx

import React from 'react';
import { MateriPokok } from '../services/materi/materiPokokService';
import { format } from 'date-fns';

// Definisikan props yang diterima komponen kartu
interface CardProps {
    materi: MateriPokok;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onViewDetail: (materi: MateriPokok) => void;
}

export default function MateriCard({ materi, isSelected, onSelect, onViewDetail }: CardProps) {
    const handleDetailClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewDetail(materi);
    };
    const fullDateString = materi.createdAt;
    const formattedDate = format(new Date(fullDateString), 'yyyy-MM-dd');

    return (
        <div
            onClick={() => onSelect(materi.id)}
            className={`
                group relative flex h-full cursor-pointer flex-col rounded-2xl border 
                bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300
                hover:shadow-lg hover:-translate-y-1.5 dark:from-gray-800 dark:to-gray-900
                ${isSelected
                ? 'border-blue-500 ring-2 ring-blue-500 dark:border-blue-500'
                : 'border-gray-200 dark:border-gray-700'
            }
            `}
        >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{materi.namaJabatan}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {materi.klasifikasi}
                <br/>
                {formattedDate}
            </p>
            <div className="mt-1 flex justify-end">
                <button
                    onClick={handleDetailClick}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                >
                    Lihat Detail
                </button>
            </div>
        </div>
    );
}