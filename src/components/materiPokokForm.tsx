import React, { useState } from 'react';

// Best practice: Definisikan URL di satu tempat.
const API_BASE_URL = import.meta.env.VITE_PATH_API;

// 1. SINKRONISASI TIPE: Menggunakan camelCase agar konsisten dengan Generate.tsx
interface MateriPokok {
    id: string;
    namaJabatan: string;    // Diubah dari Namajabatan
    tugasJabatan: string[];   // Diubah dari Tugasjabatan
    keterampilan: string[]; // Diubah dari Keterampilan
    klasifikasi: string;  // Diubah dari Klasifikasi
}

interface MateriPokokModalProps {
    materiList: MateriPokok[];
    onClose: () => void;
    onSelectMateri: (materi: MateriPokok) => void;
}

const MateriPokokModal: React.FC<MateriPokokModalProps> = ({
                                                               materiList,
                                                               onClose,
                                                               onSelectMateri,
                                                           }) => {
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedMateri, setSelectedMateri] = useState<MateriPokok | null>(null);

    // Menggunakan tipe MateriPokok yang sudah di-update
    const [newMateri, setNewMateri] = useState<Omit<MateriPokok, 'id'>>({
        namaJabatan: '',
        tugasJabatan: [''],
        keterampilan: [''],
        klasifikasi: '',
    });

    // Handler untuk form input, properti field diubah ke camelCase
    const handleArrayInputChange = (field: 'tugasJabatan' | 'keterampilan', index: number, value: string) => {
        const updatedArray = [...newMateri[field]];
        updatedArray[index] = value;
        setNewMateri({ ...newMateri, [field]: updatedArray });
    };

    const addArrayInput = (field: 'tugasJabatan' | 'keterampilan') => {
        setNewMateri({ ...newMateri, [field]: [...newMateri[field], ''] });
    };

    const removeArrayInput = (field: 'tugasJabatan' | 'keterampilan', index: number) => {
        if (newMateri[field].length > 1) {
            const filteredArray = newMateri[field].filter((_, i) => i !== index);
            setNewMateri({ ...newMateri, [field]: filteredArray });
        }
    };

    const handleConfirmSelection = () => {
        if (selectedMateri) {
            onSelectMateri(selectedMateri);
            onClose();
        }
    };

    const handleAddNewMateri = async () => {
        if (newMateri.namaJabatan.trim() === '' || isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        // 2. PENYESUAIAN API: Ubah data ke snake_case sebelum dikirim ke backend
        const payload = {
            namaJabatan: newMateri.namaJabatan.trim(),
            tugasJabatan: newMateri.tugasJabatan.filter(item => item.trim() !== ''),
            keterampilan: newMateri.keterampilan.filter(item => item.trim() !== ''),
            klasifikasi: newMateri.klasifikasi.trim(),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/materi-pokok`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), // Kirim payload yang sudah diubah
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menyimpan data ke server.');
            }

            console.log('Materi berhasil disimpan ke database!');
            // TODO: Idealnya, panggil fungsi dari parent untuk refresh data list
            onClose();

        } catch (error) {
            console.error('Terjadi kesalahan saat POST data:', error);
        } finally {
            setIsSubmitting(false);
            window.location.reload();
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
        >
            <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 transform transition-all"
            >
                {/* Modal Header */}
                <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {isAddingNew ? 'Tambah Materi Pokok Baru' : 'Pilih Materi Pokok'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        ✕<span className="sr-only">Tutup modal</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <div className="mb-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isAddingNew} onChange={() => setIsAddingNew(!isAddingNew)} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Tambahkan Materi Pokok Baru</span>
                        </label>
                    </div>

                    {isAddingNew ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Jabatan</label>
                                <input
                                    type="text"
                                    value={newMateri.namaJabatan}
                                    onChange={(e) => setNewMateri({...newMateri, namaJabatan: e.target.value})}
                                    placeholder="Contoh: Fisioterapis Terampil"
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tugas Jabatan</label>
                                {newMateri.tugasJabatan.map((tugas, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tugas}
                                            onChange={(e) => handleArrayInputChange('tugasJabatan', index, e.target.value)}
                                            placeholder={`Tugas Jabatan ${index + 1}`}
                                            className="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button onClick={() => removeArrayInput('tugasJabatan', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full">-</button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayInput('tugasJabatan')} className="text-sm text-blue-600 hover:underline dark:text-blue-500">+ Tambah Tugas</button>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keterampilan</label>
                                {newMateri.keterampilan.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={skill}
                                            onChange={(e) => handleArrayInputChange('keterampilan', index, e.target.value)}
                                            placeholder={`Keterampilan ${index + 1}`}
                                            className="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button onClick={() => removeArrayInput('keterampilan', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full">-</button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayInput('keterampilan')} className="text-sm text-blue-600 hover:underline dark:text-blue-500">+ Tambah Keterampilan</button>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Klasifikasi</label>
                                <input
                                    type="text"
                                    value={newMateri.klasifikasi}
                                    onChange={(e) => setNewMateri({...newMateri, klasifikasi: e.target.value})}
                                    placeholder="Contoh: Teknis"
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pilih salah satu materi pokok yang sudah ada di bawah ini.</p>
                            {/* 3. PENGGUNAAN KEY: Gunakan `materi.id` yang unik */}
                            {materiList.map((materi) => (
                                <div
                                    key={materi.id}
                                    onClick={() => setSelectedMateri(materi)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors dark:border-gray-600 ${
                                        // 4. SELEKSI: Bandingkan berdasarkan `id` yang lebih andal
                                        selectedMateri?.id === materi.id
                                            ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/50 dark:border-blue-500'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <p className="font-semibold text-gray-900 dark:text-white">{materi.namaJabatan}</p>
                                </div>
                            ))}
                            {materiList.length === 0 && (
                                <p className='text-center text-gray-500 dark:text-gray-400 py-4'>Belum ada materi pokok yang tersedia.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-gray-600">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        Batal
                    </button>

                    {isAddingNew ? (
                        <button
                            onClick={handleAddNewMateri}
                            disabled={!newMateri.namaJabatan.trim() || isSubmitting}
                            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Materi Baru'}
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirmSelection}
                            disabled={!selectedMateri}
                            className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Pilih Materi
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MateriPokokModal;