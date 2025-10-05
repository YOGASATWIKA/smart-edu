import { useState, FormEvent, useEffect } from 'react';
import { getModelOutline } from '../services/model/modelService';
import type { Modul } from '../services/modul/modulService';
import Swal from "sweetalert2";

export interface ModelConfigPayload {
    model: string;
    promt: {
        system_prompt: string;
        user_prompts: string[];
    };
}

interface ModelConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: ModelConfigPayload) => Promise<void>;
    selectedModul?: Modul;
}

export default function ModelConfigModal({ isOpen, onClose, onSave, selectedModul }: ModelConfigModalProps) {
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [systemPrompt, setSystemPrompt] = useState<string>('');
    const [instruction, setInstruction] = useState<string>('');
    const [customInstructions, setCustomInstructions] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ... (useEffect dan fungsi lainnya tetap sama)
    useEffect(() => {
        if (isOpen) {
            const loadModels = async () => {
                setIsLoadingModels(true);
                try {
                    const models = await getModelOutline();
                    setAvailableModels(models);
                    if (models.length > 0) setSelectedModel(models[0]);
                } catch (err) {
                    // Anda bisa menampilkan error ke user di sini jika diperlukan
                    console.error('Gagal memuat model:', err);
                    setError('Gagal memuat daftar model dari server.');
                }
                finally { setIsLoadingModels(false); }
            };
            loadModels();

            if (selectedModul) {
                const generatedInstruction = `Apa kompetensi bidang/teknis yang harus dimiliki oleh seseorang dengan\nNama Jabatan: *${selectedModul.materi_pokok.nama_jabatan}*\nTugas Jabatan: *${selectedModul.materi_pokok.tugas_jabatan?.join(', ')}*\nKeterampilan: *${selectedModul.materi_pokok.keterampilan?.join(', ')}*\n\nBerdasarkan kompetensi tersebut, apa materi pokok yang perlu dipelajari...`;
                setInstruction(generatedInstruction);
            } else {
                const defaultInstructionPart1 = `Apa kompetensi bidang/teknis yang harus dimiliki oleh seseorang dengan...`;
                const defaultInstructionPart2 = `Berdasarkan kompetensi bidang/teknis tersebut, apa materi pokok yang perlu dipelajari...`;
                setInstruction(defaultInstructionPart1 + "\n\n" + defaultInstructionPart2);
            }
        } else {
            setCustomInstructions([]);
            setError(null);
        }
    }, [isOpen, selectedModul]);


    const handleAddInstruction = () => setCustomInstructions(prev => [...prev, '']);
    const handleCustomInstructionChange = (index: number, value: string) => {
        const updated = [...customInstructions];
        updated[index] = value;
        setCustomInstructions(updated);
    };
    const handleRemoveInstruction = (index: number) => setCustomInstructions(prev => prev.filter((_, i) => i !== index));


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        Swal.fire({
            title: 'Memproses Permintaan Anda',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        // --- PERUBAHAN ---
        // Membuat array user_prompts dari instruksi utama dan instruksi tambahan
        const userPrompts = [instruction, ...customInstructions].filter(Boolean);

        // --- PERUBAHAN ---
        // Membuat objek payload sesuai dengan struktur yang diinginkan API
        const payload: ModelConfigPayload = {
            model: selectedModel,
            promt: { // Sesuai dengan contoh output Anda, "promt" bukan "prompt"
                system_prompt: systemPrompt,
                user_prompts: userPrompts,
            }
        };

        try {
            // --- PERUBAHAN ---
            // Mengirim payload yang sudah terstruktur
            await onSave(payload);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Konfigurasi Model Berhasil Ditambahkan!',
            });
            onClose();
        } catch (err: any) {
            const errorMessage = 'Gagal menambahkan konfigurasi model';
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: errorMessage,
            });
            console.error(errorMessage, ':', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Konfigurasi Model</h2>
                <form onSubmit={handleSubmit}>
                    {/* Dropdown Model */}
                    <div className="mb-4">
                        <label htmlFor="model-select" className="block mb-2 text-sm font-medium text-gray-700">Model</label>
                        <select id="model-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={isLoadingModels || isSubmitting} className="w-full rounded-md border-gray-300">
                            {isLoadingModels ? <option>Loading...</option> : availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* Textarea Role / System Prompt */}
                    <div className="mb-4">
                        {/* --- PERUBAHAN --- */}
                        <label htmlFor="system-prompt" className="block mb-2 text-sm font-medium">Role (System Prompt)</label>
                        <textarea id="system-prompt" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={4} className="w-full rounded-md border-gray-300" />
                    </div>

                    {/* Textarea Instruction Utama */}
                    <div className="mb-4">
                        <label htmlFor="main-instruction" className="block mb-2 text-sm font-medium">Instruction (User Prompt #1)</label>
                        <textarea id="main-instruction" value={instruction.replace(/\\n/g, '\n')} rows={8} className="w-full rounded-md border-gray-300 bg-slate-50" readOnly />
                    </div>

                    {/* Bagian Instruksi Tambahan */}
                    <div className="mb-6">
                        {customInstructions.map((instr, index) => (
                            <div key={index} className="relative mt-2">
                                <textarea value={instr} onChange={(e) => handleCustomInstructionChange(index, e.target.value)} rows={3} className="w-full rounded-md border-gray-300 pr-8" placeholder={`Instruksi tambahan #${index + 2}`} />
                                <button type="button" onClick={() => handleRemoveInstruction(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold">&times;</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddInstruction} className="mt-2 text-sm text-sky-600 hover:underline">+ Tambah Instruksi</button>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2">Batal</button>
                        <button type="submit" disabled={isSubmitting || isLoadingModels} className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-blue-400">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan & Generate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}