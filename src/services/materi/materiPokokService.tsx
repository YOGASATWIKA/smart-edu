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

export const getAllMateriPokok = async (): Promise<MateriPokok[]> => {
    const response = await fetch( new URL(import.meta.env.VITE_API_URL + "base-materi/"));
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