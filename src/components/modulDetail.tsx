import { useState, useEffect } from 'react';
import { Modul } from '../services/modul/modulService';


interface ModalProps {
    materi: Modul | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
    onUpdateSuccess: () => void;
}

export default function ModulDetail({ materi, isLoading, error, onClose, onUpdateSuccess }: ModalProps) {
    // State untuk mengelola mode edit
    const [isEditing, setIsEditing] = useState(false);
    // State untuk menampung data yang sedang diedit
    const [editableMateri, setEditableMateri] = useState<Modul | null>(materi);
    // State untuk loading saat menyimpan
    const [isSaving, setIsSaving] = useState(false);

    // Sinkronkan state editan dengan prop materi saat berubah
    useEffect(() => {
        setEditableMateri(materi);
    }, [materi]);

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
        setEditableMateri(materi); // Kembalikan ke data semula
    };

    const handleSave = async () => {
        if (!editableMateri) return;
        setIsSaving(true);
        try {
            // Panggil API untuk menyimpan perubahan
            // await updateModul(editableMateri); // --> Ganti dengan fungsi API Anda
            console.log("Menyimpan data:", editableMateri); // Placeholder

            alert("Perubahan berhasil disimpan!");
            setIsEditing(false);
            onUpdateSuccess(); // Refresh data di halaman utama
        } catch (err) {
            console.error("Gagal menyimpan:", err);
            alert("Gagal menyimpan perubahan.");
        } finally {
            setIsSaving(false);
        }
    };

    // Handler untuk perubahan di textarea
    const handleTextAreaChange = (field: 'tugas_jabatan' | 'keterampilan', value: string) => {
        if (!editableMateri) return;
        setEditableMateri({
            ...editableMateri,
            materi_pokok: {
                ...editableMateri.materi_pokok,
                [field]: value.split('\n').filter(line => line.trim() !== ''), // Ubah string kembali jadi array
            },
        });
    };

    // Render konten berdasarkan state
    const renderContent = () => {
        if (isLoading) return <div className="text-center py-12">Memuat detail...</div>;
        if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;
        if (!editableMateri) return <div className="text-center py-12">Tidak ada data.</div>;

        return isEditing ? (
            // --- TAMPILAN MODE EDIT ---
            <div className="space-y-4">
                <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Tugas Jabatan</label>
                    <p className="text-xs text-gray-500 mb-2">Pisahkan setiap poin dengan baris baru (Enter).</p>
                    <textarea
                        value={editableMateri.materi_pokok.tugas_jabatan.join('\n')}
                        onChange={(e) => handleTextAreaChange('tugas_jabatan', e.target.value)}
                        className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Keterampilan</label>
                    <p className="text-xs text-gray-500 mb-2">Pisahkan setiap poin dengan baris baru (Enter).</p>
                    <textarea
                        value={editableMateri.materi_pokok.keterampilan.join('\n')}
                        onChange={(e) => handleTextAreaChange('keterampilan', e.target.value)}
                        className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            </div>
        ) : (
            // --- TAMPILAN MODE LIHAT ---
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tugas Jabatan</h3>
                    <ul className="mt-2 space-y-2 pl-1">
                        {editableMateri.materi_pokok.tugas_jabatan.map((tugas, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">&#10003;</span>
                                <span className="text-gray-600 dark:text-gray-400">{tugas}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Keterampilan</h3>
                    <ul className="mt-2 space-y-2 pl-1">
                        {editableMateri.materi_pokok.keterampilan.map((skill, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">&#10003;</span>
                                <span className="text-gray-600 dark:text-gray-400">{skill}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 flex flex-col">
                {/* Header Modal */}
                <div className="flex items-start justify-between pb-4 border-b dark:border-gray-600">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {materi?.materi_pokok.nama_jabatan || 'Detail Modul'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Konten Utama */}
                <div className="py-6 flex-grow">{renderContent()}</div>

                {/* Footer dengan Tombol Aksi */}
                <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-600">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Batal</button>
                            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400">
                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-500">Edit</button>
                    )}
                </div>
            </div>
        </div>
    );
}