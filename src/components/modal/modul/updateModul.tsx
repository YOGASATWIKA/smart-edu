import { useState, useEffect } from 'react';
import { getModulById, Modul, MateriPokok } from '../../../services/modul/modulService.tsx';
import { AutoResizeTextarea } from './autoResizeTextArea.tsx';

interface EditableMateriPokokDisplayProps {
    modulId: string;
    onSave: (modulId: string, updatedMateriPokok: MateriPokok) => Promise<void>;
}

export default function EditableMateriPokokDisplay({ modulId, onSave }: EditableMateriPokokDisplayProps) {
    const [modul, setModul] = useState<Modul | null>(null);
    const [editableMateri, setEditableMateri] = useState<MateriPokok | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!modulId) return;
        const fetchModul = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getModulById(modulId);
                setModul(data);
                setEditableMateri(JSON.parse(JSON.stringify(data.materi_pokok)));
            } catch (err: any) {
                setError(err.message || 'Gagal memuat data materi pokok.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchModul();
    }, [modulId]);

    const handleChange = (field: keyof MateriPokok, value: any) => {
        if (!editableMateri) return;
        setEditableMateri({ ...editableMateri, [field]: value });
    };

    const handleAddItem = (field: 'tugas_jabatan' | 'keterampilan') => {
        if (!editableMateri) return;
        setEditableMateri({
            ...editableMateri,
            [field]: [...editableMateri[field], 'Item baru'],
        });
    };

    const handleRemoveItem = (field: 'tugas_jabatan' | 'keterampilan', index: number) => {
        if (!editableMateri) return;
        const updated = [...editableMateri[field]];
        updated.splice(index, 1);
        setEditableMateri({ ...editableMateri, [field]: updated });
    };

    const handleItemChange = (field: 'tugas_jabatan' | 'keterampilan', index: number, value: string) => {
        if (!editableMateri) return;
        const updated = [...editableMateri[field]];
        updated[index] = value;
        setEditableMateri({ ...editableMateri, [field]: updated });
    };

    const handleSaveClick = async () => {
        if (!modul || !editableMateri) return;
        setIsSaving(true);
        await onSave(modul._id, editableMateri);
        setIsSaving(false);
    };

    if (isLoading)
        return <div className="flex items-center justify-center min-h-[70vh]"><p>Memuat materi pokok...</p></div>;
    if (error)
        return <div className="flex items-center justify-center min-h-[70vh] text-red-500">Error: {error}</div>;
    if (!modul || !editableMateri)
        return <div className="flex items-center justify-center min-h-[70vh]"><p>Data materi pokok tidak ditemukan.</p></div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full p-8">
            <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Materi Pokok</h2>

            {/* Nama Jabatan */}
            <div className="mb-8">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Nama Jabatan</label>
                <input
                    type="text"
                    value={editableMateri.nama_jabatan}
                    onChange={(e) => handleChange('nama_jabatan', e.target.value)}
                    className="w-full mt-2 p-2 rounded-lg border focus:outline-none border-none bg-transparent  dark:text-white"
                    placeholder="Contoh: Analis Data"
                />
            </div>

            <div className="mb-8">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tugas Jabatan</label>
                <div className="mt-3 space-y-2">
                    {editableMateri.tugas_jabatan.map((tugas, idx) => (
                        <div key={idx} className="flex items-center gap-2 group">
                            <span className="text-gray-500 dark:text-gray-400">•</span>
                            <AutoResizeTextarea
                                value={tugas}
                                onChange={(e) => handleItemChange('tugas_jabatan', idx, e.target.value)}
                                className="w-full p-1 rounded-lg border focus:outline-none border-none dark:text-white"
                                placeholder="Tuliskan tugas jabatan..."
                            />
                            <button
                                onClick={() => handleRemoveItem('tugas_jabatan', idx)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => handleAddItem('tugas_jabatan')}
                        className="text-sm font-semibold text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mt-2"
                    >
                        + Tambah Tugas
                    </button>
                </div>
            </div>

            {/* Keterampilan */}
            <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Keterampilan</label>
                <div className="mt-3 space-y-2">
                    {editableMateri.keterampilan.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 group">
                            <span className="text-gray-500 dark:text-gray-400">•</span>
                            <AutoResizeTextarea
                                value={skill}
                                onChange={(e) => handleItemChange('keterampilan', idx, e.target.value)}
                                className="w-full p-1 rounded-lg border focus:outline-none border-none dark:text-white"
                                placeholder="Tuliskan keterampilan..."
                            />
                            <button
                                onClick={() => handleRemoveItem('keterampilan', idx)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => handleAddItem('keterampilan')}
                        className="text-sm font-semibold text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mt-2"
                    >
                        + Tambah Keterampilan
                    </button>
                </div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end gap-4 mt-8 border-t pt-4 border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:bg-sky-400"
                >
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </div>
    );
}
