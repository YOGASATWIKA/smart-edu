import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import { saveAs } from 'file-saver';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {Ebook, getEbookByModuleId, updateEbookById} from '../../services/ebook/ebookService';
import { LoadingSpinner } from '../../components/loadingSpinner';
import { TiptapToolbar } from '../../components/ui/ebook/TipTapToolbar';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';


const POLLING_INTERVAL = 10000;
const MAX_POLLING_ATTEMPTS = 144;

const transformEbookToHtml = (ebook: Ebook): string => {
    try {
        let htmlContent = `<h1>${ebook.title || 'Untitled'}</h1>`;

        if (!ebook.parts || !Array.isArray(ebook.parts)) {
            return htmlContent + '<p>Konten tidak tersedia</p>';
        }

        ebook.parts.forEach((part, partIndex) => {
            htmlContent += `<h2>Bab ${partIndex + 1}: ${part.subject || 'Tanpa Judul'}</h2>`;

            if (!part.chapters || !Array.isArray(part.chapters)) return;

            part.chapters.forEach((chapter, chapterIndex) => {
                htmlContent += `<h3>${partIndex + 1}.${chapterIndex + 1} ${chapter.title || 'Tanpa Judul'}</h3>`;

                if (!chapter.materials || !Array.isArray(chapter.materials)) return;

                chapter.materials.forEach((material) => {
                    htmlContent += `<h4>${material.title || 'Tanpa Judul'}</h4>`;

                    if (material.short) {
                        htmlContent += `<p><em>"${material.short}"</em></p>`;
                    }

                    if (!material.details || !Array.isArray(material.details)) return;

                    material.details.forEach((detail) => {
                        if (detail.content) htmlContent += `<p>${detail.content}</p>`;
                        if (detail.expanded) htmlContent += `<p>${detail.expanded}</p>`;
                    });
                });
            });
        });

        return htmlContent;
    } catch (error) {
        console.error('Error transforming ebook:', error);
        return '<p>Error memuat konten ebook.</p>';
    }
};

const transformEbookToDocx = (ebook: Ebook): Paragraph[] => {
    const paragraphs: Paragraph[] = [];

    try {
        paragraphs.push(
            new Paragraph({
                text: ebook.title || 'Untitled',
                heading: HeadingLevel.TITLE,
                spacing: { after: 400 },
            })
        );

        if (!ebook.parts || !Array.isArray(ebook.parts)) {
            paragraphs.push(new Paragraph({ text: 'Konten tidak tersedia' }));
            return paragraphs;
        }

        ebook.parts.forEach((part, partIndex) => {
            paragraphs.push(
                new Paragraph({
                    text: `Bab ${partIndex + 1}: ${part.subject || 'Tanpa Judul'}`,
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 },
                })
            );

            if (!part.chapters || !Array.isArray(part.chapters)) return;

            part.chapters.forEach((chapter, chapterIndex) => {
                paragraphs.push(
                    new Paragraph({
                        text: `${partIndex + 1}.${chapterIndex + 1} ${chapter.title || 'Tanpa Judul'}`,
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 150 },
                    })
                );

                if (!chapter.materials || !Array.isArray(chapter.materials)) return;

                chapter.materials.forEach((material) => {
                    paragraphs.push(
                        new Paragraph({
                            text: material.title || 'Tanpa Judul',
                            heading: HeadingLevel.HEADING_3,
                            spacing: { before: 200, after: 100 },
                        })
                    );

                    if (material.short) {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `"${material.short}"`,
                                        italics: true,
                                    }),
                                ],
                                spacing: { after: 150 },
                            })
                        );
                    }

                    if (!material.details || !Array.isArray(material.details)) return;

                    material.details.forEach((detail) => {
                        if (detail.content) {
                            paragraphs.push(
                                new Paragraph({
                                    text: detail.content,
                                    spacing: { after: 100 },
                                    alignment: AlignmentType.JUSTIFIED,
                                })
                            );
                        }

                        if (detail.expanded) {
                            paragraphs.push(
                                new Paragraph({
                                    text: detail.expanded,
                                    spacing: { after: 100 },
                                    alignment: AlignmentType.JUSTIFIED,
                                })
                            );
                        }
                    });
                });
            });
        });

        return paragraphs;
    } catch (error) {
        console.error('Error transforming ebook to docx:', error);
        paragraphs.push(new Paragraph({ text: 'Error membuat dokumen.' }));
        return paragraphs;
    }
};

const sanitizeFilename = (filename: string): string => {
    return filename
        .replace(/[^a-z0-9\s]/gi, '_')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .substring(0, 100);
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function EbookViewerPage() {
    const location = useLocation();
    const id = location.state?.moduleId;
    const isGenerating = location.state?.isGenerating || false;

    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        console.log('=== EbookViewerPage Mounted ===');
        console.log('Module ID:', id);
        console.log('Is Generating:', isGenerating);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: '<p>Memuat konten ebook...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none p-4 min-h-[500px]',
            },
        },
        onUpdate: () => {
            setHasUnsavedChanges(true);
        },
    });

    const fetchEbook = useCallback(async () => {
        if (!id) {
            console.error('No module ID provided');
            return false;
        }

        try {
            console.log('Fetching ebook with ID:', id);
            const data = await getEbookByModuleId(id);
            console.log('Ebook data received:', data);
            setEbook(data);
            setError(null);
            return true;
        } catch (err: any) {
            console.error('Error fetching ebook:', err);
            const errorMessage = err?.message || 'Terjadi kesalahan';

            if (!errorMessage.toLowerCase().includes("tidak ditemukan")) {
                setError(errorMessage);
            }

            return false;
        }
    }, [id]);

    useEffect(() => {
        console.log('Polling effect triggered');

        if (!id) {
            console.error('No ID, showing error');
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID Modul tidak ditemukan.',
            });
            return;
        }

        let intervalId: NodeJS.Timeout | null = null;
        let isMounted = true;

        const poll = async () => {
            if (!isMounted) return;
            console.log('Polling...');
            const success = await fetchEbook();
            return success;
        };

        const startPolling = async () => {
            let attempts = 0;

            console.log('Starting initial fetch...');
            const initialSuccess = await poll();

            if (initialSuccess) {
                console.log('Initial fetch successful');
                setIsLoading(false);
                return;
            }

            if (isGenerating && isMounted) {
                console.log('Starting polling interval...');
                intervalId = setInterval(async () => {
                    if (!isMounted) return;

                    attempts++;
                    console.log(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS}`);

                    const success = await poll();

                    if (success) {
                        console.log('Polling successful, stopping...');
                        if (intervalId) clearInterval(intervalId);
                        setIsLoading(false);
                    } else if (attempts >= MAX_POLLING_ATTEMPTS) {
                        console.log('Max attempts reached, stopping...');
                        if (intervalId) clearInterval(intervalId);
                        setIsLoading(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Timeout',
                            text: 'Proses generate terlalu lama.',
                        });
                    }
                }, POLLING_INTERVAL);
            } else {
                console.log('Not generating, stopping loading...');
                setIsLoading(false);
            }
        };

        startPolling();

        return () => {
            console.log('Cleaning up polling...');
            isMounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [id, isGenerating, fetchEbook]);

    useEffect(() => {
        if (ebook && editor && !editor.isDestroyed) {
            console.log('Updating editor content...');
            const htmlContent = transformEbookToHtml(ebook);
            editor.commands.setContent(htmlContent);
            setHasUnsavedChanges(false);
        }
    }, [ebook, editor]);

    const handleDownloadDOCX = useCallback(async () => {
        if (!ebook) {
            Swal.fire('Error', 'Ebook tidak tersedia.', 'error');
            return;
        }

        setIsDownloadingDocx(true);

        try {
            console.log('Creating DOCX document...');

            const paragraphs = transformEbookToDocx(ebook);

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs,
                }],
            });

            const blob = await Packer.toBlob(doc);

            const filename = `${sanitizeFilename(ebook.title || 'dokumen')}.docx`;
            saveAs(blob, filename);

            console.log('DOCX file saved:', filename);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'File DOCX berhasil diunduh.',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err: any) {
            console.error("Error creating DOCX:", err);
            Swal.fire('Error', 'Gagal membuat file DOCX.', 'error');
        } finally {
            setIsDownloadingDocx(false);
        }
    }, [ebook]);

    const handleSaveChanges = useCallback(async () => {
        if (!editor || editor.isDestroyed || !ebook || !id) return;

        setIsSaving(true);

        try {
            // Ambil hasil dari editor
            const htmlContent = editor.getHTML();
            const jsonContent = editor.getJSON();

            // Buat payload yang akan dikirim ke server
            const payload = {
                title: ebook.title,
                modul: ebook.modul,
                parts: ebook.parts,
                html_content: htmlContent,
                json_content: jsonContent,
                updated_at: new Date().toISOString(),
            };

            console.log("=== UPDATE EBOOK ===");
            console.log("Payload:", payload);

            const result = await updateEbookById(id, payload);
            console.log("Server response:", result);

            setHasUnsavedChanges(false);

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Perubahan berhasil disimpan ke server.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err: any) {
            console.error("Error updating ebook:", err);
            Swal.fire("Error", err.message || "Gagal menyimpan perubahan.", "error");
        } finally {
            setIsSaving(false);
        }
    }, [editor, ebook, id]);

    useEffect(() => {
        return () => {
            if (editor && !editor.isDestroyed) {
                editor.destroy();
            }
        };
    }, [editor]);

    console.log('Rendering - Loading:', isLoading, 'Error:', error, 'Ebook:', !!ebook);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner isGenerating={isGenerating} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    if (!ebook) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Ebook Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-6">Ebook yang Anda cari tidak ditemukan.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {hasUnsavedChanges && (
                                <div className="flex items-center gap-2 text-sm text-orange-600">
                                    <span className="inline-block w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                                    <span>Ada perubahan yang belum disimpan</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasUnsavedChanges || isSaving}
                                className="px-5 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>

                            <button
                                onClick={handleDownloadDOCX}
                                disabled={isDownloadingDocx}
                                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait transition-colors text-sm"
                            >
                                {isDownloadingDocx ? 'Membuat DOCX...' : 'Download DOCX'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg">
                        {/* Toolbar */}
                        <TiptapToolbar editor={editor} />

                        {/* Editor Content */}
                        <div className="border border-t-0 border-gray-300 rounded-b-lg bg-white">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}