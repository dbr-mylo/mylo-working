
# Mylo Developer Handoff Document (v2)

---

## ✅ Auto-Save System

### 🔁 Trigger Conditions
- [x] Auto-save after 2 seconds of inactivity (Writer)
- [x] Auto-save immediately after user actions (e.g. style changes, layout moves)
- [x] Background snapshot every 30 seconds

### 💾 What Gets Saved
- [x] Save only what's changed (per text box, style block, asset)
- [x] Writer: raw text, formatting, structure, images, metadata
- [x] Designer: styles, layout, assets, permissions

### 🧠 Versioning Logic
- [x] Lightweight diffs saved on major actions (e.g. apply template)
- [x] Stored internally (not exposed in UI yet)

### 🔒 Conflict Handling
- [x] Assume single-user editing
- [ ] Future: Manage content conflicts and notify when content changes interfere with template styles or layout.

### 📶 Offline Support (Future)
- [ ] Cache unsaved changes locally (IndexedDB)
- [ ] Show status: “Offline – saving locally” or “Changes will sync”

---

## 🟢 Auto-Save Indicator

### 📍 Location
- Top bar status, consistent across Writer and Designer

### 💬 States
- `Saving…`
- `All changes saved`
- `Offline – saving locally`
- `Changes not saved`

### 🕒 Tooltip
- Shows timestamp of last successful save

---

## 💡 Manual Save Option

### 🔘 “Save Now” Button
- [x] Placed in File menu or overflow
- [x] Triggers same logic as auto-save
- [x] Updates indicator: “Saving…” → “All changes saved”
- [x] Does **not** create a version checkpoint

---

## ↩️ Undo/Redo System

### 🧭 General Behavior
- [x] Undo/redo is **session-based**, **local to tab**
- [x] Separate from auto-save — saving does not clear undo stack
- [ ] Undo history is cleared on page reload

### 🎯 Scope
- **Writer**:
  - Typing
  - Text formatting
  - Image placement
  - List changes
- **Designer**:
  - Layout adjustments
  - Style changes
  - Object moves
  - Asset insertions

### 🎹 Keyboard Support
- `Cmd+Z / Ctrl+Z`: Undo  
- `Cmd+Shift+Z / Ctrl+Shift+Z`: Redo

### 🧪 Future Consideration
- Persistent undo history (like Figma or Docs)
  - Tie into: style snapshots, template checkpoints, document versions

---

