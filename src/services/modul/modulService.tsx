export interface MateriPokok {
    nama_jabatan: string;
    tugas_jabatan: string[];
    keterampilan: string[];
}

export interface SubMateri {
    sub_materi_pokok: string;
    list_materi: string[];
}

export interface MateriUtama {
    materi_pokok: string;
    list_sub_materi: SubMateri[];
}

export interface Outline {
    list_materi: MateriUtama[];
}

export interface ModulActivity {
    _id: string;
    nama_jabatan: string;
    is_active: boolean;
    state: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateOutline{
    outline : Outline;
}

export interface Modul {
    _id: string;
    materi_pokok: MateriPokok;
    outline: Outline;
    is_active: boolean;
    state: string;
    created_at: string;
    updated_at: string;
}

export interface NewBaseMateriRequest {
    Namajabatan: string;
    Tugasjabatan: string[];
    Keterampilan: string[];
}


const API_BASE_URL = import.meta.env.VITE_PATH_API;

export const getModulByState = async (state: string): Promise<Modul[]> => {
    let url = `${API_BASE_URL}/modul`;
    url += `?state=${state}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Gagal mengambil data modul: Status ${response.status}`);
    }

    const result = await response.json();

    if (result && Array.isArray(result.data)) {
        return result.data;
    } else {
        console.error("Format data dari server tidak sesuai:", result);
        return [];
    }
};

export const createBaseMateri = async (materiData: NewBaseMateriRequest): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/modul/base-materi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(materiData),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Gagal membuat materi baru.' }));
        throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
};

export const generateOutlines = async (modulIds: string[], model: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/modul/outline/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id: modulIds,
            Model: model,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Terjadi kesalahan pada server.' }));
        throw new Error(errorData.message || `Gagal memulai proses generate outline. Status: ${response.status}`);
    }

    return await response.json();
};

export const getModulById = async (id: string): Promise<Modul> => {
    const response = await fetch(`${API_BASE_URL}/modul/${id}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Gagal mengambil data modul. Status: ${response.status}` }));
        throw new Error(errorData.message);
    }
    const result = await response.json();
    if (result && typeof result.data === 'object' && result.data !== null) {
        return result.data;
    } else {
        console.error("Format data dari server tidak sesuai:", result);
        throw new Error("Format data dari server tidak sesuai.");
    }
};

export const updateModulOutline = async (modulId: string, updatedOutline: Outline): Promise<any> => {
    const endpoint = `${API_BASE_URL}/modul/outline/${modulId}`;

    const requestBody = {
        outline: updatedOutline
    };
    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: `Gagal memperbarui outline. Status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Terjadi kesalahan yang tidak diketahui.');
    }
    return await response.json();
};

export const deleteModulById = async (modulId: string): Promise<any> => {
    const endpoint = `${API_BASE_URL}/modul/${modulId}`;

    const response = await fetch(endpoint, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: `Gagal DELETE outline. Status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Terjadi kesalahan yang tidak diketahui.');
    }
    return await response.json();
};

export const getActivity = async (): Promise<ModulActivity[]> => {
    const response = await fetch(`${API_BASE_URL}/modul/activity`);

    if (!response.ok) {
        throw new Error(`Gagal mengambil data modul: Status ${response.status}`);
    }

    const result = await response.json();

    if (result && Array.isArray(result.data)) {
        return result.data;
    } else {
        console.error("Format data dari server tidak sesuai:", result);
        return [];
    }
};