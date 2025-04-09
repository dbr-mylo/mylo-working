## 📝 Standardized Spec: Role-Based Routing & Permissions (Writer Role)

### 📌 Purpose / Why
Writers should only have access to content editing tools and be restricted from accessing design-related pages or features intended for Designers.

### 👥 Applies To
- Writer
- Designer (for comparison)
- Routing/permissions logic

### 🧾 User Stories

**Writer**
- As a Writer, I want access only to writing-related pages.
- As a Writer, I want clear feedback if I try to access a restricted feature.
- As a Writer, I want to use only tools relevant to writing.

**Developer**
- As a developer, I want to restrict page access based on user role.
- As a developer, I want to conditionally render toolbar features by role.
- As a developer, I want to redirect unauthorized users with alerts or messages.

### ✅ Functionality Checklist
- React Router used for role-based page access
- Writers allowed on `/write`, `/documents`, `/drafts`
- Designers allowed on `/templates`, `/design-settings`, `/layout`
- UI elements (buttons, panels) conditionally rendered
- Unauthorized access redirects to `/write`
- Alerts shown for unauthorized attempts

### 🎨 UX Behavior / Notes
- Writers redirected from restricted pages
- Buttons disabled or hidden based on role
- Alerts explain access restrictions
- Roles persist on refresh via localStorage
- Default to Writer if role is undefined

### 🛠 Developer Notes / Summary of Implementation
- Use `<Navigate>` for redirect logic
- Pass role into UI components and route guards
- Store role in localStorage and use on startup
- Add test cases to validate role checks
- Examples:
  ```jsx
  <Route path="/design-settings" element={isDesigner ? <DesignSettings /> : <Navigate to="/write" />} />
  ```

### 🎯 Acceptance Criteria
- Writer cannot access design-related routes or tools
- Writer UI only shows relevant buttons and features
- Redirects and alerts work as expected
- Role stored and applied consistently

### 🚫 MVP Limitations
- Role must be manually set on login
- No fine-grained permission controls
- No admin override UI yet

### 🔁 Fallback Behavior
- No role: fallback to Writer
- Invalid access: redirect with alert or toast

### 💻 Visible UI Components
- Writer-only pages: `/write`, `/documents`, `/drafts`
- Writer toolbar with basic formatting
- No access to style panels, templates, or layout boards