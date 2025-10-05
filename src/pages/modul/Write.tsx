import { useState, useEffect, FormEvent } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ModelConfigModal from '../../components/model';
import AddMateriModal from '../../components/modul';
import EditableOutlineDisplay from '../../components/updateModulOutline.tsx';
import { getModulByState, Modul, generateOutlines, updateModulOutline, Outline } from '../../services/modul/modulService';
import { generateEbooks } from '../../services/ebook/ebookService.tsx';
import { getModelOutline } from '../../services/model/modelService';
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';

export default function Write() {
    const [modulList, setModulList] = useState<Modul[]>([]);
    const [modelList, setModelList] = useState<string[]>([]);
    const [selectedModulId, setSelectedModulId] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isGeneratingEbook] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [viewingModulId, setViewingModulId] = useState<string | null>(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
    const [isAddMateriModalOpen, setIsAddMateriModalOpen] = useState<boolean>(false);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [modules, models] = await Promise.all([ getModulByState('MODUL'), getModelOutline() ]);
            setModulList(modules);
            setModelList(models);
            if (modules.length > 0) setSelectedModulId([modules[0]._id]);
            if (models.length > 0) setSelectedModel(models[0]);
        } catch (err: any) {
            const errorMessage = 'Gagal memuat data.';
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: errorMessage,
            });
            console.log(errorMessage,':', err.message);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (modulList.length === 0 || selectedModulId.length === 0) {
            setViewingModulId(null);
            return;
        }
        const currentModul = modulList.find(m => m._id === selectedModulId[0]);

        if (currentModul && currentModul.outline && currentModul.outline.list_materi && currentModul.outline.list_materi.length > 0) {
            setViewingModulId(currentModul._id);
        } else {
            setViewingModulId(null);
        }

    }, [selectedModulId, modulList]);

    const handleGenerate = async (e: FormEvent) => {
        e.preventDefault();
        if (selectedModulId.length === 0 || !selectedModel) return;
        setIsGenerating(true);
        setError(null);
        setViewingModulId(null);
        Swal.fire({
            title: 'Memproses Permintaan Anda',
            html: 'AI sedang membuat outline, mohon tunggu...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {
            await generateOutlines(selectedModulId, selectedModel);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Outline telah berhasil dibuat.',
            });
            setViewingModulId(selectedModulId[0]);
            fetchData();
        } catch (err: any) {
            const errorMessage = 'Gagal membuat outline.';
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: errorMessage,
            });
            console.log(errorMessage,':', err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveConfigAndGenerate = async (config: { model: string; role: string; instruction: string }) => {
        setIsGenerating(true);
        setError(null);
        setViewingModulId(null);
        setIsConfigModalOpen(false);
        try {
            await generateOutlines(selectedModulId, config.model);
            setViewingModulId(selectedModulId[0]);
            fetchData();
        } catch (err: any) {
            setError(err.message || 'Gagal membuat outline.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveChanges = async (modulId: string, updatedOutline: Outline) => {
        Swal.fire({
            title: 'Memproses Permintaan Anda',
            html: 'AI sedang membuat outline, mohon tunggu...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {
            await updateModulOutline(modulId, updatedOutline);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Outline telah berhasil disimpan.',
            });
        } catch (err: any) {
            const errorMessage = 'Gagal Menyimpan Outline';
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: errorMessage,
            });
            console.log(errorMessage,':', err.message);
        }
    };

    const navigate = useNavigate();

    const handleGenerateEbookAndNavigation = async (modulId: string) => {
        if (!selectedModel) {
            alert('Silakan pilih model AI terlebih dahulu di panel kiri.');
            return;
        }
        try {
            navigate('/ebook', { state: { moduleId: modulId, isGenerating: true } });
            await generateEbooks([modulId], selectedModel);
        } catch (err: any) {
            const errorMessage = 'Gagal Membuat Ebook';
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: errorMessage,
            });
            console.log("Gagal Membuat Ebook:", err.message);
        }
    };

    const selectedModulObject = modulList.find(m => m._id === selectedModulId[0]);

    return (
        <>
            <PageMeta title="Write - SmartEdu" description="Buat dan edit kerangka tulisan (outline) untuk modul." />
            <PageBreadcrumb pageTitle="Write" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create Outline</h2>

                            <form onSubmit={handleGenerate} className="space-y-5">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="modul" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Modul Pembelajaran
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddMateriModalOpen(true)}
                                            className="text-xs text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 font-semibold"
                                        >
                                            + Baru
                                        </button>
                                    </div>
                                    <select
                                        id="modul"
                                        value={selectedModulId[0] || ''} // Baca dari elemen pertama
                                        onChange={(e) => setSelectedModulId([e.target.value])} // Simpan sebagai array
                                        disabled={isLoading || isGenerating}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        {isLoading ? (<option>Memuat...</option>) : (
                                            modulList.map(modul => (
                                                <option key={modul._id} value={modul._id}>
                                                    {modul.materi_pokok.nama_jabatan}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                {/* Dropdown Model */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Model
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsConfigModalOpen(true)}
                                            disabled={selectedModulId.length === 0}
                                            className="text-xs text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Promt
                                        </button>
                                    </div>
                                    <select
                                        id="model"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={isLoading || isGenerating}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        {isLoading ? (
                                            <option>Memuat...</option>
                                        ) : (
                                            modelList.map(model => (
                                                <option key={model} value={model}>
                                                    {model}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || isGenerating || selectedModulId.length === 0} // Cek panjang array
                                    className="w-full rounded-lg bg-sky-600 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:bg-sky-400 disabled:cursor-not-allowed dark:focus:ring-sky-800"
                                >
                                    {isGenerating ? 'Sedang Membuat...' : 'Generate Outline'}
                                </button>
                            </form>
                        </div>
                    </div>
                </aside>

                {/* Panel Kanan untuk Menampilkan Hasil */}
                <main className="lg:col-span-2">
                    { isGenerating ? (
                        <div className="flex items-center justify-center min-h-[70vh]"><p>Membuat Outline...</p></div>
                    ) : error ? (
                        <div className="flex items-center justify-center min-h-[70vh] text-red-500"><p>{error}</p></div>
                    ) : viewingModulId ? (
                        <EditableOutlineDisplay
                            modulId={viewingModulId}
                            onSave={handleSaveChanges}
                            onGenerateEbook={handleGenerateEbookAndNavigation}
                            isEbookLoading={isGeneratingEbook}
                        />
                    ) : (
                        <div className="flex items-center justify-center min-h-[70vh] w-full rounded-xl border-2 border-dashed border-gray-300">
                            <p className="text-gray-500">Hasil outline akan muncul di sini.</p>
                        </div>
                    )}
                </main>
            </div>

            <AddMateriModal isOpen={isAddMateriModalOpen} onClose={() => setIsAddMateriModalOpen(false)} onSuccess={() => { setIsAddMateriModalOpen(false); fetchData(); }} />
            {/*<ModelConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} onSave={handleSaveConfigAndGenerate} selectedModul={selectedModulObject} />*/}
        </>
    );
};