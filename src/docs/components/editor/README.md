
# Editor Components

This directory contains components specific to the editor role in the application.

## Core Components

- `EditorPanel.tsx` - Main container for editor functionality
- `EditorToolbar.tsx` - Editor-specific toolbar with formatting options
- `EditorView.tsx` - Document view for editors with editing capabilities

## Toolbar Components

- `EditorFormatButtonGroup.tsx` - Text formatting buttons (bold, italic)
- `EditorAlignmentButtonGroup.tsx` - Text alignment buttons
- `EditorListButtonGroup.tsx` - List formatting buttons
- `EditorFontSizeControl.tsx` - Font size control
- `TextControls.tsx` - Combined text formatting controls
- `EditorIndentButtonGroup.tsx` - Indentation controls
- `EditorClearFormattingButton.tsx` - Button to clear formatting

## Integration

These components integrate with the rich text editor and maintain editor-specific styling behaviors and capabilities, with safeguards to prevent editor functionality from affecting design functionality.

## Usage

All editor components should:
1. Check for the editor role before rendering
2. Be used only in editor-specific contexts
3. Handle role-specific styling appropriately
