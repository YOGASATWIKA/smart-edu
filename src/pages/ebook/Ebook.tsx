// src/pages/EbookViewerPage.tsx

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Ebook, getEbookById } from '../../services/ebook/ebookService';
import {LoadingSpinner} from '../../components/loadingSpinner.tsx';
import Swal from "sweetalert2";

export default function EbookViewerPage() {
    const location = useLocation();
    const id = location.state?.moduleId;
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isGenerating = location.state?.isGenerating;

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            const errorMessage = 'ID Modul tidak ditemukan. Silakan kembali dan pilih modul.';
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: errorMessage,
            });
            return;
        }

        let intervalId: NodeJS.Timeout;
        const fetchEbook = async () => {
            try {
                const data = await getEbookById(id);
                setEbook(data);
                setIsLoading(false);
                if (intervalId) clearInterval(intervalId);
                return true;
            } catch (err: any) {
                if (!err.message.toLowerCase().includes("tidak ditemukan")) {
                    setError(err.message);
                    setIsLoading(false);
                    if (intervalId) clearInterval(intervalId);
                }
                return false;
            }
        };

        if (isGenerating) {
            setIsLoading(true);
            setError(null);

            let attempts = 0;
            const maxAttempts = 144;

            intervalId = setInterval(async () => {
                attempts++;
                console.log(`Mencoba mengambil Ebook, percobaan ke-${attempts}...`);
                const found = await fetchEbook();
                if (found || attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    if (!found) {
                        const errorMessage = 'Proses generate memakan waktu terlalu lama atau gagal. Silakan coba lagi nanti.';
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops... Terjadi Kesalahan',
                            text: errorMessage,
                        });
                        setIsLoading(false);
                    }
                }
            }, 10000);

        } else {
            fetchEbook();
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };

    }, [id, isGenerating]);

    if (isLoading) {
        return <LoadingSpinner isGenerating={isGenerating} />;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    if (!ebook) {
        return <div className="p-8 text-center">Ebook tidak ditemukan.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                {/* Judul Utama Ebook */}
                <header className="text-center border-b pb-6 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">{ebook.title}</h1>
                </header>

                <main className="space-y-12">
                    {/* Looping untuk setiap BAB (Part) */}
                    {ebook.parts.map((part, partIndex) => (
                        <section key={partIndex}>
                            <h2 className="text-3xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-4 mb-4">
                                Bab {partIndex + 1}: {part.subject}
                            </h2>

                            {/* Looping untuk setiap SUB-BAB (Chapter) */}
                            {part.chapters.map((chapter, chapterIndex) => (
                                <article key={chapterIndex} className="mt-8 pl-6">
                                    <h3 className="text-2xl font-semibold text-gray-700">
                                        {partIndex + 1}.{chapterIndex + 1} {chapter.title}
                                    </h3>

                                    {/* Looping untuk setiap MATERI (Material) */}
                                    {chapter.materials.map((material, matIndex) => (
                                        <div key={matIndex} className="mt-6 pl-4 border-l-2 border-gray-200">
                                            <h4 className="text-xl font-medium text-gray-600">{material.title}</h4>
                                            <p className="mt-2 text-gray-700 italic">"{material.short}"</p>

                                            {/* Looping untuk setiap DETAIL (Detail) */}
                                            {material.details.map((detail, detailIndex) =>(
                                                <div key={detailIndex} className="mt-4 prose max-w-none">
                                                    <p>{detail.content}</p>
                                                    <p>{detail.expanded}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </article>
                            ))}
                        </section>
                    ))}
                </main>
            </div>
        </div>
    );
}