'use client';

import { useState } from "react";
import { RichTextEditor } from "@/src/components/shared";

export default function TestEditorPage() {
  const [content, setContent] = useState("<p>Welcome to the rich text editor!</p>");
  const [contentWithPreview, setContentWithPreview] = useState("<h2>Preview Mode Test</h2><p>This editor has preview mode enabled.</p>");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rich Text Editor Test
          </h1>
          <p className="text-gray-600">
            Testing the RichTextEditor component with various configurations
          </p>
        </div>

        {/* Basic Editor */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Editor
          </h2>
          <RichTextEditor
            label="Article Content"
            value={content}
            onChange={setContent}
            placeholder="Start writing your article..."
            helperText="Use the toolbar to format your text"
            required
          />
        </div>

        {/* Editor with Preview Mode */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Editor with Preview Mode
          </h2>
          <RichTextEditor
            label="News Content"
            value={contentWithPreview}
            onChange={setContentWithPreview}
            placeholder="Write your news article..."
            showPreview={true}
            minHeight="300px"
          />
        </div>

        {/* Editor with Error State */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Editor with Error State
          </h2>
          <RichTextEditor
            label="Description"
            value=""
            onChange={() => {}}
            error="This field is required"
            required
          />
        </div>

        {/* Disabled Editor */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Disabled Editor
          </h2>
          <RichTextEditor
            label="Read-only Content"
            value="<p>This content cannot be edited.</p>"
            onChange={() => {}}
            disabled={true}
          />
        </div>

        {/* Current Content Display */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Content (HTML)
          </h2>
          <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}
