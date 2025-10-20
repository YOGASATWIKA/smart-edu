import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_PATH_API;

export interface Model {
    id: string;
    model: string;
    description: string;
    steps: Promt[];
    variables: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface CreateModel {
    model: string;
    description: string;
    steps: Promt[];
    variables: string[];
    is_active: boolean
}

export interface Promt {
    role: string;
    content: string;
}

export const createModel = async (data: CreateModel) => {
    const response = await axios.post(`${API_BASE_URL}/model/`, data);
    return response.data;
};

export const getModelOutline = async (): Promise<Model[]> => {
    const response = await fetch(`${API_BASE_URL}/model/`);
    if (!response.ok) throw new Error('Gagal memuat daftar Model');
    const result = await response.json();

    if (result && Array.isArray(result.data)) {
        return result.data;
    } else {
        console.error("Format data dari server tidak sesuai:", result);
        return [];
    }
};

export const getModelOutlineDetail = async (model: string): Promise<string[]> => {
    let url = `${API_BASE_URL}/model/`;
    url += `?model=${model}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Gagal memuat daftar Model');
    const result = await response.json();
    if (result && Array.isArray(result.data)) {
        return result.data;
    } else {
        console.error("Format data dari server tidak sesuai:", result);
        return [];
    }
};

export const updateModel = async (modulId: string, baseMateri: CreateModel): Promise<any> => {
    const endpoint = `${API_BASE_URL}/model/${modulId}`;

    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseMateri)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: `Gagal memperbarui outline. Status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Terjadi kesalahan yang tidak diketahui.');
    }
    return await response.json();
};