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
        <div className="min-h-screen bg-gray-50 p-4 pb-48 dark:bg-gray-900 md:p-6 lg:p-8">
            <div className="w-full">
                <PageMeta
                    title="Buat Materi"
                    description="Lihat semua materi pokok yang telah dibuat."
                />

                <PageBreadcrumb pageTitle="Modul" />
            </div>
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
            <button onClick={() => setIsModalOpen(true)} className="w-full mt-5 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                + Tambah Materi
            </button>

            {selectedModulIds.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 md:justify-between">
                        <div className="text-center md:text-left">
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedModulIds.length}</span> modul terpilih
                            </p>
                            <p className="text-xs text-gray-500">
                                ({selectedDraftIds.length} Draft, {selectedCompletedIds.length} Completed)
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-48"
                                >
                                    {modelList.length === 0 && <option>Memuat model...</option>}
                                    {modelList.map(model => <option key={model} value={model}>{model}</option>)}
                                </select>
                            </div>
                            <button onClick={handleGenerateOutline} disabled={selectedDraftIds.length === 0|| isGeneratingOutline} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70">
                                Generate Outline ({selectedDraftIds.length})
                            </button>
                            <button onClick={handleGenerateEbook} disabled={selectedCompletedIds.length === 0||isGeneratingEbook} className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70 dark:bg-green-600 dark:hover:bg-green-700">
                                Generate Ebook ({selectedCompletedIds.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
    );
}
