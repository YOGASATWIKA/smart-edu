// src/components/AddMateriModal.tsx

import { useState, FormEvent } from 'react';
import { NewBaseMateriRequest, createBaseMateri } from '../services/modul/modulService.tsx';
import Swal from "sweetalert2";

interface AddMateriModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddMateriModal({ isOpen, onClose, onSuccess }: AddMateriModalProps) {
    const [namaJabatan, setNamaJabatan] = useState('');
    const [tugasJabatan, setTugasJabatan] = useState<string[]>(['']);
    const [keterampilan, setKeterampilan] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleDynamicListChange = (index: number, value: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        const newList = [...list];
        newList[index] = value;
        setter(newList);
    };

    const addDynamicListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

    const removeDynamicListItem = (index: number, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if(list.length > 1) {
            const newList = list.filter((_, i) => i !== index);
            setter(newList);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const payload: NewBaseMateriRequest = {
            Namajabatan: namaJabatan,
            Tugasjabatan: tugasJabatan.filter(t => t.trim() !== ''),
            Keterampilan: keterampilan.filter(k => k.trim() !== ''),
        };
        Swal.fire({
            title: 'Memproses Permintaan Anda',
            // html: 'AI sedang membuat outline, mohon tunggu...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            await createBaseMateri(payload);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Modul Berhasil DiTambahkan!',
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMessage= 'Gagal menambahkan modul.' ;
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: errorMessage,
            });
            console.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tambah Base Materi Baru</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nama Jabatan</label>
                        <input type="text" value={namaJabatan} onChange={(e) => setNamaJabatan(e.target.value)} required className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"/>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tugas Jabatan</label>
                        {tugasJabatan.map((tugas, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input type="text" value={tugas} onChange={(e) => handleDynamicListChange(index, e.target.value, tugasJabatan, setTugasJabatan)} className="flex-grow rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"/>
                                <button type="button" onClick={() => removeDynamicListItem(index, tugasJabatan, setTugasJabatan)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addDynamicListItem(setTugasJabatan)} className="text-sm text-blue-600 hover:underline">+ Tambah Tugas</button>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Keterampilan</label>
                        {keterampilan.map((skill, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input type="text" value={skill} onChange={(e) => handleDynamicListChange(index, e.target.value, keterampilan, setKeterampilan)} className="flex-grow rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"/>
                                <button type="button" onClick={() => removeDynamicListItem(index, keterampilan, setKeterampilan)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addDynamicListItem(setKeterampilan)} className="text-sm text-blue-600 hover:underline">+ Tambah Keterampilan</button>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Materi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}