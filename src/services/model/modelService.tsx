const API_BASE_URL = import.meta.env.VITE_PATH_API;

interface Model {
    id: string;
    model: string;
}

export const fetchModels = async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/model`);
    if (!response.ok) throw new Error('Gagal memuat daftar Model');
    const result = await response.json();
    if (result?.data && Array.isArray(result.data)) {
        const allModels = result.data.map((item: Model) => item.model);
        return Array.from(new Set(allModels)) as string[];
    }
    throw new Error('Format data model tidak sesuai');
};