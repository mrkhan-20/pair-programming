// src/features/editor/editorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";




interface EditorState {
  roomId: string | null;
  code: string;
  suggestion: string | null;
  members: number;
}

const initialState: EditorState = {
  roomId: null,
  code: "",
  suggestion: null,
  members: 1,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setRoomId(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
    setSuggestion(state, action: PayloadAction<string | null>) {
      state.suggestion = action.payload;
    },
    applySuggestion(state) {
      if (state.suggestion) {
        state.code = state.code + state.suggestion;
        state.suggestion = null;
      }
    },
    setMembers(state, action: PayloadAction<number>) {
      state.members = action.payload;
    },
    leaveRoom(state) {
      state.roomId = null;
      state.code = "";
      state.suggestion = null;
      state.members = 1;
    },
  },
});

export const { setRoomId, setCode, setSuggestion, applySuggestion, setMembers, leaveRoom } =
  editorSlice.actions;

export default editorSlice.reducer;
