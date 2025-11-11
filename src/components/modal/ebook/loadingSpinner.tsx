export const LoadingSpinner = ({
                                   isGenerating,
                                   timeLeft
                               }: {
    isGenerating?: boolean;
    timeLeft?: number;
}) => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
        </div>

        {isGenerating && (
            <p className="max-w-md mt-2 text-base text-gray-500 dark:text-gray-400">
                AI sedang bekerja merangkai materi. Proses ini mungkin memakan waktu beberapa saat, mohon jangan tutup halaman ini.
                <br />
                {timeLeft !== undefined && (
                    <span className="font-semibold">
                        Sisa waktu: {Math.floor(timeLeft / 60)} menit {timeLeft % 60} detik
                    </span>
                )}
            </p>
        )}
    </div>
);
