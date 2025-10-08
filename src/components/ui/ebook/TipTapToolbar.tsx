import { type Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight,
    Undo, Redo
} from 'lucide-react';

// Props sekarang lebih sederhana, tanpa fungsi download
type ToolbarProps = {
    editor: Editor | null;
};

// Komponen Pembatas Visual
const Separator = () => <div className="w-[1px] h-6 bg-gray-300 mx-2" />;

export const TiptapToolbar = ({ editor }: ToolbarProps) => {
    if (!editor) {
        return null;
    }

    const isActive = (name: string | { [key: string]: any }, opts?: { [key: string]: any }) => {
        if (typeof name === 'string') {
            return editor.isActive(name, opts);
        }
        return editor.isActive(name);
    }

    const getButtonClass = (name: string | { [key: string]: any }, opts?: { [key: string]: any }) => {
        return isActive(name, opts) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800';
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-t-lg bg-white">
            {/* Undo / Redo */}
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50" title="Undo">
                <Undo size={18} />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50" title="Redo">
                <Redo size={18} />
            </button>

            <Separator />

            {/* Formatting */}
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded ${getButtonClass('bold')}`} title="Bold">
                <Bold size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded ${getButtonClass('italic')}`} title="Italic">
                <Italic size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded ${getButtonClass('underline')}`} title="Underline">
                <Underline size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded ${getButtonClass('strike')}`} title="Strikethrough">
                <Strikethrough size={18} />
            </button>

            <Separator />

            {/* Headings */}
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded ${getButtonClass('heading', { level: 1 })}`} title="Heading 1">
                <Heading1 size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded ${getButtonClass('heading', { level: 2 })}`} title="Heading 2">
                <Heading2 size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded ${getButtonClass('heading', { level: 3 })}`} title="Heading 3">
                <Heading3 size={18} />
            </button>

            <Separator />

            {/* Lists */}
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded ${getButtonClass('bulletList')}`} title="Bullet List">
                <List size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded ${getButtonClass('orderedList')}`} title="Numbered List">
                <ListOrdered size={18} />
            </button>

            <Separator />

            {/* Block Elements */}
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded ${getButtonClass('blockquote')}`} title="Blockquote">
                <Quote size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded ${getButtonClass('codeBlock')}`} title="Code Block">
                <Code size={18} />
            </button>

            <Separator />

            {/* Alignment */}
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded ${getButtonClass({ textAlign: 'left' })}`} title="Align Left">
                <AlignLeft size={18} />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded ${getButtonClass({ textAlign: 'center' })}`} title="Align Center">
                <AlignCenter size={18} />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded ${getButtonClass({ textAlign: 'right' })}`} title="Align Right">
                <AlignRight size={18} />
            </button>

            {/* Tombol Download sudah dihapus dari sini */}
        </div>
    );
};
