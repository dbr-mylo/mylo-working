
# ✨ Feature Handoff: Zoom Functionality

## ✅ Status
MVP

## 🎯 Purpose
Zoom enables users to adjust the scale of the canvas to improve legibility and layout precision. This is especially important for visual design tasks (Designer role) and accessibility/readability (Writer role).

- **Designer Role**: Needs precise control over layout and alignment, similar to Figma or Illustrator.
- **Writer Role**: Needs simple zoom controls for readability and navigation of long documents.

## 👥 Roles Affected
- Designer
- Writer

## 🧠 User Expectations

### Designer
- Zoom from 10% to 800%
- Keyboard shortcuts (`Cmd/Ctrl +/-`, `0` to reset)
- Zoom-to-fit and zoom-to-selection
- Visible zoom control (slider or dropdown)

### Writer
- Zoom from 50% to 200%
- Optional UI controls (in settings or dropdown)
- Keyboard zoom optional
- Focus is on readability, not precision

## 🛠 Implementation Notes

### Zoom Method
Apply CSS `transform: scale(...)` on the `.canvas-content` container.

```css
.canvas-content {
  transform: scale(1);
  transform-origin: top left;
}
```

### Zoom Logic (Pseudocode)

```ts
function setZoom(level: number) {
  canvas.style.transform = `scale(${level})`
}
```

Use a shared `useZoom()` hook or utility function with role-based config:

```ts
const config = getZoomConfigForRole(role)
```

### Role-Based Config Example

```ts
function getZoomConfigForRole(role) {
  return role === 'designer'
    ? { min: 0.1, max: 8, steps: [0.25, 0.5, 1, 2, 4, 8] }
    : { min: 0.5, max: 2, steps: [0.5, 1, 1.5, 2] };
}
```

## 🧩 UI Requirements

### Designer
- Zoom slider or dropdown visible at all times
- Zoom presets: 25%, 50%, 100%, 200%, Fit, Selection
- Mini-map (future)
- Smooth animated zoom (optional)

### Writer
- Simple zoom dropdown in settings or toolbar
- No zoom-to-fit or selection
- Minimal UI footprint

## 💾 Persistence
- For MVP: store in memory (session only)
- Future: persist per document per user

## ⚠️ Edge Cases
- Scaled content must remain scrollable
- Maintain accurate pointer positioning
- Avoid blur: let browser render text at full res

## 🔮 Future Considerations
- Mini-map for navigation (Designer)
- Pinch-to-zoom on trackpads/touch devices
- Animated zoom transitions
- Presets like “Page Width” and “Actual Size”
- Zoom state saved per document/user
- Accessibility settings: default zoom preferences
