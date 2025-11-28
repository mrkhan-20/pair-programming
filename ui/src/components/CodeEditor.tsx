// src/components/CodeEditor.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  setCode,
  setSuggestion,
  applySuggestion,
} from "../features/editor/editorSlice";

const API_BASE = "http://localhost:8000";

interface Props {
  onLocalChange?: () => void;
}

const editorContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "500px",
  fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
  fontSize: "14px",
  lineHeight: "1.6",
  padding: "20px",
  border: "2px solid #e0e0e0",
  borderRadius: "8px",
  resize: "vertical",
  outline: "none",
  transition: "border-color 0.3s ease",
  background: "#1e1e1e",
  color: "#d4d4d4",
  tabSize: 2,
};

const suggestionContainerStyle: React.CSSProperties = {
  border: "2px solid #667eea",
  borderRadius: "8px",
  padding: "16px",
  background: "linear-gradient(135deg, #f8f9ff 0%, #f0f0ff 100%)",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
};

const suggestionHeaderStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#667eea",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const suggestionCodeStyle: React.CSSProperties = {
  margin: 0,
  padding: "12px",
  background: "white",
  borderRadius: "6px",
  fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
  fontSize: "13px",
  color: "#333",
  border: "1px solid #e0e0e0",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const applyButtonStyle: React.CSSProperties = {
  marginTop: "12px",
  padding: "10px 20px",
  backgroundColor: "#667eea",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
};

export const CodeEditor: React.FC<Props> = ({ onLocalChange }) => {
  const dispatch = useAppDispatch();
  const code = useAppSelector((s) => s.editor.code);
  const suggestion = useAppSelector((s) => s.editor.suggestion);

  const [typingTimeout, setTypingTimeout] = useState<number | undefined>(
    undefined
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onLocalChange) onLocalChange();
    const value = e.target.value;
    dispatch(setCode(value));

    if (typingTimeout) {
      window.clearTimeout(typingTimeout);
    }

    const timeout = window.setTimeout(() => {
      fetch(`${API_BASE}/autocomplete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: value,
          cursorPosition: value.length,
          language: "python",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(setSuggestion(data.suggestion));
        })
        .catch(() => {
          dispatch(setSuggestion(null));
        });
    }, 600);

    setTypingTimeout(timeout);
  };

  const handleApplySuggestion = () => {
    dispatch(applySuggestion());
  };

  return (
    <div style={editorContainerStyle}>
      <textarea
        style={{
          ...textareaStyle,
          borderColor: suggestion ? "#667eea" : "#e0e0e0",
        }}
        value={code}
        onChange={handleChange}
        onFocus={(e) => {
          e.target.style.borderColor = "#667eea";
          e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = suggestion ? "#667eea" : "#e0e0e0";
          e.target.style.boxShadow = "none";
        }}
        placeholder="Start typing your code here..."
        spellCheck={false}
      />
      {suggestion && (
        <div style={suggestionContainerStyle}>
          <div style={suggestionHeaderStyle}>
            <span>💡</span>
            <span>AI Suggestion</span>
          </div>
          <pre style={suggestionCodeStyle}>{suggestion}</pre>
          <button
            onClick={handleApplySuggestion}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...applyButtonStyle,
              transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: isHovered
                ? "0 4px 12px rgba(102, 126, 234, 0.4)"
                : "0 2px 8px rgba(102, 126, 234, 0.3)",
            }}
          >
            Accept Suggestion
          </button>
        </div>
      )}
    </div>
  );
};
