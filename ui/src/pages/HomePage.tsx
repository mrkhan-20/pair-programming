// src/pages/HomePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "16px",
  padding: "48px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  maxWidth: "500px",
  width: "100%",
};

const titleStyle: React.CSSProperties = {
  fontSize: "42px",
  fontWeight: "700",
  margin: "0 0 8px 0",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textAlign: "center",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#666",
  margin: "0 0 32px 0",
  textAlign: "center",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 28px",
  fontSize: "16px",
  fontWeight: "600",
  color: "white",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  width: "100%",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
};

const buttonHoverStyle: React.CSSProperties = {
  transform: "translateY(-2px)",
  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
};

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "16px",
  border: "2px solid #e0e0e0",
  borderRadius: "8px",
  width: "100%",
  marginBottom: "12px",
  transition: "all 0.3s ease",
  fontFamily: "inherit",
  outline: "none",
};

const sectionStyle: React.CSSProperties = {
  marginTop: "32px",
  paddingTop: "32px",
  borderTop: "1px solid #e0e0e0",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px 0",
  color: "#333",
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleCreateRoom = async () => {
    const res = await fetch(`${API_BASE}/rooms`, { method: "POST" });
    const data = await res.json();
    navigate(`/room/${data.roomId}`);
  };

  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) return;
    navigate(`/room/${joinRoomId.trim()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Pair Programming</h1>
        <p style={subtitleStyle}>
          Collaborate in real-time with your team
        </p>

        <button
          onClick={handleCreateRoom}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...buttonStyle,
            ...(isHovered ? buttonHoverStyle : {}),
          }}
        >
          Create New Room
        </button>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Join Existing Room</h3>
          <input
            placeholder="Enter room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
              e.target.style.boxShadow = "none";
            }}
            style={inputStyle}
          />
          <button
            onClick={handleJoinRoom}
            disabled={!joinRoomId.trim()}
            style={{
              ...buttonStyle,
              opacity: joinRoomId.trim() ? 1 : 0.6,
              cursor: joinRoomId.trim() ? "pointer" : "not-allowed",
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};
