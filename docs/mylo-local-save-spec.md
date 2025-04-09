## 📝 Standardized Spec: Local Save & Export

### 📌 Purpose / Why
Enable users to save and reopen documents locally, as well as export final documents to shareable formats. This builds user trust, supports offline workflows, and provides flexibility for both Writers and Designers.

### 👥 Applies To
- Writer
- Designer

### 🧾 User Stories

**Writer**
- As a Writer, I can save my document as a `.mylo` file to keep a backup on my device.
- As a Writer, I can reopen a `.mylo` file later and continue editing where I left off.
- As a Writer, I can export a final version as a PDF to share.

**Designer**
- As a Designer, I can save a template locally as a `.mylo` file so I can reuse or share it.
- As a Designer, I can import a `.mylo` file and update the styles or layout.
- As a Designer, I can export a styled PDF for testing or sharing with stakeholders.

### ✅ Functionality Checklist
- Cloud autosave (default)
- Manual Save to Device (`.mylo`)
- Export to PDF (template styling applied)
- File includes metadata (`type`, `role`, `version`)
- Role-based file access:
  - Writers can open/save documents
  - Designers can open/save both documents and templates

### 🎨 UX Behavior / Notes
- File menu offers Save to Device, Export, and Import from File
- Extension is `.mylo` (brand placeholder)
- Import infers role/type from file metadata, not extension
- Export to PDF uses applied template style

### 🛠 Developer Notes / Summary of Implementation
- Show export options in file menu
- Save metadata in each file
- Parse metadata to load file into correct mode
- Do not hardcode `.mylo` extension in logic
- Ensure backward compatibility with future file extensions

### 🎯 Acceptance Criteria
- Files open in the correct mode (Writer or Designer)
- Exported PDF reflects correct formatting
- Local `.mylo` file includes all content and template data
- Designer can import templates; Writer cannot

### 🚫 MVP Limitations
- Only PDF export supported (for now)
- No embedding of fonts in PDF yet
- Final file extension may change

### 🔁 Fallback Behavior
| Scenario                          | Behavior                              |
|----------------------------------|---------------------------------------|
| Unsupported extension            | Try to parse content metadata         |
| File with invalid metadata       | Show error and abort open             |
| Writer opens a template file     | Show error or warning, block access   |

### 💻 Visible UI Components
- File dropdown menu
- Export button
- Import file selector