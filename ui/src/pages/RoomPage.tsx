// src/pages/RoomPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { setRoomId, leaveRoom } from "../features/editor/editorSlice";
import { useRoomWebSocket } from "../hooks/useRoomWebSocket";
import { CodeEditor } from "../components/CodeEditor";

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "24px",
};

const headerStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "12px",
  padding: "20px 24px",
  marginBottom: "24px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const headerInfoStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const roomTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
  color: "#333",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const roomIdStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#667eea",
  fontFamily: "monospace",
  background: "#f0f0ff",
  padding: "4px 12px",
  borderRadius: "6px",
};

const participantsStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  color: "#666",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "#f0f0ff",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#667eea",
};

const leaveButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
};

const editorContainerStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
};

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const members = useAppSelector((s) => s.editor.members);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (roomId) {
      dispatch(setRoomId(roomId));
    }
  }, [roomId, dispatch]);

  const { markLocalChange } = useRoomWebSocket(roomId);

  const handleLeaveRoom = () => {
    dispatch(leaveRoom());
    navigate("/");
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerInfoStyle}>
          <h2 style={roomTitleStyle}>
            Room:
            <span style={roomIdStyle}>{roomId}</span>
          </h2>
          <p style={participantsStyle}>
            <span style={badgeStyle}>
              <span>👤</span>
              <span>You</span>
            </span>
            {members > 1 && (
              <span style={badgeStyle}>
                <span>👥</span>
                <span>{members} participants</span>
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleLeaveRoom}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...leaveButtonStyle,
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
            boxShadow: isHovered
              ? "0 4px 12px rgba(239, 68, 68, 0.4)"
              : "0 2px 8px rgba(239, 68, 68, 0.3)",
          }}
        >
          Leave Room
        </button>
      </div>
      <div style={editorContainerStyle}>
        <CodeEditor onLocalChange={markLocalChange} />
      </div>
    </div>
  );
};
