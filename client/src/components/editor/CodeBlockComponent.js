"use client";

import React, { useState, useEffect } from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Copy, Check, Code2 } from "lucide-react";

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}) {
  const [copied, setCopied] = useState(false);
  const [detectedLang, setDetectedLang] = useState("");

  const selectedLanguage = node.attrs.language || "auto";
  const codeContent = node.textContent || "";

  // Available languages from lowlight
  const lowlight = extension.options.lowlight;
  const registeredLanguages = lowlight ? lowlight.listLanguages() : [];

  // Friendly names for dropdown
  const friendlyNames = {
    auto: "Auto-Detect",
    javascript: "JavaScript",
    typescript: "TypeScript",
    html: "HTML",
    css: "CSS",
    python: "Python",
    cpp: "C++",
    csharp: "C#",
    java: "Java",
    php: "PHP",
    ruby: "Ruby",
    sql: "SQL",
    go: "Go",
    rust: "Rust",
    swift: "Swift",
    kotlin: "Kotlin",
    yaml: "YAML",
    bash: "Bash / Shell",
    json: "JSON",
    markdown: "Markdown",
  };

  // Run auto-detection when codeContent changes and language is 'auto'
  useEffect(() => {
    if (selectedLanguage === "auto" && codeContent.trim() !== "") {
      try {
        const result = lowlight.highlightAuto(codeContent);
        if (result && result.data && result.data.language) {
          const detected = result.data.language;
          setDetectedLang(friendlyNames[detected] || detected.charAt(0).toUpperCase() + detected.slice(1));
        } else {
          setDetectedLang("");
        }
      } catch (e) {
        setDetectedLang("");
      }
    } else {
      setDetectedLang("");
    }
  }, [codeContent, selectedLanguage, lowlight]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    updateAttributes({ language: lang === "auto" ? null : lang });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <NodeViewWrapper className="editor-code-block-container">
      <div className="editor-code-block-header" contentEditable={false}>
        <div className="editor-code-block-title">
          <Code2 className="h-4 w-4 text-gray-400" />
          <span>
            {selectedLanguage === "auto"
              ? `Auto-Detect${detectedLang ? ` (${detectedLang})` : ""}`
              : friendlyNames[selectedLanguage] || selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
          </span>
        </div>
        <div className="editor-code-block-actions">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="editor-code-block-select"
          >
            <option value="auto">Auto-Detect</option>
            {registeredLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {friendlyNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleCopy}
            className={`editor-code-block-copy-btn ${copied ? "copied" : ""}`}
            title="Copy Code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gray-500" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
