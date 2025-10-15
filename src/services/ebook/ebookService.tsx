import Swal from "sweetalert2";

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
    html_content?: string;
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

export const getEbookByModuleId = async (id: string): Promise<any> => {
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
        const errorMessage = 'Format data dari server tidak sesuai.';
        Swal.fire({
            icon: 'error',
            title: 'Oops... Terjadi Kesalahan',
            text: errorMessage,
        });
    }
};


export const updateEbookById = async (id: string, payload: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/ebook/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Terjadi kesalahan pada server." }));
        throw new Error(errorData.message || `Gagal memperbarui ebook. Status: ${response.status}`);
    }

    return await response.json();
};
export const downloadEbookPdf = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/ebook/pdf/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || "Gagal mendownload file PDF.");
        }

        // Ambil nama file dari header
        const filename =
            response.headers.get("X-Filename") ||
            getFilenameFromContentDisposition(response.headers.get("Content-Disposition")) ||
            `ebook_${id}.pdf`;

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error: any) {
        console.error("Error downloading PDF:", error);
        Swal.fire({
            icon: "error",
            title: "Download Gagal",
            text: error.message || "Terjadi kesalahan saat mendownload file.",
        });
    }
};

const getFilenameFromContentDisposition = (header: string | null): string | null => {
    if (!header) return null;
    const match = header.match(/filename="(.+)"/);
    return match ? match[1] : null;
};


export const downloadEbookWord = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/ebook/word/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Gagal mendownload file Word.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `ebook_${id}.docx`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading Word:", error);
        Swal.fire({
            icon: "error",
            title: "Download Gagal",
            text: "Terjadi kesalahan saat mendownload file Word.",
        });
    }
};

