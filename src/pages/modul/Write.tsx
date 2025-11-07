import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddMateriModal from '../../components/modal/modul/modul.tsx';
import EditableOutlineDisplay from '../../components/modal/modul/updateModulOutline.tsx';
import EditableModul from '../../components/modal/modul/updateModul.tsx';
import {
    getModulByState,
    Modul,
    generateOutlines,
    updateModulOutline,
    updateModul,
    Outline,
    MateriPokok
} from '../../services/modul/modulService';
import { generateEbooks } from '../../services/ebook/ebookService';
import { getModelByStatus, Model } from '../../services/model/modelService';
import {LoadingSpinner} from "../../components/modal/ebook/loadingSpinner.tsx";
import {PencilIcon} from "../../icons";

export default function Write() {
    const [modulList, setModulList] = useState<Modul[]>([]);
    const [modelList, setModelList] = useState<Model[]>([]);
    const [selectedModulId, setSelectedModulId] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isGeneratingOutline, setIsGeneratingOutline] = useState<boolean>(false);
    const [isGeneratingEbook, setIsGeneratingEbook] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddMateriModalOpen, setIsAddMateriModalOpen] = useState<boolean>(false);
    const [newlyCreatedModulId, setNewlyCreatedModulId] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setError(null);
        try {
            const [modules, models] = await Promise.all([getModulByState('MODUL'), getModelByStatus('ACTIVE')]);
            setModulList(modules);
            setModelList(models);

            if (newlyCreatedModulId && modules.some(m => m._id === newlyCreatedModulId)) {
                setSelectedModulId(newlyCreatedModulId);
                setNewlyCreatedModulId(null);
            } else {
                if (modules.length > 0 && !selectedModulId) {
                    setSelectedModulId(modules[0]._id);
                }
            }

            if (models.length > 0 && selectedModel === '') {
                setSelectedModel(models[0].model);
            }
        } catch (err: any) {
            const errorMessage = 'Gagal memuat data.';
            setError(errorMessage);
            Swal.fire({ icon: 'error', title: 'Kesalahan', text: errorMessage });
        } finally {
            if (isInitialLoading) setIsInitialLoading(false);
        }
    }, [newlyCreatedModulId, selectedModel, selectedModulId, isInitialLoading]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!isInitialLoading && modelList.length > 0) {
            const defaultModel = modelList.find((m) => m.model === "Default");
            if (defaultModel) {
                setSelectedModel(defaultModel.model);
            }
        }
    }, [isInitialLoading, modelList]);

    const selectedModul = useMemo(() => {
        return modulList.find(m => m._id === selectedModulId);
    }, [modulList, selectedModulId]);

    useEffect(() => {
        if (!isInitialLoading && modulList.length > 0 && newlyCreatedModulId) {
            const exists = modulList.some((m) => m._id === newlyCreatedModulId);
            if (exists) {
                setSelectedModulId(newlyCreatedModulId);
                setNewlyCreatedModulId(null);
            }
        }
    }, [isInitialLoading, modulList, newlyCreatedModulId]);

    const hasOutline = useMemo(() =>
            (selectedModul?.outline?.list_materi?.length ?? 0) > 0,
        [selectedModul]
    );
    useEffect(() => {
        if (newlyCreatedModulId) {
            fetchData();
        }
    }, [newlyCreatedModulId]);

    const handleGenerateOutline = useCallback(async () => {
        if (!selectedModulId || !selectedModel) return;

        setIsGeneratingOutline(true);
        setError(null);
        try {
            await generateOutlines([selectedModulId], selectedModel);
            Swal.close();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Outline telah dibuat.' });
            await fetchData();
        } catch (err: any) {
            const errorMessage = 'Gagal membuat outline.';
            Swal.fire({ icon: 'error', title: 'Oops... Terjadi Kesalahan', text: errorMessage });
            setError(errorMessage);
        } finally {
            setIsGeneratingOutline(false);
        }
    }, [selectedModulId, selectedModel, fetchData]);

    const handleGenerateEbook = useCallback(async () => {
        if (!selectedModulId) return;
        setIsGeneratingEbook(true);
        try {
            navigate('/ebook', { state: { moduleId: selectedModulId, isGenerating: true } });
            await generateEbooks([selectedModulId], selectedModel);
        } catch (err: any) {
            setIsGeneratingEbook(false);
            const errorMessage = 'Gagal memulai pembuatan Ebook.';
            Swal.fire({ icon: 'error', title: 'Kesalahan', text: errorMessage });
        }finally {
            setIsGeneratingEbook(false);
        }
    }, [navigate, selectedModulId, selectedModel]);


    const handleSaveModul = useCallback(async (modulId: string, updatedMateriPokok: MateriPokok) => {
        Swal.fire({ title: 'Menyimpan Perubahan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            await updateModul(modulId, updatedMateriPokok);
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Perubahan telah disimpan.' });
        } catch (err: any) {
            const errorMessage = 'Gagal menyimpan outline.';
            Swal.fire({ icon: 'error', title: 'Oops... Terjadi Kesalahan', text: errorMessage });
        }
    }, []);

    const handleSaveOutline = useCallback(async (modulId: string, updatedOutline: Outline) => {
        Swal.fire({ title: 'Menyimpan Perubahan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            await updateModulOutline(modulId, updatedOutline);
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Perubahan telah disimpan.' });
        } catch (err: any) {
            const errorMessage = 'Gagal menyimpan outline.';
            Swal.fire({ icon: 'error', title: 'Oops... Terjadi Kesalahan', text: errorMessage });
        }
    }, []);

    const renderDisplayPanel = () => {
        if (isGeneratingOutline) {
            return (
                <LoadingSpinner isGenerating={isGeneratingOutline} />
            );
        }
        if (error && !hasOutline) {
            return <div className="flex items-center justify-center min-h-[70vh] text-red-500"><p>{error}</p></div>;
        }
        if (selectedModulId && hasOutline) {
            return (
                <EditableOutlineDisplay
                    key={selectedModulId}
                    modulId={selectedModulId}
                    onSave={handleSaveOutline}
                />
            );
        }
        return (
            <EditableModul
                key={selectedModulId}
                modulId={selectedModulId}
                onSave={handleSaveModul}
            />
            // <div className="flex items-center justify-center min-h-[70vh] w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            //     <p className="text-gray-500">Pilih modul dan klik "Generate Outline" untuk memulai, atau hasil akan muncul di sini jika sudah ada.</p>
            // </div>
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
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {hasOutline ? 'Generate Ebook' : 'Create Outline'}
                            </h2>
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
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
                                        disabled={isInitialLoading || isGeneratingOutline || isGeneratingEbook}
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
                                    <label
                                        htmlFor="model"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Model
                                    </label>

                                    <select
                                        id="model"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={isInitialLoading || isGeneratingOutline || isGeneratingEbook}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        {isInitialLoading ? (
                                            <option>Memuat model...</option>
                                        ) : (
                                            modelList.map((model) => (
                                                <option key={model.model} value={model.model}>
                                                    {model.model}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                {hasOutline ? (
                                    <button
                                        type="button"
                                        onClick={handleGenerateEbook}
                                        disabled={isInitialLoading || isGeneratingOutline || isGeneratingEbook || !selectedModulId}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 px-5 py-3 text-base font-semibold text-white shadow-md transition focus:outline-none focus:ring-4 focus:ring-teal-300 disabled:cursor-not-allowed disabled:bg-teal-400 dark:focus:ring-teal-800"
                                    >
                                        <PencilIcon className="w-6 h-6" />
                                        <span>{isGeneratingEbook ? 'Memulai Proses...' : 'Generate Ebook'}</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleGenerateOutline}
                                        disabled={isInitialLoading || isGeneratingOutline || !selectedModulId}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:bg-sky-400 disabled:cursor-not-allowed dark:focus:ring-sky-800"
                                    >
                                        <PencilIcon className="w-6 h-6" />
                                        <span>{isGeneratingOutline ? 'Sedang Membuat...' : 'Generate Outline'}</span>
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </aside>
                <main className="lg:col-span-2">
                    {renderDisplayPanel()}
                </main>
            </div>
            <AddMateriModal
                isOpen={isAddMateriModalOpen}
                onClose={() => setIsAddMateriModalOpen(false)}
                onSuccess={(newModul) => {
                    if (newModul?._id) {
                        setModulList(prev => [newModul, ...prev]);
                        setSelectedModulId(newModul._id);
                    }
                    setIsAddMateriModalOpen(false);
                }}
            />

        </>
    );
}