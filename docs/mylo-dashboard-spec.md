## 📝 Standardized Spec: Mylo Dashboard Requirements

### 📌 Purpose / Why
The dashboard serves as the central hub for users to access their documents and templates. It supports both individual and organizational workflows, offering recent files, project folders, and onboarding guidance.

### 👥 Applies To
- Writer
- Designer
- Solo users
- Team/Org users

### 🧾 User Stories
**Writer**
- As a Writer, I want to see recent documents so I can continue working easily.
- As a Writer, I want to start from a blank doc or a template depending on my needs.

**Designer**
- As a Designer, I want to create new templates from the dashboard.
- As a Designer, I want to organize documents and templates in folders or projects.

**Any User**
- As a user, I want to find my work quickly.
- As a user, I want help choosing templates when getting started.

### ✅ Functionality Checklist
- List view of recent documents and templates
- Projects/folders for file organization
- Buttons: New Document, New from Template, New Template (Designer only)
- Template section that adapts to user type (org-assigned vs suggested)
- Optional onboarding questions

### 🎨 UX Behavior / Notes
- List view prioritizes clarity over visuals
- File info includes: name, last edited, type, folder
- Organization vs individual UX differences
- Future: grid view, recommendations, onboarding preferences

### 🛠 Developer Notes / Summary of Implementation
- Role-aware access to new template creation
- File metadata fetched and displayed by role and scope
- Toggle visibility for template section based on org or solo status
- Use Supabase or similar for file storage

### 🎯 Acceptance Criteria
- Writer and Designer see appropriate views
- Files grouped logically
- "Start" buttons functional
- Org users see only company templates
- Individuals see defaults and suggestions

### 🚫 MVP Limitations
- No grid view yet
- No template recommendation engine
- No advanced filtering or sorting

### 🔁 Fallback Behavior
- If no files exist: show empty state and onboarding
- If template section empty: hide or show message

### 💻 Visible UI Components
- Recent file list
- Folder/project sidebar
- Template browser
- Start buttons (New Document, New Template)
- Onboarding modal (if needed)