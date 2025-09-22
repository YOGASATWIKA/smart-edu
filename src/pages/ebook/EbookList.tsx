import PageBreadcrumb from '../../components/common/PageBreadCrumb.tsx';
import PageMeta from '../../components/common/PageMeta.tsx';
import ModulCard from "../../components/modulCard.tsx";
import AddMateriModal from "../../components/addMateriModel.tsx";
import ModulDetail from "../../components/modulDetail.tsx";
import {useCallback, useEffect, useState} from "react";
import {getAllEbook, getModulById, Modul} from "../../services/modul/modulService.tsx";
import {fetchModels} from "../../services/model/modelService.tsx";

export default function EbookList() {
    const [modulList, setModulList] = useState<Modul[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModulIds] = useState<string[]>([]);
    const [detailModul, setDetailModul] = useState<Modul | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const fetchModulData = useCallback(async () => {
        try {
            const data = await getAllEbook();
            setModulList(data);
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data modul');
        }
    }, []);

    // Efek untuk memuat semua data awal saat komponen pertama kali dirender
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [modulData] = await Promise.all([
                    getAllEbook(),
                    fetchModels()
                ]);

                setModulList(modulData);
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleViewDetail = async (modulId: string) => {
        setDetailModul(null); // Kosongkan data lama
        setDetailError(null);
        setIsDetailLoading(true);

        try {
            const data = await getModulById(modulId);
            setDetailModul(data);
        } catch (err: any) {
            setDetailError(err.message || "Gagal mengambil detail modul.");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCloseDetailModal = () => {
        setDetailModul(null);
        setDetailError(null);
    };

    // Tampilan saat loading
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><p>Memuat data awal...</p></div>;
    }

    // Tampilan saat error
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
                                    isSelected={selectedModulIds.includes(modul._id)}
                                    onViewDetail={() => handleViewDetail(modul._id)}
                                    isDisabled={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <p className="text-gray-500">Belum ada modul yang tersedia. Silakan buat materi baru.</p>
                        </div>
                    )}

                </main>
                <AddMateriModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchModulData}
                />
                {(isDetailLoading || detailModul || detailError) && (
                    <ModulDetail
                        materi={detailModul}
                        isLoading={isDetailLoading}
                        error={detailError}
                        onClose={handleCloseDetailModal} onUpdateSuccess={function (): void {
                        throw new Error("Function not implemented.");
                    }}                />
                )}
            </div>
        </>
    );
}