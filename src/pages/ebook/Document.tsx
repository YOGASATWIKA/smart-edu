import { useState, useEffect} from 'react';
import ModulCard from '../../components/modulCard.tsx';
import PageBreadcrumb from '../../components/common/PageBreadCrumb.tsx';
import PageMeta from '../../components/common/PageMeta.tsx';
import {getModulByState, Modul } from '../../services/modul/modulService.tsx';



export default function ModulListPage() {
    const [modulList, setModulList] = useState<Modul[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [filterStatus, setFilterStatus] = useState('ALL');
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getModulByState(filterStatus);
                setModulList(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [filterStatus]);


    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><p>Memuat data awal...</p></div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-600"><p>Error: {error}</p></div>;
    }

    return (
        <>
        <PageMeta
            title="Ebook"
            description="Lihat semua materi pokok yang telah dibuat."
        />
        <PageBreadcrumb pageTitle="Ebook" />

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-end rounded-lg shadow-sm sm:flex-row pb-4 ">
                    <div className="relative ">
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="min-w-36 rounded-md border-gray-300 bg-white py-2 pr-8 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="ALL">All</option>
                            <option value="OUTLINE">Outline</option>
                            <option value="EBOOK">Ebook</option>
                        </select>
                </div>
            </div>
            <main>
                {modulList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {modulList.map((modul) => (
                            <ModulCard
                                key={modul._id}
                                modul={modul}
                                />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500">Belum ada modul yang tersedia. Silakan buat materi baru.</p>
                    </div>
                )}

            </main>
        </div>
        </>
    );
}
