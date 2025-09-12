// src/components/RichTextEditor.tsx

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../index.css';
interface TextEditorProps {
    initialValue?: string;
    onEditorChange: (content: string) => void;
}

// Konfigurasi toolbar untuk Quill
const modules = {
    toolbar: [
        // Group 1: Headings, Font, Size
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],

        // Group 2: Basic Formatting
        ['bold', 'italic', 'underline', 'strike'],

        [{ 'align': [] }],

        // Group 3: Lists and Indent
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],

        [{ 'color': [] }, { 'background': [] }],

    ],
    history: { // Modul history untuk undo/redo
        delay: 2000,
        maxStack: 500,
        userOnly: true
    }
};

const TextEditor: React.FC<TextEditorProps> = ({ initialValue, onEditorChange }) => {
    return (
        // Gunakan komponen ReactQuill di sini
        <div spellCheck={false}>
            <ReactQuill
                theme="snow" // Tema 'snow' adalah tema standar dengan toolbar
                value={initialValue || ''} // Gunakan 'value' untuk mengontrol konten
                onChange={onEditorChange} // Gunakan 'onChange' untuk menangani perubahan
                modules={modules} // Terapkan konfigurasi toolbar kustom
                style={{ height: 'auto', display: 'flex', flexDirection: 'column' }} // Atur tinggi editor
            />
        </div>
    );
};

export default TextEditor;