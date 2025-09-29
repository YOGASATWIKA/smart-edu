export const LoadingSpinner = ({ isGenerating }: { isGenerating?: boolean }) => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
        </div>

        <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            {isGenerating ? "Sedang men-generate Ebook Anda..." : "Memuat Ebook..."}
        </p>
        {isGenerating && (
            <p className="max-w-md mt-2 text-base text-gray-500 dark:text-gray-400">
                AI sedang bekerja merangkai materi. Proses ini mungkin memakan waktu beberapa saat, mohon jangan tutup halaman ini.
            </p>
        )}
    </div>
);