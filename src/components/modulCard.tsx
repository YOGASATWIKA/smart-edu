// // src/components/ModulCard.tsx
//
// import {Modul} from '../services/modul/modulService.tsx';
// import { useNavigate } from 'react-router-dom';
//
// interface ModulCardProps {
//     modul: Modul;
// }
//
// const formatDate = (dateString: string) => {
//     if (!dateString) {
//         return '-';
//     }
//     const options: Intl.DateTimeFormatOptions = {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//     };
//     return new Date(dateString).toLocaleDateString('id-ID', options);
// };
//
// export default function ModulCard({ modul}: ModulCardProps) {
//     const navigate = useNavigate();
//
//     const handleEbookClick = () => {
//         navigate('/ebook', { state: { moduleId: modul._id } });
//     };
//
//     const stateColors: { [key: string]: string } = {
//         DRAFT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
//         OUTLINE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
//         EBOOK: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
//         default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//     };
//
//     return (
//         <div
//             className={`
//                 relative flex h-full flex-col rounded-xl border p-6 shadow-md transition-all duration-200
//                 ? 'cursor-not-allowed bg-gray-50 opacity-70 dark:bg-gray-800/50'
//                 : 'cursor-pointer bg-white hover:shadow-xl dark:bg-gray-800'}
//             `}
//         >
//
//             <div className="flex-grow">
//                 <h3 className="pr-8 text-lg font-bold text-gray-900 dark:text-white mb-2">
//                     {modul.materi_pokok.nama_jabatan}
//                 </h3>
//                 <span
//                     className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
//                         stateColors[modul.state] || stateColors.default
//                     }`}
//                 >
//                   {modul.state}
//                 </span>
//             </div>
//
//             <div className="mt-6 mb-4 flex items-center gap-3">
//                 {['OUTLINE'].includes(modul.state) && (
//                     <button
//                         onClick={handleEbookClick}
//                         className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
//                     >
//                         Lihat Detail
//                     </button>
//                 )}
//                 {modul.state === 'EBOOK' && (
//                     <button
//                         onClick={handleEbookClick}
//                         className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
//                     >
//                         Lihat Ebook
//                     </button>
//                 )}
//             </div>
//
//
//             <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
//                 <p>Dibuat: {formatDate(modul.created_at)}</p>
//                 <p>
//                     Diperbarui: {modul.updated_at ? formatDate(modul.updated_at) : '-'}
//                 </p>
//             </div>
//         </div>
//     );
// }




import { Modul } from '../services/modul/modulService.tsx';
import { useNavigate } from 'react-router-dom';

interface ModulCardProps {
    modul: Modul;
}

const formatDate = (dateString: string) => {
    if (!dateString || dateString.startsWith('0001')) {
        return '-';
    }
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function ModulCard({ modul }: ModulCardProps) {
    const navigate = useNavigate();

    const handleWriteNavigation = () => {
        navigate('/write', { state: { moduleId: modul._id } });
    };


    const handleEbookNavigation = () => {
        navigate('/ebook', { state: { moduleId: modul._id } });
    };

    const stateColors: { [key: string]: string } = {
        OUTLINE: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
        EBOOK:   'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
    };
    const actionButtonConfig = {
        OUTLINE: {
            text: 'Buat Ebook',
            handler: handleWriteNavigation,
            className: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-500"
        },
        EBOOK: {
            text: 'Lihat Ebook',
            handler: handleEbookNavigation,
            className: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-600"
        }
    };
    const actionButton = actionButtonConfig[modul.state as keyof typeof actionButtonConfig];


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
                        {modul.materi_pokok.nama_jabatan}
                    </h3>
                </div>

                <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        stateColors[modul.state] || stateColors.default
                    }`}
                >
                  {modul.state}
                </span>
            </div>

            <div className="mt-8">
                {actionButton && (
                    <button
                        onClick={actionButton.handler}
                        className={`w-full mb-4 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${actionButton.className}`}
                    >
                        {actionButton.text}
                    </button>
                )}

                <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                    <p>Dibuat: {formatDate(modul.created_at)}</p>
                    <p>
                        Diperbarui: {modul.updated_at ? formatDate(modul.updated_at) : '-'}
                    </p>
                </div>
            </div>
        </div>
    );
}
