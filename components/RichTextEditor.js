'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-plum underline' },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'post-content prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-plum/20 overflow-hidden bg-white">
      <div className="sticky top-[57px] z-30 flex flex-wrap gap-1 border-b border-plum/10 bg-base/95 backdrop-blur px-2 py-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} ativo={editor.isActive('bold')} label="Negrito">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} ativo={editor.isActive('italic')} label="Itálico">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          ativo={editor.isActive('heading', { level: 2 })}
          label="Título de seção"
        >
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} ativo={editor.isActive('bulletList')} label="Lista com marcadores">
          • Lista
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} ativo={editor.isActive('orderedList')} label="Lista numerada">
          1. Lista
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Cole o link (https://...):');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          ativo={editor.isActive('link')}
          label="Inserir link"
        >
          🔗
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} label="Remover link">
          🔗✕
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} label="Desfazer">
          ↩
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ onClick, ativo, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`px-2.5 py-1 rounded text-sm transition ${
        ativo ? 'bg-plum text-white' : 'hover:bg-plum/10 text-plum-dark'
      }`}
    >
      {children}
    </button>
  );
}
