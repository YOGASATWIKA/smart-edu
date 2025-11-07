import { Modul } from '../../../services/modul/modulService.tsx';
import { useNavigate } from 'react-router-dom';
import {Trash} from "lucide-react";
import { deleteModulById } from '../../../services/modul/modulService.tsx';
import Swal from "sweetalert2";

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


    const actionButtonConfig = {
        OUTLINE: {
            text: 'Generate Ebook',
            handler: handleWriteNavigation,
            className: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-500"
        },
        EBOOK: {
            text: 'Lihat Ebook',
            handler: handleEbookNavigation,
            className: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-500"
        }
    };
    const actionButton = actionButtonConfig[modul.state as keyof typeof actionButtonConfig];

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Yakin ingin menghapus modul ini?',
            text: 'Tindakan ini tidak dapat dibatalkan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            await deleteModulById(id);
            Swal.fire({
                title: 'Dihapus!',
                text: 'Modul berhasil dihapus.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
            window.location.reload();
        }
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
                        {modul.materi_pokok.nama_jabatan}
                    </h3>
                    <button
                        type="button"
                        onClick={() => handleDelete(modul._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash size={16} />
                    </button>
                </div>

                <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white `}
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
