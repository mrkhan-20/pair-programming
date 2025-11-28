// src/hooks/useRoomWebSocket.ts
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { setCode, setMembers} from "../features/editor/editorSlice";

const WS_URL = "ws://localhost:8000/ws"; // change in prod

export const useRoomWebSocket = (roomId: string | undefined) => {
  const dispatch = useAppDispatch();
  const code = useAppSelector((s) => s.editor.code);
  const wsRef = useRef<WebSocket | null>(null);
  const isLocalChangeRef = useRef(false);

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket(`${WS_URL}/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "members") {
        dispatch(setMembers(data.count));
      }
      if (data.type === "init") {
        dispatch(setCode(data.code || ""));
      } else if (data.type === "code_update") {
        // mark as remote change to avoid echo
        isLocalChangeRef.current = false;
        dispatch(setCode(data.code || ""));
      }
    };

    ws.onclose = () => {
      console.log("WS closed");
    };

    return () => {
      ws.close();
    };
  }, [roomId, dispatch]);

  // Send local code changes over WS
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!isLocalChangeRef.current) {
      // change came from WS itself; ignore
      isLocalChangeRef.current = true;
      return;
    }

    ws.send(
      JSON.stringify({
        type: "code_update",
        code,
      })
    );
  }, [code]);

  // helper to mark next change as local
  const markLocalChange = () => {
    isLocalChangeRef.current = true;
  };

  return { markLocalChange };
};
