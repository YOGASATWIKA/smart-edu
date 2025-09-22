import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchModels } from '../../services/model/modelService';
import ModulCard from '../../components/modulCard.tsx';
import AddMateriModal from '../../components/addMateriModel.tsx';
import {generateOutlines} from '../../services/modul/modulService';
import {generateEbooks} from '../../services/ebook/ebookService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { getAllModul, getModulById, Modul } from '../../services/modul/modulService';
import ModulDetail from "../../components/modulDetail.tsx";



export default function ModulListPage() {
    const [modulList, setModulList] = useState<Modul[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModulIds, setSelectedModulIds] = useState<string[]>([]);
    const [modelList, setModelList] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
    const [isGeneratingEbook, setIsGeneratingEbook] = useState(false);
    const [detailModul, setDetailModul] = useState<Modul | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const fetchModulData = useCallback(async () => {
        try {
            const data = await getAllModul();
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
                // Ambil data modul dan model secara bersamaan untuk efisiensi
                const [modulData, modelsData] = await Promise.all([
                    getAllModul(),
                    fetchModels()
                ]);

                setModulList(modulData);
                setModelList(modelsData);

                // Set model pertama sebagai default jika tersedia
                if (modelsData.length > 0) {
                    setSelectedModel(modelsData[0]);
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []); // Dependency array kosong agar hanya berjalan sekali

    const { selectedDraftIds, selectedCompletedIds } = useMemo(() => {
        const drafts: string[] = [];
        const outline: string[] = [];

        selectedModulIds.forEach(id => {
            const modul = modulList.find(m => m._id === id);
            if (modul) {
                if (modul.state === 'DRAFT') drafts.push(id);
                else if (modul.state === 'OUTLINE') outline.push(id);
            }
        });
        return { selectedDraftIds: drafts, selectedCompletedIds: outline };
    }, [selectedModulIds, modulList]);

    const handleSelectModul = (clickedId: string) => {
        setSelectedModulIds(prevIds =>
            prevIds.includes(clickedId)
                ? prevIds.filter(id => id !== clickedId) // Hapus jika sudah ada (deselect)
                : [...prevIds, clickedId] // Tambah jika belum ada (select)
        );
    };

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

    const handleGenerateOutline = async () => {
        if (selectedDraftIds.length === 0) return;

        setIsGeneratingOutline(true); // Mulai loading
        try {
            await generateOutlines(selectedDraftIds, selectedModel);
            alert(`Permintaan untuk generate outline ${selectedDraftIds.length} modul berhasil dikirim! Halaman akan dimuat ulang.`);

            // Kosongkan pilihan dan muat ulang data untuk melihat perubahan status
            setSelectedModulIds([]);
            fetchModulData();
        } catch (err: any) {
            // Tampilkan pesan error jika gagal
            alert(`Error: ${err.message}`);
        } finally {
            // Hentikan loading, baik berhasil maupun gagal
            setIsGeneratingOutline(false);
        }
    };

    const handleGenerateEbook = async () => {
        if (selectedCompletedIds.length === 0) return;

        setIsGeneratingEbook(true); // Mulai loading
        try {
            await generateEbooks(selectedCompletedIds, selectedModel);
            alert(`Permintaan untuk generate ebook ${selectedCompletedIds.length} modul berhasil dikirim!`);

            setSelectedModulIds([]);
            fetchModulData();
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsGeneratingEbook(false); // Hentikan loading
        }
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
            title="Buat Materi"
            description="Lihat semua materi pokok yang telah dibuat."
        />
        <PageBreadcrumb pageTitle="Modul" />

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main>
                {modulList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {modulList.map((modul) => (
                            <ModulCard
                                key={modul._id}
                                modul={modul}
                                isSelected={selectedModulIds.includes(modul._id)}
                                onSelect={handleSelectModul}
                                onViewDetail={() => handleViewDetail(modul._id)}
                                isDisabled={false}                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500">Belum ada modul yang tersedia. Silakan buat materi baru.</p>
                    </div>
                )}

            </main>

                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-4">

                        {/* Bagian Kiri: Informasi Jumlah yang Dipilih */}
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white ring-2 ring-white dark:ring-gray-800">
                        {selectedModulIds.length}
                    </span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    Modul Terpilih
                                </p>
                                <p className="text-xs text-gray-500">
                                    {selectedDraftIds.length} Draft, {selectedCompletedIds.length} Completed
                                </p>
                            </div>
                        </div>

                        {/* Bagian Kanan: Semua Tombol Aksi */}
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <span>Tambah Materi</span>
                            </button>

                            {/* Grup Aksi Generate (Terkait dengan item yang dipilih) */}
                            <div className="flex items-center gap-5 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="min-w-36 rounded-md border-gray-300 bg-white py-2 pr-8 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    {modelList.length === 0 && <option>Memuat...</option>}
                                    {modelList.map(model => <option key={model} value={model}>{model}</option>)}
                                </select>

                                <button
                                    onClick={handleGenerateOutline}
                                    disabled={selectedDraftIds.length === 0 || isGeneratingOutline}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    <span>Generate Outline</span>
                                    <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold text-blue-800">{selectedDraftIds.length}</span>
                                </button>

                                <button
                                    onClick={handleGenerateEbook}
                                    disabled={selectedCompletedIds.length === 0 || isGeneratingEbook}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    <span>Generate Ebook</span>
                                    <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-bold text-green-800">{selectedCompletedIds.length}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>


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
