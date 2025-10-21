import React, { useEffect, useState } from 'react';
import { getModelByStatus, getModelOutlineDetail, Model } from '../../services/model/modelService.tsx';
import ModelCard from "../../components/modal/model/model_card.tsx";
import PageBreadcrumb from '../../components/common/PageBreadCrumb.tsx';
import PageMeta from '../../components/common/PageMeta.tsx';
import { PlusCircleIcon } from "lucide-react";
import CreateModelForm from "../../components/modal/model/create_model.tsx";
import ModelDetailModal from "../../components/modal/model/model_detail_modal.tsx";

const ModelListPage: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [modelDetails, setModelDetails] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
useEffect(() => {
    const fetchModels = async () => {
        try {
            setIsLoading(true);
            const data = await getModelByStatus('ALL');
            setModels(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            setIsLoading(false);
        }
    };

    fetchModels();
}, []);

const handleViewPrompt = async (model: Model) => {
    try {
        setSelectedModel(model);
        setIsDetailOpen(true);
        const details = await getModelOutlineDetail(model.model);
        setModelDetails(details);
    } catch (err) {
        console.error(err);
        setModelDetails([]);
    }
};

return (
    <>
        <PageMeta title="Model" description="Lihat semua model prompt yang tersedia." />
        <PageBreadcrumb pageTitle="Model" />

        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Daftar Model</h1>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow transition-all"
            >
                <PlusCircleIcon size={18} />
                Buat Model
            </button>
        </div>

        {isOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Buat Model Baru
                    </h2>
                    <CreateModelForm />
                </div>
            </div>
        )}

        {isDetailOpen && selectedModel && (
            <ModelDetailModal
                model={selectedModel}
                details={modelDetails}
                onClose={() => setIsDetailOpen(false)}
            />
        )}

        <div className=" bg-gray-50 dark:bg-gray-900">
            <main>
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        Memuat data...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-20">{error}</div>
                ) : models.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {models.map((model) => (
                            <ModelCard
                                key={model.id}
                                modelData={model}
                                onViewPrompt={() => handleViewPrompt(model)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            Belum ada model yang tersedia. Silakan buat model baru.
                        </p>
                    </div>
                )}
            </main>
        </div>
    </>
);
};

export default ModelListPage;
