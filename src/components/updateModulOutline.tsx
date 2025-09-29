import { useState, useEffect } from 'react';
import { getModulById, Modul, Outline } from '../services/modul/modulService';
import { AutoResizeTextarea } from './autoResizeTextArea.tsx';

interface EditableOutlineDisplayProps {
    modulId: string;
    onSave: (modulId: string, updatedOutline: Outline) => Promise<void>;
    onGenerateEbook: (modulId: string) => void;
    isEbookLoading: boolean; // Prop untuk mengontrol status loading tombol
}

export default function EditableOutlineDisplay({ modulId, onSave, onGenerateEbook, isEbookLoading }: EditableOutlineDisplayProps) {
    const [modul, setModul] = useState<Modul | null>(null);
    const [editableOutline, setEditableOutline] = useState<Outline | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!modulId) return;
        const fetchModulDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getModulById(modulId);
                setModul(data);
                setEditableOutline(JSON.parse(JSON.stringify(data.outline)));
            } catch (err: any) {
                setError(err.message || 'Gagal memuat detail outline.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchModulDetails();
    }, [modulId]);

    const handleOutlineChange = (path: { babIndex: number; subBabIndex?: number; itemIndex?: number }, field: any, value: any) => {
        if (!editableOutline) return;
        const newOutline = JSON.parse(JSON.stringify(editableOutline));
        const { babIndex, subBabIndex, itemIndex } = path;
        const bab = newOutline.list_materi[babIndex];
        if (subBabIndex !== undefined) {
            const subBab = bab.list_sub_materi[subBabIndex];
            if (itemIndex !== undefined) {
                subBab.list_materi[itemIndex] = value;
            } else {
                subBab[field] = value;
            }
        } else {
            bab[field] = value;
        }
        setEditableOutline(newOutline);
    };
    const addSubMateri = (babIndex: number) => {
        const newOutline = JSON.parse(JSON.stringify(editableOutline));
        newOutline.list_materi[babIndex].list_sub_materi.push({ sub_materi_pokok: 'Sub Bab Baru', list_materi: ['Materi baru'] });
        setEditableOutline(newOutline);
    };

    const removeSubMateri = (babIndex: number, subBabIndex: number) => {
        const newOutline = JSON.parse(JSON.stringify(editableOutline));
        newOutline.list_materi[babIndex].list_sub_materi.splice(subBabIndex, 1);
        setEditableOutline(newOutline);
    };

    const addListItem = (babIndex: number, subBabIndex: number) => {
        const newOutline = JSON.parse(JSON.stringify(editableOutline));
        newOutline.list_materi[babIndex].list_sub_materi[subBabIndex].list_materi.push('Materi baru');
        setEditableOutline(newOutline);
    };

    const removeListItem = (babIndex: number, subBabIndex: number, itemIndex: number) => {
        const newOutline = JSON.parse(JSON.stringify(editableOutline));
        newOutline.list_materi[babIndex].list_sub_materi[subBabIndex].list_materi.splice(itemIndex, 1);
        setEditableOutline(newOutline);
    };

    const handleSaveClick = async () => {
        if (!modul || !editableOutline) return;
        setIsSaving(true);
        await onSave(modul._id, editableOutline);
        setIsSaving(false);
    };

    if (isLoading) return <div className="text-center p-10">Memuat outline untuk diedit...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    if (!modul || !editableOutline) return <div className="text-center p-10">Data outline tidak ditemukan.</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full">
            <div className="p-8 pb-4 ">
                <input
                    type="text"
                    value={modul.materi_pokok.nama_jabatan}
                    readOnly
                    className="w-full text-3xl font-bold text-center bg-transparent mb-4 dark:text-white focus:outline-none border-none"
                />
            </div>

            <div className="p-8 pt-4">
                {editableOutline.list_materi.map((materiUtama, babIndex) => (
                    <div key={babIndex} className="mb-6 group">
                        {/* Judul Bab */}
                        <div className="flex items-start gap-2">
                            <AutoResizeTextarea
                                value={materiUtama.materi_pokok}
                                onChange={(e) => handleOutlineChange({ babIndex }, 'materi_pokok', e.target.value)}
                                className="text-2xl font-bold text-gray-800 dark:text-white border-none"
                                placeholder="Judul Bab"
                            />
                        </div>

                        {/* List Sub-Materi */}
                        <div className="pl-6 ml-1">
                            {materiUtama.list_sub_materi.map((subMateri, subBabIndex) => (
                                <div key={subBabIndex} className="mt-4 group/sub">
                                    <div className="flex items-center gap-2">
                                        <AutoResizeTextarea
                                            value={subMateri.sub_materi_pokok}
                                            onChange={(e) => handleOutlineChange({ babIndex, subBabIndex }, 'sub_materi_pokok', e.target.value)}
                                            className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-none"
                                            placeholder="Judul Sub Bab"
                                        />
                                        {/* Tombol Hapus Sub Bab (muncul saat hover) */}
                                        <button
                                            onClick={() => removeSubMateri(babIndex, subBabIndex)}
                                            className="opacity-0 group-hover/sub:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>

                                    {/* List Materi di dalam Sub Bab */}
                                    <div className="pl-5 mt-1">
                                        {subMateri.list_materi.map((listItem, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center gap-2 group/item">
                                                <span className="text-gray-500 dark:text-gray-400">•</span>
                                                <AutoResizeTextarea
                                                    value={listItem}
                                                    onChange={(e) => handleOutlineChange({ babIndex, subBabIndex, itemIndex }, 'list_materi', e.target.value)}
                                                    className="text-base text-gray-600 dark:text-gray-400 border-none"
                                                    placeholder="Materi"
                                                />
                                                <button
                                                    onClick={() => removeListItem(babIndex, subBabIndex, itemIndex)}
                                                    className="opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        {/* Tombol Tambah Materi (muncul saat hover) */}
                                        <button
                                            onClick={() => addListItem(babIndex, subBabIndex)}
                                            className="opacity-0 group-hover/sub:opacity-100 transition-opacity text-sm text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 mt-2 pl-1"
                                        >
                                            + Tambah materi
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {/* Tombol Tambah Sub Bab (muncul saat hover) */}
                            <button
                                onClick={() => addSubMateri(babIndex)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mt-4"
                            >
                                + Tambah Sub Bab
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tombol Aksi di Footer */}
            <div className="flex justify-end gap-4 p-8 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={handleSaveClick} disabled={isSaving} className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:bg-sky-400">
                    {isSaving ? 'Menyimpan...' : 'Save Changes'}
                </button>
                <button
                    onClick={() => onGenerateEbook(modul!._id)}
                    disabled={isEbookLoading}
                    className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-wait"
                >
                    {isEbookLoading ? 'Memulai Proses...' : 'Generate Ebook'}
                </button>
            </div>
        </div>
    );
}