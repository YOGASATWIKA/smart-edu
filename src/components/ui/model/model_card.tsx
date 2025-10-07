// import { Model } from '../../../services/model/modelService';
//
// interface ModulCardProps {
//     model: Model;
//     onButtonClick: (model: Model) => void;
// }
//
// const formatDate = (dateString: string) => {
//     if (!dateString || dateString.startsWith('0001')) {
//         return '-';
//     }
//     const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('id-ID', options);
// };
//
// export default function ModulCard({ model, onButtonClick }: ModulCardProps) {
//     const stateColors: { [key: string]: string } = {
//         OUTLINE: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
//         EBOOK: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
//     };
//
//     // Konfigurasi untuk tombol, bisa disederhanakan jika aksinya sama
//     const buttonText = 'Lihat Prompt';
//
//     return (
//         <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800">
//             <div>
//                 <div className="mb-3 flex items-start justify-between">
//                     <h3 className="pr-4 text-lg font-bold leading-tight text-gray-900 dark:text-white">
//                         {model.model}
//                     </h3>
//                 </div>
//                 <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${stateColors[model.type] || ''}`}>
//                     {model.type}
//                 </span>
//             </div>
//
//             <div className="mt-8">
//                 <button
//                     onClick={() => onButtonClick(model)}
//                     className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//                 >
//                     {buttonText}
//                 </button>
//                 <div className="mt-4 border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
//                     <p>Dibuat: {formatDate(model.created_at)}</p>
//                     <p>Diperbarui: {formatDate(model.updated_at)}</p>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React from 'react';
import { Model, Promt } from '../../../services/model/modelService';

interface ModelCardProps {
    modelData: Model;
    onViewPrompt: (prompt: Promt) => void;
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

    const stateColors: { [key: string]: string } = {
        OUTLINE: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
        EBOOK:   'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
    };

    return (
        <div
            className={`
                flex h-full flex-col justify-between rounded-xl border p-6 
                shadow-sm transition-all duration-300 ease-in-out
                bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:-translate-y-1 
            `}
        >
            <div>
                <div className="flex items-start justify-between mb-3">
                    <h3 className="pr-4 text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        {modelData.model}
                    </h3>
                </div>
                <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        stateColors[modelData.type] || stateColors.default
                    }`}
                >
                  {modelData.type}
                </span>
            </div>

                <div className="mt-6">
                    <button
                            onClick={() => onViewPrompt(modelData.promt)}
                            className="w-full mb-4 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-500 "
                        >
                            Lihat Prompt
                    </button>
                </div>


                <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                    <p>Dibuat: {formatDate(modelData.updated_at)}</p>
                    <p>
                        Diperbarui: {modelData.updated_at ? formatDate(modelData.updated_at) : '-'}
                    </p>
                </div>
        </div>
    );
};

export default ModelCard;