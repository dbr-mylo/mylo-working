## User Story: Adjusting Font Size with Increment/Decrement Controls

### Roles
Designer, Writer

### Goal
To select text in the Editor and adjust its font size using intuitive increase and decrease buttons.

### Benefit
Provides users with quick, precise control over text sizing, improving productivity and reducing the need for manual input of font sizes.

### Acceptance Criteria
- User can select text in the Editor.
- A font sizing control appears in the formatting panel.
- The control includes:
  - A numerical font size input field.
  - An up arrow (↑) to increase the font size by 1pt.
  - A down arrow (↓) to decrease the font size by 1pt.
- Font size changes apply in real-time to the selected text.
- Users can also manually type a specific font size.
- The minimum font size is 1pt; the maximum font size is 99pt.
- If no text is selected:
  - The font size control is either disabled or updates the default font size for new text.

### Designer Role Behavior:
- Can adjust font size as part of a text style or directly in the layout.
- May set default font sizes for various text elements.

### Writer Role Behavior:
- Font size changes are reflected in the editing view.
- The final output, however, follows the assigned template styles during preview/export, overriding any font size changes made in the editor.

### Notes
- Font size step is fixed at 1pt.
- Keyboard Shortcuts: Consider adding keyboard shortcuts for increasing/decreasing font size (e.g., Ctrl + Up/Down arrows).
- Accessibility Considerations: Ensure font size controls are screen reader-friendly and easy to navigate with keyboard.
- If multiple text elements with different font sizes are selected, font size adjustments should apply uniformly to all selected text, or the user should be prompted to choose how to handle the mismatch.
