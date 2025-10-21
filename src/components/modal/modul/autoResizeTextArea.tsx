import React, { useLayoutEffect, useRef } from 'react';

type AutoResizeTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Set tinggi awal agar pas dengan konten saat pertama kali render
            textarea.style.height = 'inherit';
            // Set tinggi baru berdasarkan scrollHeight (tinggi total konten)
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [props.value]); // Efek ini akan berjalan setiap kali nilai textarea berubah

    return (
        <textarea
            ref={textareaRef}
            rows={1} // Mulai dengan 1 baris
            {...props}
            className={`w-full p-1 bg-transparent resize-none overflow-hidden focus:outline-none focus:ring-0 focus:bg-gray-100 dark:focus:bg-gray-700 rounded-md transition-colors ${props.className}`}
        />
    );
};