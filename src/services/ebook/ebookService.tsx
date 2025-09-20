import {MateriPokok, Modul, Outline} from "../modul/modulService.tsx";

// src/types/ebook.ts

export interface Detail {
    content: string;
    expanded: string;
    expand_chunks: string[];
}

export interface Material {
    title: string;
    short: string;
    details: Detail[];
}

export interface Chapter {
    title: string;
    base_competitions: string[];
    trigger_questions: string[];
    materials: Material[];
    conclusion: string;
    reflections: string[];
}

// Bab
export interface Part {
    subject: string;
    introductions: string[];
    urgencies: string[];
    chapters: Chapter[];
}

export interface Ebook {
    _id: string;
    title: string;
    parts: Part[];
    modul: string;
    created_at: string;
    updated_at?: string;
    delete_at?: string;
}

const API_BASE_URL = import.meta.env.VITE_PATH_API;

export const generateEbooks = async (modulIds: string[], model: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/ebook/`, {
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
        throw new Error(errorData.message || `Gagal memulai proses generate ebook. Status: ${response.status}`);
    }

    return await response.json();
};

export const getEbookById = async (id: string): Promise<Ebook> => {
    const response = await fetch(`${API_BASE_URL}/ebook/${id}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Gagal mengambil ebook Status: ${response.status}` }));
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

