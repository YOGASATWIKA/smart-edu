const API_BASE_URL = import.meta.env.VITE_PATH_API;

interface Model {
    _id: string;
    model: string;
    promt: Promt;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface Promt {
    system_prompt: string;
    user_prompts: string[];
}

export const getModelOutline = async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/model/outline`);
    if (!response.ok) throw new Error('Gagal memuat daftar Model');
    const result = await response.json();
    if (result?.data && Array.isArray(result.data)) {
        const allModels = result.data.map((item: Model) => item.model);
        return Array.from(new Set(allModels)) as string[];
    }
    throw new Error('Format data model tidak sesuai');
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