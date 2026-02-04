'use client';

import { forwardRef, useEffect, useState } from "react";
import { cn } from "@/src/lib/utils/cn";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showPreview?: boolean;
  minHeight?: string;
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value,
      onChange,
      onBlur,
      label,
      error,
      helperText,
      placeholder = "Start typing...",
      disabled = false,
      required = false,
      showPreview = false,
      minHeight = "200px",
    },
    ref
  ) => {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure component only renders on client
    useEffect(() => {
      setMounted(true);
    }, []);

    // Quill toolbar configuration with formatting options
    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    };

    const formats = [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "script",
      "list",
      "indent",
      "align",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
    ];

    if (!mounted) {
      return (
        <div className="w-full">
          {label && (
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">
              {label}
              {required && <span className="ml-1 text-red-600">*</span>}
            </label>
          )}
          <div
            className="flex h-[200px] w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50"
            style={{ minHeight }}
          >
            <div className="text-sm text-gray-900">Loading editor...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full" ref={ref}>
        {label && (
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-900">
              {label}
              {required && <span className="ml-1 text-red-600">*</span>}
            </label>
            {showPreview && (
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="text-sm text-green-700 hover:text-green-800"
              >
                {isPreviewMode ? "Edit" : "Preview"}
              </button>
            )}
          </div>
        )}

        {isPreviewMode ? (
          <div
            className={cn(
              "w-full rounded-md border border-gray-300 bg-white px-4 py-3",
              "prose prose-sm max-w-none",
              "prose-headings:text-gray-900 prose-p:text-gray-900",
              "prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline",
              "prose-strong:text-gray-900 prose-code:text-gray-900",
              "prose-pre:bg-gray-100 prose-pre:text-gray-900"
            )}
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: value || "<p>No content yet...</p>" }}
          />
        ) : (
          <div
            className={cn(
              "rich-text-editor",
              error && "border-red-500",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <ReactQuill
              theme="snow"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              readOnly={disabled}
              style={{ minHeight }}
            />
          </div>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-700">{helperText}</p>
        )}

        <style jsx global>{`
          .rich-text-editor .quill {
            display: flex;
            flex-direction: column;
          }

          .rich-text-editor .ql-toolbar {
            border: 1px solid #d1d5db;
            border-top-left-radius: 0.375rem;
            border-top-right-radius: 0.375rem;
            background-color: #f9fafb;
          }

          .rich-text-editor .ql-container {
            border: 1px solid #d1d5db;
            border-top: none;
            border-bottom-left-radius: 0.375rem;
            border-bottom-right-radius: 0.375rem;
            font-family: inherit;
            font-size: 0.875rem;
            flex: 1;
          }

          .rich-text-editor .ql-editor {
            min-height: ${minHeight};
            padding: 0.75rem;
            color: #111827;
          }

          .rich-text-editor .ql-editor.ql-blank::before {
            color: #6b7280;
            font-style: normal;
          }

          .rich-text-editor .ql-editor:focus {
            outline: none;
          }

          .rich-text-editor .quill:focus-within .ql-toolbar,
          .rich-text-editor .quill:focus-within .ql-container {
            border-color: #15803d;
          }

          .rich-text-editor.border-red-500 .ql-toolbar,
          .rich-text-editor.border-red-500 .ql-container {
            border-color: #ef4444;
          }

          .rich-text-editor .ql-snow .ql-stroke {
            stroke: #374151;
          }

          .rich-text-editor .ql-snow .ql-fill {
            fill: #374151;
          }

          .rich-text-editor .ql-snow .ql-picker-label {
            color: #374151;
          }

          .rich-text-editor .ql-snow.ql-toolbar button:hover,
          .rich-text-editor .ql-snow .ql-toolbar button:hover,
          .rich-text-editor .ql-snow.ql-toolbar button:focus,
          .rich-text-editor .ql-snow .ql-toolbar button:focus,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active {
            color: #15803d;
          }

          .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar button:focus .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar button:focus .ql-stroke,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke {
            stroke: #15803d;
          }

          .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar button:hover .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar button:focus .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar button:focus .ql-fill,
          .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
          .rich-text-editor .ql-snow .ql-toolbar button.ql-active .ql-fill {
            fill: #15803d;
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
