
# Text Style System Data Flow

**Last Updated:** 2023-11-15

## Overview

This document outlines the data flow within the Text Style System, highlighting how style data moves through different components, from creation to application in documents.

## Data Flow Diagram

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────┐
│                 │         │                  │         │                │
│  Style Creation ├────────►│  Style Storage   ├────────►│ Style Retrieval│
│                 │         │                  │         │                │
└────────┬────────┘         └──────────────────┘         └────────┬───────┘
         │                                                        │
         │                                                        │
         │                                                        ▼
         │                                               ┌────────────────┐
         │                                               │                │
         └───────────────────────────────────────────────┤ Style Application
                                                         │                │
                                                         └────────┬───────┘
                                                                  │
                                                                  │
                                                                  ▼
                                                         ┌────────────────┐
                                                         │                │
                                                         │   CSS Output   │
                                                         │                │
                                                         └────────────────┘
```

## 1. Style Creation

### Components Involved
- `StyleForm`
- `StyleFormMetadata`
- `StyleFormControls`
- `StyleInheritance`

### Data Flow
1. User inputs style properties in the `StyleForm` component
2. Style metadata (name, selector) is captured by `StyleFormMetadata`
3. Typography properties are captured by `StyleFormControls`
4. Inheritance relationships are established by `StyleInheritance`
5. The complete style object is prepared for saving:
   ```typescript
   const newStyle = {
     id: generateId(),
     name: styleName,
     fontFamily: "Inter",
     fontSize: "16px",
     fontWeight: "400",
     color: "#000000",
     lineHeight: "1.5",
     letterSpacing: "0",
     selector: "p",
     parentId: inheritedStyleId,  // If inheriting from another style
     description: styleDescription
   };
   ```

## 2. Style Storage

### Components Involved
- `styleOperations` module
- `textStyleStore`
- `storage` module

### Data Flow
1. The `saveTextStyle` function in `styleOperations` receives the style object
2. The style is validated for required fields
3. If the style has an ID, it's updated; otherwise, a new ID is generated
4. The style is saved to storage:
   ```typescript
   // For local storage
   saveLocalTextStyle(style);
   
   // For remote storage (if available)
   saveRemoteTextStyle(style);
   ```
5. The style cache is updated to reflect the changes

## 3. Style Retrieval

### Components Involved
- `useTextStyles` hook
- `textStyleStore`
- `styleOperations`

### Data Flow
1. Components request styles using the `useTextStyles` hook
2. The hook retrieves styles from the store:
   ```typescript
   const { styles, isLoading } = useTextStyles();
   ```
3. If inheritance is involved, `getStyleWithInheritance` resolves the complete style:
   ```typescript
   const resolvedStyle = getStyleWithInheritance(styleId);
   ```
4. For displaying inheritance relationships, `getInheritanceChain` builds the chain:
   ```typescript
   const inheritanceChain = getInheritanceChain(styleId);
   ```

## 4. Style Application

### Components Involved
- `StyleApplicator`
- `StyleSelector`
- `useStyleApplication` hook

### Data Flow
1. User selects a style through the `StyleSelector` component
2. The `useStyleApplication` hook handles the application logic
3. The `applyStyle` function applies the style to the selected text:
   ```typescript
   const applyStyle = (styleId: string) => {
     // Get the style with all inherited properties
     const style = getStyleWithInheritance(styleId);
     
     // Apply the style to the selected text
     editor.chain().focus()
       .setFontFamily(style.fontFamily)
       .setFontSize(style.fontSize)
       .setColor(style.color)
       // Additional properties...
       .run();
   };
   ```

## 5. CSS Output

### Components Involved
- `cssGenerator` module
- `DocumentPreview` component
- `TemplateStyles` component

### Data Flow
1. The `generateCSSFromTextStyles` function converts style objects to CSS:
   ```typescript
   const css = generateCSSFromTextStyles(styles);
   ```
2. The generated CSS is applied to the document:
   ```tsx
   // In DocumentPreview
   <div className="document-content">
     <style dangerouslySetInnerHTML={{ __html: customStyles }} />
     <div dangerouslySetInnerHTML={{ __html: content }} />
   </div>
   ```

## Event-Based Data Flow

In addition to the linear flow, the system uses events for real-time updates:

1. When a style is updated:
   - The `styleOperations` module emits a style change event
   - Components listening for style changes update their state
   - The CSS generator regenerates the CSS

2. When an element is selected:
   - The `useStyleDetection` hook identifies applied styles
   - The UI updates to show the currently applied style

## Role-Based Data Access

The data flow adapts based on the user's role:

### Designer Role
- Full access to create, edit, and delete styles
- Access to inheritance management
- Access to style application

### Editor Role
- Read-only access to styles
- Access to style application
- No access to style creation or editing

## Best Practices

1. **Cache strategically** - Cache style data to minimize storage operations
2. **Validate early** - Validate style data before storage to ensure integrity
3. **Handle inheritance carefully** - Resolve inheritance chains efficiently
4. **Update UI reactively** - Ensure UI components update when styles change
5. **Isolate storage logic** - Keep storage implementation details in dedicated modules

