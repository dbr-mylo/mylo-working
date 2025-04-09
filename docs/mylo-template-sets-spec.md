## 📝 Standardized Spec: Template Sets (MVP)

### 📌 Purpose / Why
Template Sets help organize and control visibility of branded templates within an organization. They simplify template management and ensure the right templates are available to the right users.

### 👥 Applies To
- Designer
- Writer
- Team/Org environments

### 🧾 User Stories

**Designer**
- As a Designer, I want to create Template Sets to organize templates by team or use case.
- As a Designer, I want to assign sets to specific roles or teams.
- As a Designer, I want to edit or delete Template Sets as needed.

**Writer**
- As a Writer, I want to see only the Template Sets assigned to me.
- As a Writer, I want to preview templates before selecting one.
- As a Writer, I want to apply templates from an assigned set.

### ✅ Functionality Checklist
- Templates belong to a company workspace
- Template Sets are named collections of templates
- Designer can assign visibility (role/team-based)
- Writer only sees assigned/public sets
- Templates in a set always use the latest published version

### 🎨 UX Behavior / Notes
- Template Sets are visible in the template picker
- Writer UI filters templates by assigned sets
- Public templates are shown if no sets are available
- Set does not modify style—only grouping and visibility

### 🛠 Developer Notes / Summary of Implementation
- Define TemplateSet schema:
  ```ts
  TemplateSet {
    id: string
    name: string
    description?: string
    templateIds: string[]
    visibility: 'public' | 'private'
    assignedRoles: string[]
    assignedTeams?: string[]
    createdBy: string
    createdAt: Date
    updatedAt: Date
  }
  ```
- Store sets at the company level
- Respect role-based permissions on visibility
- Update template selector logic to use sets

### 🎯 Acceptance Criteria
**Designer**
- Can create/edit/delete sets
- Can assign visibility
- Can manage templates within sets

**Writer**
- Sees only assigned or public sets
- Can preview and apply templates from a set
- Cannot modify or access private templates

### 🚫 MVP Limitations
- No version pinning (uses latest version)
- No template search/filter within sets
- No nested sets or tagging
- No audit log for changes

### 🔁 Fallback Behavior
| Scenario                        | Behavior                             |
|--------------------------------|--------------------------------------|
| Writer has no sets             | Show all public templates            |
| Set is empty                   | Show "no templates" message         |
| Template removed from set      | Remove silently                      |
| Writer opens doc with missing template | Show fallback or warning        |

### 💻 Visible UI Components
- Template picker (filtered by set)
- Set list (Designer view)
- Assign roles/teams to set