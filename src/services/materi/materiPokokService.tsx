interface MateriPokokAPI {
    id: string;
    nama_jabatan: string;
    tugas_jabatan: string[];
    keterampilan: string[];
    klasifikasi: string;
}

export interface MateriPokok {
    id: string;
    Namajabatan: string;
    Tugasjabatan: string[];
    Keterampilan: string[];
    Klasifikasi: string;
}

const API_URL = 'http://localhost:3001/base-materi/';

/**
 * Mengambil semua materi pokok dari server dan mengubahnya ke format UI.
 * @returns {Promise<MateriPokok[]>}
 */
export const getAllMateriPokok = async (): Promise<MateriPokok[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result && Array.isArray(result.data)) {
        // Transformasi data dari snake_case (API) ke camelCase (UI)
        const transformedData: MateriPokok[] = result.data.map((item: MateriPokokAPI) => ({
            id: item.id, // Pastikan ID ikut di-transform
            Namajabatan: item.nama_jabatan,
            Tugasjabatan: item.tugas_jabatan,
            Keterampilan: item.keterampilan,
            Klasifikasi: item.klasifikasi,
        }));
        return transformedData;
    } else {
        throw new Error('Format data dari server tidak sesuai');
    }
};