## 📝 Standardized Spec: Mylo UI & Autosave Requirements

### 📌 Purpose / Why
To create a modern, autosave-first UI that assures users their work is being saved in real time, without the need for manual action.

### 👥 Applies To
- Writer
- Designer
- Web and future desktop app versions

### 🧾 User Stories
**Writer**
- As a Writer, I want to see a clear indicator that my work is being saved automatically.
- As a Writer, I want to rename my file without leaving the writing interface.
- As a Writer, I want to export or save a local copy.

**Designer**
- As a Designer, I want to rename, save, and manage templates easily.
- As a Designer, I want confirmation that my design changes are saved.

### ✅ Functionality Checklist
- Autosave triggered on text input, formatting, layout changes, and page nav
- Saving status indicator: Saving…, Saved, Offline Saved, Syncing
- Editable file name in top bar with dropdown menu:
  - Version history, Save to device, Export, Duplicate, Move, Delete
- Export: PDF (later: TXT, DOCX, etc.)
- Save to device: native `.mylo` file with metadata
- Load local file into correct mode

### 🎨 UX Behavior / Notes
- Subtle animation or color on saving status
- Tooltip for last saved timestamp
- Inline file name editing
- Feedback for offline state
- No "Save" button in UI

### 🛠 Developer Notes / Summary of Implementation
- Use debounce/throttle for save triggers
- Dynamic label updates
- Store local copy during offline mode
- Unified component for file name and dropdown actions
- Role-sensitive export/save logic

### 🎯 Acceptance Criteria
- User sees live feedback for autosave
- File saves in cloud or local cache
- File name editable inline
- Dropdown shows all relevant file actions

### 🚫 MVP Limitations
- Only `.pdf` export supported initially
- No font embedding in PDF yet
- Versioning only accessible via dropdown

### 🔁 Fallback Behavior
- Offline: local save + sync on reconnect
- Error saving: retry and show error toast

### 💻 Visible UI Components
- File name and dropdown
- Save status label
- Export and Open buttons