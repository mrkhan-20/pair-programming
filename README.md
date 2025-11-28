# Pair Programming Platform

A real-time collaborative code editor that enables multiple developers to work together on code in real-time, with AI-powered autocomplete suggestions.

## How to Run Both Services

### Prerequisites

- **Python 3.11+** (for the API)
- **Node.js** (for the UI)
- **PostgreSQL** database
- **Poetry** (Python dependency management)

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE pairprogramming;
```

2. Update the database connection string in `api/src/api/db.py` if needed:
```python
DATABASE_URL = "postgresql://postgres:1234@localhost:5432/pairprogramming"
```

### Running the API (Backend)

1. Navigate to the API directory:
```bash
cd pari-programming/api
```

2. Install dependencies using Poetry:
```bash
poetry install
```

3. Activate the Poetry shell:
```bash
poetry shell
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Running the UI (Frontend)

1. Navigate to the UI directory:
```bash
cd ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The UI will be available at `http://localhost:3000`

## Architecture and Design Choices

### Backend Architecture

**Technology Stack:**
- **FastAPI**: Modern, fast Python web framework with automatic API documentation
- **SQLAlchemy**: ORM for database operations with PostgreSQL
- **WebSockets**: Real-time bidirectional communication for code synchronization
- **Poetry**: Dependency management and packaging

**Key Design Decisions:**

1. **In-Memory Code Cache**: The `ConnectionManager` maintains an in-memory cache (`room_code_cache`) to reduce database reads during active editing sessions. Code is persisted to the database on every change for durability.

2. **WebSocket Connection Management**: Each room maintains a list of active WebSocket connections, allowing efficient broadcasting of code updates to all participants in a room.

3. **Room-Based Architecture**: Rooms are identified by unique 8-character hex IDs, providing a simple way to share and join collaborative sessions.

4. **Separation of Concerns**: 
   - `models.py`: Database models
   - `repo.py`: Data access layer
   - `routers/`: API endpoints organized by feature
   - `schemas.py`: Pydantic models for request/response validation

5. **CORS Configuration**: Configured to allow the React dev server (`localhost:3000`) to communicate with the API.

### Frontend Architecture

**Technology Stack:**
- **React 19**: Modern React with hooks
- **TypeScript**: Type safety and better developer experience
- **Redux Toolkit**: Centralized state management for code, suggestions, and room state
- **React Router**: Client-side routing for navigation
- **WebSocket API**: Native browser WebSocket for real-time updates

**Key Design Decisions:**

1. **Redux State Management**: Centralized state for:
   - Code content
   - AI suggestions
   - Room information (ID, member count)
   - Enables predictable state updates and easier debugging

2. **Custom Hooks**: 
   - `useRoomWebSocket`: Encapsulates WebSocket connection logic and handles message routing
   - `useRedux`: Typed hooks for Redux integration

3. **Echo Prevention**: Uses `isLocalChangeRef` to distinguish between local edits and remote updates, preventing infinite loops when broadcasting changes.

4. **Debounced Autocomplete**: Implements a 600ms debounce on code changes before requesting autocomplete suggestions, reducing API calls.

5. **Component-Based Structure**: 
   - Pages (`HomePage`, `RoomPage`) for routing
   - Components (`CodeEditor`) for reusable UI
   - Features (`editorSlice`) for Redux slices

### Communication Flow

1. **Room Creation**: User clicks "Create Room" → POST `/rooms` → Returns room ID → Navigate to `/room/:roomId`

2. **WebSocket Connection**: On room page load → Connect to `ws://localhost:8000/ws/:roomId` → Receive initial code state

3. **Code Synchronization**: 
   - User types → Local state update → Mark as local change → Send via WebSocket
   - Receive update → Check if local → If remote, update state without echo

4. **Autocomplete**: User stops typing (600ms) → POST `/autocomplete` → Display suggestion → User can accept

## What Would Be Improved With More Time

### Backend Improvements


1. **Authentication & Authorization**: 
   - User accounts and authentication
   - Room permissions (read-only, edit, admin)
   - Room history and ownership

2. **Database Optimization**:
   - Connection pooling configuration
   - Indexing on frequently queried fields
   - Migration system (Alembic) for schema changes

3. **Real AI Autocomplete**: Replace the mock autocomplete with:
   - Integration with OpenAI/Anthropic APIs
   - Language server protocol (LSP) support
   - Context-aware suggestions based on project structure

4. **Scalability**:
   - Redis for WebSocket connection management across multiple servers
   - Message queue (RabbitMQ/Kafka) for handling high-frequency updates
   - Horizontal scaling support

5. **Error Handling & Resilience**:
   - Retry logic for WebSocket reconnections
   - Graceful degradation when database is unavailable
   - Better error messages and logging

6. **Testing**:
   - Unit tests for business logic
   - Integration tests for API endpoints
   - WebSocket connection testing
   - End-to-end tests

### Frontend Improvements

1. **Rich Code Editor**: Replace textarea with:
   - Monaco Editor (VS Code editor) or CodeMirror
   - Syntax highlighting
   - Code folding
   - Multi-cursor support
   - Find/replace functionality

2. **User Experience**:
   - Loading states and spinners
   - Error boundaries for graceful error handling
   - Toast notifications for connection status
   - Cursor position indicators for other users
   - User avatars and names

3. **Performance**:
   - Code splitting and lazy loading
   - Virtual scrolling for large files
   - Optimistic UI updates
   - Service worker for offline support

4. **Testing**:
   - Unit tests for components
   - Integration tests for Redux slices
   - E2E tests with Cypress/Playwright
   - WebSocket mocking for tests

## Limitations

### Current Limitations

1. **No Conflict Resolution**: When multiple users edit simultaneously, the last update wins. This can lead to lost changes.

2. **Full Code Transmission**: The entire code content is sent on every change, which is inefficient for large files or high-frequency typing.

3. **No Cursor Position Sync**: Users cannot see where other participants are editing in real-time.

4. **Single File Only**: The application only supports editing a single file at a time, no file tree or multi-file projects.

5. **Mock Autocomplete**: The autocomplete feature uses simple pattern matching, not real AI-powered suggestions.

6. **No Persistence Strategy**: Code is saved on every keystroke, which could be optimized with debouncing or periodic saves.

7. **No User Management**: No authentication, user identification, or user-specific features.

8. **Limited Error Handling**: Basic error handling; WebSocket disconnections may not always reconnect gracefully.

9. **Hardcoded URLs**: API and WebSocket URLs are hardcoded in the frontend, making deployment to different environments difficult.

10. **No Rate Limiting**: The API has no rate limiting, making it vulnerable to abuse.

11. **Database Connection**: Single database connection string; no connection pooling configuration visible.

12. **No Room Cleanup**: Rooms persist indefinitely in the database, even if no one is using them.

13. **Development Only**: CORS is configured only for localhost, not production-ready.

14. **No Type Safety in WebSocket Messages**: WebSocket message types are not strictly validated on the backend.

15. **Memory Growth**: The in-memory cache grows indefinitely; no cleanup mechanism for inactive rooms.
