import { type Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline,
    List, ListOrdered,AlignLeft, AlignCenter, AlignRight,
    Undo, Redo
} from 'lucide-react';

type ToolbarProps = {
    editor: Editor | null;
};

const Separator = () => <div className="w-[1px] h-6 bg-gray-300 mx-2" />;

export const TiptapToolbar = ({ editor }: ToolbarProps) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-5 p-2 bg-gray-300">

            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 disabled:opacity-50" title="Undo">
                <Undo size={24} />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 disabled:opacity-50" title="Redo">
                <Redo size={24} />
            </button>
            <Separator/>
            <button onClick={() => editor.chain().focus().toggleBold().run()}  title="Bold">
                <Bold size={24} />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                <Italic size={24} />
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
                <Underline size={24} />
            </button>
            <Separator/>
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left">
                <AlignLeft size={24} />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()}  title="Align Center">
                <AlignCenter size={24} />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right">
                <AlignRight size={24} />
            </button>
            <Separator/>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
                <List size={24} />
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
                <ListOrdered size={24} />
            </button>
        </div>
    );
};
