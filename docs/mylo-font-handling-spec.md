## 📝 Standardized Spec: Font Handling (MVP)

### 📌 Purpose / Why
Fonts are essential to brand identity and design control. Designers need flexibility to upload or link fonts, while Writers should focus on content without being responsible for style enforcement.

### 👥 Applies To
- Designer
- Writer

### 🧾 User Stories

**Designer**
- As a Designer, I can upload a custom font file to match brand guidelines.
- As a Designer, I can assign fonts to roles (e.g. heading, body) for consistent styles.
- As a Designer, I can add fonts from a URL to support external fonts.
- As a Designer, I can preview fonts before assigning them.
- As a Designer, I can attach license info to uploaded fonts.

**Writer**
- As a Writer, I can type using system fonts for comfort.
- As a Writer, I see template-assigned fonts in preview/export so I understand the final result.

### ✅ Functionality Checklist

**Designer**
- Upload font files (`.woff2`, `.ttf`)
- Add font via URL (e.g., Google Fonts)
- Assign roles: Heading, Body, Display, Monospace
- Optionally add license metadata
- Save font settings in template metadata
- Fonts available only if assigned to current template

**Writer**
- Use system fonts during editing
- Final output uses template-assigned fonts
- No upload or assignment access

### 🎨 UX Behavior / Notes
- Fonts are lazy-loaded
- Fallbacks apply only if assigned font fails
- Designer’s view allows font preview and metadata entry
- Writer sees font changes only in preview mode

### 🛠 Developer Notes / Summary of Implementation
- Store uploaded fonts in Supabase
- Save font metadata with template
- Only assigned fonts should appear in the style panel
- Load system fonts for Writer’s editing panel
- Ensure preview panel shows template fonts regardless of Writer input

### 🎯 Acceptance Criteria
- Designer can upload/link and assign fonts
- Font assignment persists and renders correctly
- Writer’s editor uses system fonts
- Preview/export honors template fonts

### 🚫 MVP Limitations
- No font embedding in PDFs yet
- Writers cannot override fonts in template
- No font fallback override settings

### 🔁 Fallback Behavior
- If font fails to load, use defined fallback in CSS
- If no fonts assigned in template, use default system font

### 💻 Visible UI Components
- Font upload area (Designer)
- Font role selector
- Font preview sample
- Writer sees system font selector in editor only