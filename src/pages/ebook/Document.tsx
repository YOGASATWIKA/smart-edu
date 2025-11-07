import { useState, useEffect} from 'react';
import ModulCard from '../../components/modal/modul/modulCard.tsx';
import PageBreadcrumb from '../../components/common/PageBreadCrumb.tsx';
import PageMeta from '../../components/common/PageMeta.tsx';
import {getModulByState, Modul } from '../../services/modul/modulService.tsx';



export default function ModulListPage() {
    const [modulList, setModulList] = useState<Modul[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getModulByState("EBOOK");
                setModulList(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, ["EBOOK"]);


    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><p>Memuat data</p></div>;
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
