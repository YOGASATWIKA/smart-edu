// // src/pages/ModelPage.tsx
//
// import { useState, useEffect } from 'react';
// import PageBreadcrumb from '../../components/common/PageBreadCrumb.tsx';
// import PageMeta from '../../components/common/PageMeta.tsx';
// import { getModelOutline, Model } from '../../services/model/modelService.tsx';
// import ModulCard from "../../components/ui/model/model_card.tsx";
// import PromptModal from "../../components/ui/model/promt_model.tsx";
//
// export default function ModelPage() {
//     const [modulList, setModulList] = useState<Model[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//
//     // State untuk mengontrol modal
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//     const [selectedModul, setSelectedModul] = useState<Model | null>(null);
//
//     const [filterStatus, setFilterStatus] = useState('ALL');
//
//     const fetchData = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const data = await getModelOutline(filterStatus);
//             setModulList(data);
//         } catch (err: any) {
//             setError(err.message || 'Gagal mengambil data');
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchData();
//     }, [filterStatus]);
//
//     // Handler untuk membuka modal saat tombol di kartu diklik
//     const handleOpenModal = (modul: Model) => {
//         setSelectedModul(modul);
//         setIsModalOpen(true);
//     };
//
//     // Handler untuk menutup modal
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedModul(null);
//     };
//
//     if (isLoading) {
//         return <div className="flex h-screen items-center justify-center"><p>Memuat data...</p></div>;
//     }
//
//     if (error) {
//         return <div className="flex h-screen items-center justify-center text-red-600"><p>Error: {error}</p></div>;
//     }
//
//     return (
//         <>
//             <PageMeta title="Ebook" description="Lihat semua materi pokok yang telah dibuat." />
//             <PageBreadcrumb pageTitle="Ebook" />
//
//             <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//                 <div className="flex flex-col items-center justify-end rounded-lg sm:flex-row pb-4">
//                     <div className="relative">
//                         <select
//                             id="status-filter"
//                             value={filterStatus}
//                             onChange={(e) => setFilterStatus(e.target.value)}
//                             className="min-w-36 rounded-md border-gray-300 bg-white py-2 pr-8 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//                         >
//                             <option value="ALL">All</option>
//                             <option value="OUTLINE">Outline</option>
//                             <option value="EBOOK">Ebook</option>
//                         </select>
//                     </div>
//                 </div>
//
//                 <main>
//                     {modulList.length > 0 ? (
//                         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                             {modulList.map((modul) => (
//                                 <ModulCard
//                                     key={modul._id}
//                                     model={modul}
//                                     onButtonClick={handleOpenModal} // Menggunakan handler untuk membuka modal
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="py-16 text-center">
//                             <p className="text-gray-500">Belum ada modul yang tersedia.</p>
//                         </div>
//                     )}
//                 </main>
//             </div>
//
//             {/* Render komponen modal di sini */}
//             <PromptModal
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 modul={selectedModul}
//             />
//         </>
//     );
// }

import React, { useEffect, useState } from 'react';
import { getModelOutline, Model, Promt } from '../../services/model/modelService.tsx'; // Sesuaikan path import
import ModelCard from "../../components/ui/model/model_card.tsx";
import PromptModal from "../../components/ui/model/promt_model.tsx";
import PageBreadcrumb from '../../components/common/PageBreadCrumb.tsx';
import PageMeta from '../../components/common/PageMeta.tsx';

const ModelListPage: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Promt | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setIsLoading(true);
                const data = await getModelOutline('ACTIVE');
                setModels(data);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Terjadi kesalahan yang tidak diketahui');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchModels();
    }, []);

    // Fungsi untuk membuka modal dan mengatur prompt yang dipilih
    const handleViewPrompt = (prompt: Promt) => {
        setSelectedPrompt(prompt);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPrompt(null);
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading data...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    }

    return (
                <>
            <PageMeta title="Model" description="Lihat semua materi pokok yang telah dibuat." />
            <PageBreadcrumb pageTitle="Model" />

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
                        {models.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {models.map((model) => (
                                    <ModelCard
                                        key={model._id}
                                        modelData={model}
                                        onViewPrompt={handleViewPrompt}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <p className="text-gray-500">Belum ada modul yang tersedia. Silakan buat materi baru.</p>
                            </div>
                        )}

                    </main>
                <PromptModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    prompt={selectedPrompt}
                />
            </div>
        </>
    );
};

export default ModelListPage;