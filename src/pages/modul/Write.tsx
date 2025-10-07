import {useState, useEffect, useCallback, FormEvent, useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddMateriModal from '../../components/modul';
import EditableOutlineDisplay from '../../components/updateModulOutline';
import { getModulByState, Modul, generateOutlines, updateModulOutline, Outline } from '../../services/modul/modulService';
import { generateEbooks } from '../../services/ebook/ebookService';
import {getModelOutline, Model} from '../../services/model/modelService';

export default function Write() {
    // --- STATE MANAGEMENT ---
    const [modulList, setModulList] = useState<Modul[]>([]);
    const [modelList, setModelList] = useState<Model[]>([]);
    const [selectedModulId, setSelectedModulId] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isGeneratingOutline, setIsGeneratingOutline] = useState<boolean>(false);
    const [isGeneratingEbook, setIsGeneratingEbook] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddMateriModalOpen, setIsAddMateriModalOpen] = useState<boolean>(false);

    // State untuk panel kanan (display)
    const [viewingModulId, setViewingModulId] = useState<string | null>(null);

    const navigate = useNavigate();

    // --- DATA FETCHING & LOGIC ---
    const fetchData = useCallback(async () => {
        setIsInitialLoading(true);
        setError(null);
        try {
            const [modules, models] = await Promise.all([ getModulByState('MODUL'), getModelOutline('OUTLINE') ]);
            setModulList(modules);
            setModelList(models);

            // Set default selection jika belum ada yang terpilih
            if (modules.length > 0 && selectedModulId === '') {
                setSelectedModulId(modules[0]._id);
            }
            if (models.length > 0 && selectedModel === '') {
                setSelectedModel(models[0].model);
            }
        } catch (err: any) {
            const errorMessage = 'Gagal memuat data awal.';
            setError(errorMessage);
            Swal.fire({ icon: 'error', title: 'Kesalahan', text: errorMessage });
            console.error(errorMessage, ':', err.message);
        } finally {
            setIsInitialLoading(false);
        }
    }, [selectedModulId, selectedModel]); // useCallback dependencies

    useEffect(() => {
        fetchData();
    }, []);

    const selectedModul = useMemo(() => {
        return modulList.find(m => m._id === selectedModulId);
    }, [modulList, selectedModulId]);

    useEffect(() => {
        const hasOutline = (selectedModul?.outline?.list_materi?.length ?? 0) > 0;

        if (selectedModul && hasOutline) {
            setViewingModulId(selectedModul._id);
        } else {
            setViewingModulId(null);
        }
    }, [selectedModul]); // Efek ini hanya bergantung pada hasil 'selectedModul'
    // --- EVENT HANDLERS ---
    const handleGenerate = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedModulId || !selectedModel) return;

        setIsGeneratingOutline(true);
        setError(null);
        setViewingModulId(null); // Sembunyikan editor lama saat proses generate

        Swal.fire({ title: 'Membuat Outline...', html: 'AI sedang bekerja, mohon tunggu.', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        try {
            await generateOutlines([selectedModulId], selectedModel);
            Swal.close();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Outline telah dibuat.' });
            await fetchData(); // Ambil data terbaru, ini akan otomatis menampilkan outline baru
        } catch (err: any) {
            const errorMessage = 'Gagal membuat outline.';
            Swal.fire({ icon: 'error', title: 'Oops... Terjadi Kesalahan', text: errorMessage });
            setError(errorMessage);
            console.error(errorMessage, ':', err.message);
        } finally {
            setIsGeneratingOutline(false);
        }
    }, [selectedModulId, selectedModel, fetchData]);

    const handleSaveChanges = useCallback(async (modulId: string, updatedOutline: Outline) => {
        Swal.fire({ title: 'Menyimpan Perubahan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            await updateModulOutline(modulId, updatedOutline);
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Perubahan telah disimpan.' });
        } catch (err: any) {
            const errorMessage = 'Gagal menyimpan outline.';
            Swal.fire({ icon: 'error', title: 'Oops... Terjadi Kesalahan', text: errorMessage });
            console.error(errorMessage, ':', err.message);
        }
    }, []);

    const handleGenerateEbook = useCallback(async (modulId: string) => {
        setIsGeneratingEbook(true);
        try {
            navigate('/ebook', { state: { moduleId: modulId, isGenerating: true } });
            await generateEbooks([modulId], selectedModel);
        } catch (err: any) {
            setIsGeneratingEbook(false);
            const errorMessage = 'Gagal memulai pembuatan Ebook.';
            Swal.fire({ icon: 'error', title: 'Kesalahan', text: errorMessage });
            console.error(errorMessage, ":", err.message);
        }
    }, [navigate, selectedModel]);

    // --- RENDER LOGIC ---
    const renderDisplayPanel = () => {
        if (isGeneratingOutline) {
            return <div className="flex items-center justify-center min-h-[70vh]"><p className="text-gray-500">AI sedang membuat outline...</p></div>;
        }
        if (error) {
            return <div className="flex items-center justify-center min-h-[70vh] text-red-500"><p>{error}</p></div>;
        }
        if (viewingModulId) {
            return (
                <EditableOutlineDisplay
                    modulId={viewingModulId}
                    onSave={handleSaveChanges}
                    onGenerateEbook={handleGenerateEbook}
                    isEbookLoading={isGeneratingEbook}
                />
            );
        }
        return (
            <div className="flex items-center justify-center min-h-[70vh] w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500">Pilih modul dan klik "Generate Outline" untuk memulai, atau hasil akan muncul di sini jika sudah ada.</p>
            </div>
        );
    };

    return (
        <>
            <PageMeta title="Write - SmartEdu" description="Buat dan edit kerangka tulisan (outline) untuk modul." />
            <PageBreadcrumb pageTitle="Write" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel Kiri */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create Outline</h2>
                            <form onSubmit={handleGenerate} className="space-y-5">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="modul" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modul Pembelajaran</label>
                                        <button type="button" onClick={() => setIsAddMateriModalOpen(true)} className="text-xs text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 font-semibold">
                                            + Baru
                                        </button>
                                    </div>
                                    <select
                                        id="modul"
                                        value={selectedModulId}
                                        onChange={(e) => setSelectedModulId(e.target.value)}
                                        disabled={isInitialLoading || isGeneratingOutline}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        {isInitialLoading ? (<option>Memuat modul...</option>) : (
                                            modulList.map(modul => (
                                                <option key={modul._id} value={modul._id}>{modul.materi_pokok.nama_jabatan}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                                    <select
                                        id="model"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={isInitialLoading || isGeneratingOutline}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        {isInitialLoading ? (<option>Memuat model...</option>) : (
                                            modelList.map(model => (<option key={model.model} value={model.model}>{model.model}</option>))
                                        )}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isInitialLoading || isGeneratingOutline || !selectedModulId}
                                    className="w-full rounded-lg bg-sky-600 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:bg-sky-400 disabled:cursor-not-allowed dark:focus:ring-sky-800"
                                >
                                    {isGeneratingOutline ? 'Sedang Membuat...' : 'Generate Outline'}
                                </button>
                            </form>
                        </div>
                    </div>
                </aside>

                {/* Panel Kanan */}
                <main className="lg:col-span-2">
                    {renderDisplayPanel()}
                </main>
            </div>

            <AddMateriModal
                isOpen={isAddMateriModalOpen}
                onClose={() => setIsAddMateriModalOpen(false)}
                onSuccess={() => {
                    setIsAddMateriModalOpen(false);
                    fetchData(); // Panggil refetch setelah modal sukses
                }}
            />
        </>
    );
}