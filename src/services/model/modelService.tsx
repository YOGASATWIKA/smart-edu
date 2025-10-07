const API_BASE_URL = import.meta.env.VITE_PATH_API;

export interface Model {
    _id: string;
    model: string;
    promt: Promt;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface Promt {
    system_prompt: string;
    user_prompts: string[];
}

export const getModelOutline = async (type: string): Promise<Model[]> => {
    let url = `${API_BASE_URL}/model/outline`;
    url += `?type=${type}`;
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

export const getModelOutlineDetail = async (id: string): Promise<string[]> => {
    let url = `${API_BASE_URL}/model/outline`;
    url += `?id=${id}`;
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