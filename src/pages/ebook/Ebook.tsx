import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {Ebook, getEbookByModuleId, updateEbookById, downloadEbookWord, downloadEbookPdf} from '../../services/ebook/ebookService';
import { LoadingSpinner } from '../../components/modal/ebook/loadingSpinner.tsx';
import { TiptapToolbar } from '../../components/modal/ebook/TipTapToolbar';
import {FileText} from "lucide-react";





export default function EbookViewerPage() {
    const location = useLocation();
    const id = location.state?.moduleId;
    const isGenerating = location.state?.isGenerating || false;

    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [, setIsInitializing] = useState(true);
    const POLLING_INTERVAL = 10000;
    const MAX_POLLING_ATTEMPTS = 180;
    const [timeLeft, setTimeLeft] = useState(MAX_POLLING_ATTEMPTS * POLLING_INTERVAL / 1000);

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
            return false;
        }

        try {
            const data = await getEbookByModuleId(id);
            setEbook(data);
            setError(null);
            return true;
        } catch (err: any) {
            const errorMessage = err?.message || 'Terjadi kesalahan';

            if (!errorMessage.toLowerCase().includes("tidak ditemukan")) {
                setError(errorMessage);
            }

            return false;
        }
    }, [id]);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID Modul tidak ditemukan.',
            });
            return;
        }

        let intervalId: NodeJS.Timeout | null = null;
        let timerId: NodeJS.Timeout | null = null; // ✅ timer per detik
        let isMounted = true;

        const poll = async () => {
            if (!isMounted) return false;
            const success = await fetchEbook();
            return success;
        };

        const startPolling = async () => {
            setIsLoading(true);

            let attempts = 0;

            setTimeLeft(MAX_POLLING_ATTEMPTS * POLLING_INTERVAL / 1000);

            const initial = await poll();
            if (initial) {
                if (isMounted) setIsLoading(false);
                return;
            }

            if (isGenerating && isMounted) {

                timerId = setInterval(() => {
                    setTimeLeft(prev => {
                        if (prev <= 1) return 0;
                        return prev - 1;
                    });
                }, 1000);

                intervalId = setInterval(async () => {
                    if (!isMounted) return;

                    attempts++;

                    const success = await poll();

                    if (success) {
                        clearInterval(intervalId!);
                        clearInterval(timerId!);
                        if (isMounted) setIsLoading(false);
                        return;
                    }

                    if (attempts >= MAX_POLLING_ATTEMPTS) {
                        clearInterval(intervalId!);
                        clearInterval(timerId!);
                        if (isMounted) setIsLoading(false);

                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal Membuat Outline',
                            text: 'Proses generate melebihi 30 menit dan dihentikan.',
                        });
                    }

                }, POLLING_INTERVAL);
            } else {
                if (isMounted) setIsLoading(false);
            }
        };

        startPolling();

        return () => {
            isMounted = false;
            if (intervalId) clearInterval(intervalId);
            if (timerId) clearInterval(timerId);
        };
    }, [id, isGenerating, fetchEbook]);




    useEffect(() => {
        if (!editor || !ebook) return;

        setIsInitializing(true);

        if (ebook.html_content != null) {
            editor.commands.setContent(ebook.html_content);
        }

        setHasUnsavedChanges(false);

        const timeout = setTimeout(() => {
            setIsInitializing(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [ebook, editor]);


    const handleSaveChanges = useCallback(async () => {
        if (!editor || editor.isDestroyed || !ebook || !id) return;

        setIsSaving(true);

        try {
            const htmlContent = editor.getHTML();
            const jsonContent = editor.getJSON();
            const payload = {
                title: ebook.title,
                modul: ebook.modul,
                parts: ebook.parts,
                html_content: htmlContent,
                json_content: jsonContent,
                updated_at: new Date().toISOString(),
            };
            await updateEbookById(id, payload);
            setHasUnsavedChanges(false);

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Perubahan berhasil disimpan ke server.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err: any) {
            Swal.fire("Error", err.message || "Gagal menyimpan perubahan.", "error");
        } finally {
            setIsSaving(false);
            window.location.reload();
        }
    }, [editor, ebook, id]);

    useEffect(() => {
        return () => {
            if (editor && !editor.isDestroyed) {
                editor.destroy();
            }
        };
    }, [editor]);

    if (isLoading) {
        return (
            <LoadingSpinner
                isGenerating={isGenerating}
                timeLeft={timeLeft}
            />
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

    return (
        <>
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
                                onClick={() => downloadEbookWord(ebook)}
                                className="flex items-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                <FileText size={16} /> Word
                            </button>

                            <button
                                onClick={() => downloadEbookPdf(ebook)}
                                className="flex items-center px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors text-sm"
                            >
                                <FileText size={16} /> PDF
                            </button>

                        </div>
                    </div>
                </div>

            <div>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="overflow-hidden">
                        <div className=" top-0 z-10">
                            <TiptapToolbar editor={editor} />
                        </div>
                        <hr className="border-t border-gray-400" />
                        <div
                            className="max-h-[70vh] overflow-y-auto scrollbar-thin
             scrollbar-thumb-gray-600 scrollbar-track-gray-300  bg-gray-300 "
                        >
                            <EditorContent editor={editor} className="min-h-[400px] text-black dark:text-white" />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}