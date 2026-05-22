"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import HighlightExtension from "@tiptap/extension-highlight";
import LinkExtension from "@tiptap/extension-link";
import SubscriptExtension from "@tiptap/extension-subscript";
import SuperscriptExtension from "@tiptap/extension-superscript";
import TextAlignExtension from "@tiptap/extension-text-align";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import { useEffect, useState } from "react";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import CodeBlockComponent from "./CodeBlockComponent";

const lowlight = createLowlight(common);
import {
  Undo2,
  Redo2,
  Heading,
  List,
  ListOrdered,
  Quote,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Terminal,
  Underline,
  Highlighter,
  Link2,
  Superscript as SuperIcon,
  Subscript as SubIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

import UnsplashModal from "./UnsplashModal";
import "./editor.css";

export default function SimpleEditor({ content, onChange, placeholder = "Write your masterpiece..." }) {
  const isDark = false;
  const [headingOpen, setHeadingOpen] = useState(false);
  const [unsplashOpen, setUnsplashOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
        codeBlock: false,
      }),
      UnderlineExtension,
      HighlightExtension.configure({
        multicolor: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link",
        },
      }),
      SubscriptExtension,
      SuperscriptExtension,
      TextAlignExtension.configure({
        types: ["heading", "paragraph"],
      }),
      PlaceholderExtension.configure({
        placeholder,
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
      }),
    ],
    content: content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  // Sync content if it changes externally (e.g., during streaming)
  useEffect(() => {
    if (!editor || content === undefined) return;
    
    const currentHtml = editor.getHTML();
    // Only set content if it differs to avoid cursor jump issues
    if (content !== currentHtml) {
      // Save current cursor selection position
      const { from, to } = editor.state.selection;
      editor.commands.setContent(content, false);
      // Restore cursor position if possible
      try {
        editor.commands.setTextSelection({ from, to });
      } catch (e) {
        // Ignore selection restoration errors if document shrunk
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[400px] border border-gray-100 rounded-2xl bg-white">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addPlaceholderText = () => {
    editor.chain().focus().insertContent(" [New section text here] ").run();
  };

  const getActiveHeadingLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "Paragraph";
  };

  return (
    <div
      className={`border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
        isDark ? "dark-theme bg-stone-950 border-stone-800 shadow-stone-900/50" : ""
      }`}
    >
      {/* ── TOOLBAR ── */}
      <div className={`flex flex-wrap items-center justify-between gap-1 p-2.5 border-b border-gray-100 ${
        isDark ? "border-stone-800 bg-stone-900/50" : "bg-gray-50/50"
      }`}>
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Undo/Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`p-1.5 rounded-lg hover:bg-black/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all ${
              isDark ? "hover:bg-white/10 text-stone-300" : "text-gray-600"
            }`}
            title="Undo"
          >
            <Undo2 className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`p-1.5 rounded-lg hover:bg-black/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all ${
              isDark ? "hover:bg-white/10 text-stone-300" : "text-gray-600"
            }`}
            title="Redo"
          >
            <Redo2 className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          <div className={`w-[1px] h-5 mx-1 ${isDark ? "bg-stone-800" : "bg-gray-200"}`} />

          {/* Heading Dropdown */}
          <div className="relative">
            <button
              onClick={() => setHeadingOpen(!headingOpen)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-black/5 active:scale-95 text-[13px] font-semibold transition-all ${
                isDark ? "hover:bg-white/10 text-stone-300" : "text-gray-600"
              }`}
              title="Change heading level"
            >
              <Heading className="h-[15px] w-[15px]" />
              <span>{getActiveHeadingLabel()}</span>
            </button>

            {headingOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setHeadingOpen(false)}
                />
                <div className={`absolute top-full left-0 mt-1 w-36 rounded-xl border border-gray-100 bg-white p-1 shadow-lg z-20 flex flex-col gap-0.5 ${
                  isDark ? "bg-stone-900 border-stone-800 shadow-black/40" : ""
                }`}>
                  {[
                    { label: "Paragraph", action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
                    { label: "Heading 1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
                    { label: "Heading 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
                    { label: "Heading 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        opt.action();
                        setHeadingOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        opt.active
                          ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                          : isDark ? "text-stone-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-black/5 hover:text-black"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={`w-[1px] h-5 mx-1 ${isDark ? "bg-stone-800" : "bg-gray-200"}`} />

          {/* List buttons */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("bulletList")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Bullet list"
          >
            <List className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("orderedList")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Numbered list"
          >
            <ListOrdered className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("blockquote")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Blockquote"
          >
            <Quote className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          <div className={`w-[1px] h-5 mx-1 ${isDark ? "bg-stone-800" : "bg-gray-200"}`} />

          {/* Inline styles */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg active:scale-95 font-bold transition-all ${
              editor.isActive("bold")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Bold"
          >
            <Bold className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg active:scale-95 italic transition-all ${
              editor.isActive("italic")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Italic"
          >
            <Italic className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg active:scale-95 line-through transition-all ${
              editor.isActive("strike")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg active:scale-95 monospace transition-all ${
              editor.isActive("code")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Code"
          >
            <Code className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("codeBlock")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Code Block"
          >
            <Terminal className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg active:scale-95 underline transition-all ${
              editor.isActive("underline")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Underline"
          >
            <Underline className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          {/* Highlight */}
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("highlight")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Highlight"
          >
            <Highlighter className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          {/* Links */}
          <button
            onClick={setLink}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("link")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Add Link"
          >
            <Link2 className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          {/* Superscript / Subscript */}
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("superscript")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Superscript"
          >
            <SuperIcon className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive("subscript")
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Subscript"
          >
            <SubIcon className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          <div className={`w-[1px] h-5 mx-1 ${isDark ? "bg-stone-800" : "bg-gray-200"}`} />

          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive({ textAlign: "left" })
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Align Left"
          >
            <AlignLeft className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive({ textAlign: "center" })
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Align Center"
          >
            <AlignCenter className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive({ textAlign: "right" })
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Align Right"
          >
            <AlignRight className="h-[15px] w-[15px] stroke-[2]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              editor.isActive({ textAlign: "justify" })
                ? isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                : isDark ? "hover:bg-white/10 text-stone-400" : "hover:bg-black/5 text-gray-500"
            }`}
            title="Justify"
          >
            <AlignJustify className="h-[15px] w-[15px] stroke-[2]" />
          </button>

          <div className={`w-[1px] h-5 mx-1 ${isDark ? "bg-stone-800" : "bg-gray-200"}`} />

          {/* Add Item */}
          <button
            onClick={addPlaceholderText}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-black/5 active:scale-95 text-[12px] font-semibold transition-all ${
              isDark ? "hover:bg-white/10 text-stone-300" : "text-gray-600"
            }`}
            title="Add section placeholder"
          >
            <Plus className="h-[14px] w-[14px] stroke-[2.5]" />
            <span>Add</span>
          </button>

          {/* Add Unsplash Image */}
          <button
            onClick={() => setUnsplashOpen(true)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-black/5 active:scale-95 text-[12px] font-semibold transition-all ${
              isDark ? "hover:bg-white/10 text-stone-300" : "text-gray-600"
            }`}
            title="Insert Unsplash Image"
          >
            <ImageIcon className="h-[14px] w-[14px] stroke-[2]" />
            <span>Image</span>
          </button>
        </div>
      </div>

      {/* ── EDITOR CONTENT ── */}
      <div className={`flex-1 p-6 overflow-y-auto min-h-[400px] ${isDark ? "bg-stone-950 text-stone-100" : "bg-white"}`}>
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>

      <UnsplashModal
        isOpen={unsplashOpen}
        onClose={() => setUnsplashOpen(false)}
        onSelectImage={(url, alt) => {
          editor.chain().focus().setImage({ src: url, alt }).run();
          setUnsplashOpen(false);
        }}
      />
    </div>
  );
}
