import { useState, useEffect, useCallback } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import MateriPokokModal from '../../components/materiPokokForm';
import TextEditor from '../../components/TextEditor';

// --- KONSTANTA ---
// Best practice: Hindari 'magic strings', definisikan URL di satu tempat.
const API_BASE_URL = import.meta.env.VITE_PATH_API;

// --- INTERFACES ---
// Perbaikan: Menggunakan camelCase untuk properti di dalam aplikasi (konvensi standar).
interface MateriPokok {
    id: string;
    namaJabatan: string; // Diubah dari Namajabatan
    tugasJabatan: string[]; // Diubah dari Tugasjabatan
    keterampilan: string[]; // Diubah dari Keterampilan
    klasifikasi: string; // Diubah dari Klasifikasi
}

// Interface ini tetap sama karena merepresentasikan respons dari API (snake_case)
interface MateriPokokAPI {
    id: string;
    nama_jabatan: string;
    tugas_jabatan: string[];
    keterampilan: string[];
    klasifikasi: string;
}

interface PromtAPI {
    id:string;
    model: string;
}

interface SubMateri {
    sub_materi_pokok: string;
    list_materi: string[];
}

interface Materi {
    materi_pokok: string;
    list_sub_materi: SubMateri[];
}

interface OutlineData {
    nama_jabatan: string;
    outline: {
        list_materi: Materi[];
    };
}

// --- FUNGSI HELPER ---
// Tidak ada perubahan signifikan, hanya menghapus parameter 'index' yang tidak digunakan.
const transformOutlineToHtml = (data: OutlineData | null): string => {
    if (!data?.outline?.list_materi) {
        return '';
    }

    let htmlString = `<h1>${data.nama_jabatan}</h1>`;
    htmlString += `<h2>Hasil Outline Materi</h2>`;

    // Perbaikan: Menghapus 'index' karena tidak pernah digunakan (menghilangkan error TS6133)
    const listMateriHtml = data.outline.list_materi.map((materi) => {
        const subMateriHtml = materi.list_sub_materi.map((subMateri) => {
            const itemListHtml = subMateri.list_materi.map(item => `<li>${item}</li>`).join('');
            return `
        <li>
          <strong>${subMateri.sub_materi_pokok}</strong>
          <ul>${itemListHtml}</ul>
        </li>
      `;
        }).join('');

        return `
      <li>
        <strong>${materi.materi_pokok}</strong>
        <ul>${subMateriHtml}</ul>
      </li>
    `;
    }).join('');

    htmlString += `<ol>${listMateriHtml}</ol>`;
    return htmlString;
};

// --- KOMPONEN UTAMA ---
export default function OutlineGenerator() {
    // States
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedMateri, setSelectedMateri] = useState<MateriPokok | null>(null);
    const [materiList, setMateriList] = useState<MateriPokok[]>([]);
    const [loadingMateri, setLoadingMateri] = useState<boolean>(true);
    const [errorMateri, setErrorMateri] = useState<string | null>(null);
    const [modelList, setModelList] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [loadingModels, setLoadingModels] = useState<boolean>(true);
    const [errorModels, setErrorModels] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [outlineStatus, setOutlineStatus] = useState<'idle' | 'loading' | 'found' | 'not_found' | 'error'>('idle');
    const [outlineHtmlContent, setOutlineHtmlContent] = useState<string>('');

    // Dihapus: State `generatedOutline`, `isSaving`, dan `setIsSaving` tidak pernah digunakan.
    // const [generatedOutline, setGeneratedOutline] = useState<OutlineData | null>(null);
    // const [isSaving, setIsSaving] = useState<boolean>(false);

    // --- EFFECTS ---
    // Fetch data Materi Pokok
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/materi-pokok/`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (result?.data && Array.isArray(result.data)) {
                    // Perbaikan: Mengubah properti ke camelCase saat transformasi
                    const transformedData: MateriPokok[] = result.data.map((item: MateriPokokAPI) => ({
                        id: item.id,
                        namaJabatan: item.nama_jabatan,
                        tugasJabatan: item.tugas_jabatan,
                        keterampilan: item.keterampilan,
                        klasifikasi: item.klasifikasi,
                    }));
                    setMateriList(transformedData);
                } else {
                    throw new Error('Format data materi tidak sesuai');
                }
            } catch (e: any) {
                setErrorMateri(e.message);
            } finally {
                setLoadingMateri(false);
            }
        };
        fetchData();
    }, []);

    // Fetch data Model
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/model`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (result?.data && Array.isArray(result.data)) {
                    const allModels = result.data.map((item: PromtAPI) => item.model);
                    const uniqueModels = Array.from(new Set(allModels)) as string[];
                    setModelList(uniqueModels);
                    if (uniqueModels.length > 0) {
                        setSelectedModel(uniqueModels[0]);
                    }
                } else {
                    throw new Error('Format data promt tidak sesuai');
                }
            } catch (e: any) {
                setErrorModels(e.message);
            } finally {
                setLoadingModels(false);
            }
        };
        fetchModels();
    }, []);

    // Fetch outline yang sudah ada saat materi dipilih
    useEffect(() => {
        const fetchExistingOutline = async () => {
            if (!selectedMateri) {
                setOutlineStatus('idle');
                setOutlineHtmlContent('');
                return;
            }

            setOutlineStatus('loading');
            setGenerationError(null);

            try {
                const response = await fetch(`${API_BASE_URL}/outline/${selectedMateri.id}`);
                if (response.status === 404) {
                    setOutlineStatus('not_found');
                    setOutlineHtmlContent('');
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data. Status: ${response.status}`);
                }
                const result = await response.json();

                if (result.data?.outline?.list_materi?.length > 0) {
                    setOutlineHtmlContent(transformOutlineToHtml(result.data));
                    setOutlineStatus('found');
                } else {
                    setOutlineHtmlContent('');
                    setOutlineStatus('not_found');
                }
            } catch (error: any) {
                setGenerationError(error.message);
                setOutlineStatus('error');
                setOutlineHtmlContent('');
            }
        };
        fetchExistingOutline();
    }, [selectedMateri]);

    // --- HANDLERS ---
    const handleSelectMateri = useCallback((materi: MateriPokok) => {
        setSelectedMateri(materi);
        setIsModalOpen(false);
    }, []);

    const handleGenerateOutline = async () => {
        if (!selectedMateri) {
            alert("Silakan pilih Materi Pokok terlebih dahulu.");
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);
        setOutlineHtmlContent('');

        try {
            // Langkah 1: Kirim request POST untuk men-trigger proses generate
            await fetch(`${API_BASE_URL}/outline/${selectedMateri.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nama_jabatan: selectedMateri.namaJabatan, // Diubah ke camelCase
                    tugas_jabatan: selectedMateri.tugasJabatan, // Diubah ke camelCase
                    keterampilan: selectedMateri.keterampilan,
                    klasifikasi: selectedMateri.klasifikasi,
                    model: selectedModel,
                }),
            });

            // Langkah 2: Ambil data yang baru saja di-generate
            const getResponse = await fetch(`${API_BASE_URL}/outline/${selectedMateri.id}`);
            if (!getResponse.ok) {
                throw new Error(`Gagal mengambil data outline setelah generate. Status: ${getResponse.status}`);
            }

            const result = await getResponse.json();
            setOutlineHtmlContent(transformOutlineToHtml(result.data));
            setOutlineStatus('found');

        } catch (error: any) {
            setGenerationError(error.message || 'Terjadi kesalahan yang tidak diketahui.');
            setOutlineStatus('error');
        } finally {
            setIsGenerating(false);
        }
    };

    // Callback untuk menangani perubahan dari TextEditor
    const handleEditorChange = useCallback((content: string) => {
        setOutlineHtmlContent(content);
    }, []);

    // --- RENDER LOGIC ---
    if (loadingMateri || loadingModels) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-500">Memuat data konfigurasi...</p>
            </div>
        );
    }

    if (errorMateri || errorModels) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-50">
                <p className="text-lg text-red-600">Terjadi kesalahan: {errorMateri || errorModels}</p>
            </div>
        );
    }

    // --- JSX ---
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <PageMeta title="Outline Generator" description="Generate outline materi seleksi SKB-CPNS." />
            <PageBreadcrumb pageTitle="Outline Generator" />

            <div className="flex flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:flex-row xl:p-8">
                <div className="flex-1">
                    {/* Form Input */}
                    <div className="mb-5 grid grid-cols-1 gap-6 sm:grid-cols-12">
                        <div className="sm:col-span-7">
                            <label htmlFor="materi-pokok" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Materi Pokok
                            </label>
                            <div
                                id="materi-pokok"
                                onClick={() => setIsModalOpen(true)}
                                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            >
                                {selectedMateri ? (
                                    <span className="text-gray-900 dark:text-white">{selectedMateri.namaJabatan}</span> // Diubah ke camelCase
                                ) : (
                                    <span className="text-gray-400">Pilih atau Buat Materi ...</span>
                                )}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="model" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Model
                            </label>
                            <select
                                id="model"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            >
                                {modelList.length === 0 ? (
                                    <option disabled>Tidak ada model</option>
                                ) : (
                                    modelList.map((model) => (
                                        <option key={model} value={model}>
                                            {model}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="sm:col-span-2 flex items-end">
                            <button
                                onClick={handleGenerateOutline}
                                disabled={!selectedMateri || isGenerating}
                                className="w-full shrink-0 rounded-lg bg-gray-900 px-5 py-3 text-center font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:disabled:bg-gray-600 md:w-auto"
                            >
                                {isGenerating ? 'Membuat...' : 'Generate Outline'}
                            </button>
                        </div>
                    </div>

                    {/* Output Area */}
                    <div className="mb-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800/20">
                        {(() => {
                            if (isGenerating || outlineStatus === 'loading') {
                                return (
                                    <div className="flex min-h-[500px] w-full items-center justify-center">
                                        <div className="text-center">
                                            {/* SVG Loader */}
                                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {isGenerating ? 'Membuat outline...' : 'Memeriksa outline...'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }

                            switch (outlineStatus) {
                                case 'found':
                                    return (
                                        <div className="bg-gray-200 rounded-lg p-1">
                                            <TextEditor
                                                initialValue={outlineHtmlContent}
                                                onEditorChange={handleEditorChange}
                                            />
                                        </div>
                                    );
                                case 'not_found':
                                    return (
                                        <div className="flex min-h-[500px] w-full items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">📝 Outline Belum Dibuat</p>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Silakan klik tombol <strong>'Generate Outline'</strong> untuk membuatnya.
                                                </p>
                                            </div>
                                        </div>
                                    );
                                case 'error':
                                    return (
                                        <div className="flex min-h-[500px] w-full items-center justify-center">
                                            <div className="text-center text-red-600 dark:text-red-500">
                                                <p><strong>Gagal Memuat Outline</strong></p>
                                                <p className="text-sm mt-1">{generationError}</p>
                                            </div>
                                        </div>
                                    );
                                case 'idle':
                                default:
                                    return (
                                        <div className="flex min-h-[500px] w-full items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Pilih Materi Pokok untuk memulai.
                                                </p>
                                            </div>
                                        </div>
                                    );
                            }
                        })()}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <MateriPokokModal
                    materiList={materiList}
                    onClose={() => setIsModalOpen(false)}
                    onSelectMateri={handleSelectMateri}
                />
            )}
        </div>
    );
}