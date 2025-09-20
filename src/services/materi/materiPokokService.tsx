interface MateriPokokAPI {
    id: string;
    nama_jabatan: string;
    tugas_jabatan: string[];
    keterampilan: string[];
    klasifikasi: string;
    "created_at": string;
    "updated_at": string;
}

export interface MateriPokok {
    id: string;
    namaJabatan: string;
    tugasJabatan: string[];
    keterampilan: string[];
    klasifikasi: string;
    createdAt: string;
    updated_at: string;

}

const BASE_API_URL = import.meta.env.VITE_PATH_API || 'http://localhost:3000/api';
const API_URL = `${BASE_API_URL}/materi-pokok/`;

export const getAllMateriPokok = async (): Promise<MateriPokok[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result && Array.isArray(result.data)) {
        return result.data.map((item: MateriPokokAPI) => ({
            id: item.id,
            namaJabatan: item.nama_jabatan,
            tugasJabatan: item.tugas_jabatan,
            keterampilan: item.keterampilan,
            klasifikasi: item.klasifikasi,
            createdAt: item.created_at,
            updated_at: item.updated_at,
        }));
    } else {
        throw new Error('Format data dari server tidak sesuai');
    }
};