## 📝 Standardized Spec: Reusable Toolbar Components

### 📌 Purpose / Why
Toolbar buttons like Bold, Italic, and Underline are used in both Writer and Designer roles. Creating reusable components increases code efficiency, improves maintainability, and ensures consistent UI behavior.

### 👥 Applies To
- Writer
- Designer
- Developer implementation

### 🧾 User Stories

**Developer**
- As a developer, I want to build a shared `TextFormatButton` component so toolbar buttons behave consistently across roles.
- As a developer, I want to use props to control role-based button behavior and visibility.
- As a developer, I want to simplify the logic in `WriterToolbar` and `DesignerToolbar` by using reusable components.

### ✅ Functionality Checklist
- Shared button component: `TextFormatButton`
- Props for label, icon, role, onClick, disabled
- Used in both toolbars with conditional logic
- Toolbar initializes based on role and allowed formatting
- Easily extendable for future formatting features

### 🎨 UX Behavior / Notes
- Writers only see basic formatting buttons
- Designers see extended formatting (font, color, layout)
- Disabled buttons are visible but inactive
- Button styles consistent across roles

### 🛠 Developer Notes / Summary of Implementation
- Single source of truth for text formatting button behavior
- Role-based rendering in toolbar (WriterToolbar vs DesignerToolbar)
- Example prop usage:
  ```jsx
  <TextFormatButton
    icon={<BoldIcon />}
    label="Bold"
    onClick={handleBoldClick}
    role={role}
    disabled={role !== 'Writer'}
  />
  ```

- Toolbars pass props per role:
  - Writer gets basic buttons
  - Designer gets full set

### 🎯 Acceptance Criteria
- Buttons reuse shared logic across roles
- Toolbars adjust formatting options by role
- All formatting buttons behave identically regardless of origin
- Developer can extend button behavior without rewriting toolbars

### 🚫 MVP Limitations
- No drag/drop toolbar customization
- No dynamic layout switching between vertical/horizontal
- Role permissions must be passed manually

### 🔁 Fallback Behavior
- Disabled buttons do nothing when clicked
- Hidden buttons only appear if allowed for role

### 💻 Visible UI Components
- WriterToolbar (basic formatting)
- DesignerToolbar (full formatting)
- Shared formatting buttons