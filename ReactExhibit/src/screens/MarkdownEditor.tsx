import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import TransitionWrapper from "../components/TransitionWrapper";

const TEMPLATES = {
  empty: "",
  readme: `# Project Name

A brief description of what this project does.

## Installation

\`\`\`bash
npm install my-project
\`\`\`

## Usage

\`\`\`javascript
import { something } from 'my-project';

something();
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## License

MIT`,
  blog: `# Blog Post Title

*Published on January 1, 2025*

## Introduction

Start with a hook to grab readers' attention...

## Main Content

### First Point

Explain your first point here.

### Second Point

Explain your second point here.

> "A relevant quote that supports your argument."

## Conclusion

Wrap up your thoughts and call to action.

---

*Thanks for reading!*`,
  notes: `# Meeting Notes

**Date:** January 1, 2025
**Attendees:** Alice, Bob, Charlie

## Agenda

1. Project updates
2. Q1 planning
3. Open discussion

## Notes

### Project Updates

- [x] Task 1 completed
- [ ] Task 2 in progress
- [ ] Task 3 pending

### Action Items

| Owner | Task | Due Date |
|-------|------|----------|
| Alice | Review PR | Jan 5 |
| Bob | Update docs | Jan 7 |

## Next Meeting

January 8, 2025 at 2:00 PM`,
  changelog: `# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-01-15

### Added
- New feature X for better performance
- Support for dark mode

### Changed
- Updated dependencies to latest versions
- Improved error handling

### Fixed
- Bug where users couldn't save settings
- Memory leak in background process

## [1.1.0] - 2025-01-01

### Added
- Initial release
- Basic functionality
- User authentication`,
  checklist: `# Project Checklist

## Planning
- [ ] Define project scope
- [ ] Create wireframes
- [ ] Write technical specification
- [ ] Set up project timeline

## Development
- [ ] Set up development environment
- [ ] Implement core features
- [ ] Write unit tests
- [ ] Code review

## Testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Performance testing
- [ ] Security audit

## Deployment
- [ ] Prepare production environment
- [ ] Create deployment scripts
- [ ] Set up monitoring
- [ ] Launch! 🚀

---

**Progress:** 0/16 tasks completed`,
};

type TemplateName = keyof typeof TEMPLATES;

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem("markdown-content");
    return saved || TEMPLATES.readme;
  });
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("split");
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName | "">("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("markdown-content", markdown);
  }, [markdown]);

  // Toggle checkbox in markdown
  const toggleCheckbox = useCallback((checkboxIndex: number) => {
    const lines = markdown.split('\n');
    let currentCheckbox = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match both checked and unchecked checkboxes
      const uncheckedMatch = line.match(/^(\s*-\s*)\[ \]/);
      const checkedMatch = line.match(/^(\s*-\s*)\[x\]/i);

      if (uncheckedMatch || checkedMatch) {
        if (currentCheckbox === checkboxIndex) {
          if (uncheckedMatch) {
            lines[i] = line.replace(/^(\s*-\s*)\[ \]/, '$1[x]');
          } else {
            lines[i] = line.replace(/^(\s*-\s*)\[x\]/i, '$1[ ]');
          }
          setMarkdown(lines.join('\n'));
          return;
        }
        currentCheckbox++;
      }
    }
  }, [markdown]);

  // Track checkbox index for rendering
  const checkboxIndexRef = useRef(0);

  // Custom components for ReactMarkdown
  const markdownComponents: Components = {
    input: ({ type, checked, ...props }) => {
      if (type === 'checkbox') {
        const index = checkboxIndexRef.current++;
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleCheckbox(index)}
            className="cursor-pointer"
            {...props}
          />
        );
      }
      return <input type={type} checked={checked} {...props} />;
    },
  };

  // Insert text at cursor position
  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);

    setMarkdown(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Toolbar actions
  const toolbarActions = [
    { icon: "B", title: "Bold", action: () => insertText("**", "**") },
    { icon: "I", title: "Italic", action: () => insertText("*", "*") },
    { icon: "S", title: "Strikethrough", action: () => insertText("~~", "~~") },
    { icon: "H1", title: "Heading 1", action: () => insertText("# ") },
    { icon: "H2", title: "Heading 2", action: () => insertText("## ") },
    { icon: "•", title: "Bullet List", action: () => insertText("- ") },
    { icon: "1.", title: "Numbered List", action: () => insertText("1. ") },
    { icon: "[]", title: "Checkbox", action: () => insertText("- [ ] ") },
    { icon: "<>", title: "Code", action: () => insertText("`", "`") },
    { icon: "```", title: "Code Block", action: () => insertText("```\n", "\n```") },
    { icon: "→", title: "Link", action: () => insertText("[", "](url)") },
    { icon: "❝", title: "Quote", action: () => insertText("> ") },
    { icon: "—", title: "Horizontal Rule", action: () => insertText("\n---\n") },
  ];

  // Copy markdown to clipboard
  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export as HTML
  const exportHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  ${document.querySelector('.markdown-preview')?.innerHTML || ''}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load template
  const loadTemplate = (name: TemplateName) => {
    setMarkdown(TEMPLATES[name]);
  };

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;

  return (
    <TransitionWrapper>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Markdown</span> Editor
          </h1>
          <p className="text-white/60">Write markdown, see it rendered in real-time</p>
        </div>

        {/* Toolbar */}
        <div className="glass-card mb-4 p-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Format buttons */}
            <div className="flex flex-wrap gap-1">
              {toolbarActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.action}
                  title={action.title}
                  aria-label={action.title}
                  className="px-3 py-1.5 rounded-lg text-sm font-mono hover:bg-white/10 transition-colors"
                >
                  {action.icon}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-white/20 mx-2" />

            {/* Templates */}
            <select
              aria-label="Templates"
              onChange={(e) => {
                loadTemplate(e.target.value as TemplateName);
                setSelectedTemplate(e.target.value as TemplateName);
              }}
              value={selectedTemplate}
              className="glass-select py-1.5 px-3 text-sm pr-8 w-[150px]"
            >
              <option value="" disabled hidden>Templates</option>
              <option value="empty">Empty document</option>
              <option value="readme">README.md</option>
              <option value="blog">Blog Post</option>
              <option value="notes">Meeting Notes</option>
              <option value="changelog">Changelog</option>
              <option value="checklist">Checklist</option>
            </select>

            <div className="flex-1" />

            {/* View toggle */}
            <div className="flex gap-1 glass rounded-lg p-1" role="group" aria-label="Editor view">
              {(["edit", "split", "preview"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-white/20 mx-2" />

            {/* Export buttons */}
            <button
              onClick={copyMarkdown}
              className="btn-glass py-1.5 px-3 text-sm flex items-center gap-1"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={exportHTML}
              className="btn-glass py-1.5 px-3 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className={`grid gap-4 ${activeTab === "split" ? "md:grid-cols-2" : ""}`}>
          {/* Textarea */}
          {(activeTab === "edit" || activeTab === "split") && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-0 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-sm text-white/60">Markdown</span>
                <span className="text-xs text-white/40">
                  {wordCount} words · {charCount} chars
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                aria-label="Markdown editor"
                className="w-full h-[500px] p-4 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
                placeholder="Start writing markdown..."
                spellCheck={false}
              />
            </motion.div>
          )}

          {/* Preview */}
          {(activeTab === "preview" || activeTab === "split") && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-0 overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-white/10">
                <span className="text-sm text-white/60">Preview</span>
              </div>
              <div className="h-[500px] overflow-y-auto p-4">
                <div className="markdown-preview prose prose-invert prose-sm max-w-none" role="region" aria-label="Markdown preview">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {(checkboxIndexRef.current = 0, markdown)}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 glass-card">
          <h3 className="font-semibold mb-3">Markdown Shortcuts</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <code className="text-neon-pink">**bold**</code>
              <span className="text-white/60 ml-2">→ <strong>bold</strong></span>
            </div>
            <div>
              <code className="text-neon-pink">*italic*</code>
              <span className="text-white/60 ml-2">→ <em>italic</em></span>
            </div>
            <div>
              <code className="text-neon-pink">~~strike~~</code>
              <span className="text-white/60 ml-2">→ <s>strike</s></span>
            </div>
            <div>
              <code className="text-neon-pink"># Heading</code>
              <span className="text-white/60 ml-2">→ H1-H6</span>
            </div>
            <div>
              <code className="text-neon-pink">[link](url)</code>
              <span className="text-white/60 ml-2">→ hyperlink</span>
            </div>
            <div>
              <code className="text-neon-pink">![alt](url)</code>
              <span className="text-white/60 ml-2">→ image</span>
            </div>
            <div>
              <code className="text-neon-pink">`code`</code>
              <span className="text-white/60 ml-2">→ <code>inline</code></span>
            </div>
            <div>
              <code className="text-neon-pink">```lang</code>
              <span className="text-white/60 ml-2">→ code block</span>
            </div>
            <div>
              <code className="text-neon-pink">- item</code>
              <span className="text-white/60 ml-2">→ bullet list</span>
            </div>
            <div>
              <code className="text-neon-pink">1. item</code>
              <span className="text-white/60 ml-2">→ numbered list</span>
            </div>
            <div>
              <code className="text-neon-pink">- [ ] task</code>
              <span className="text-white/60 ml-2">→ checkbox</span>
            </div>
            <div>
              <code className="text-neon-pink">&gt; quote</code>
              <span className="text-white/60 ml-2">→ blockquote</span>
            </div>
            <div>
              <code className="text-neon-pink">| a | b |</code>
              <span className="text-white/60 ml-2">→ table</span>
            </div>
            <div>
              <code className="text-neon-pink">---</code>
              <span className="text-white/60 ml-2">→ horizontal rule</span>
            </div>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default MarkdownEditor;
