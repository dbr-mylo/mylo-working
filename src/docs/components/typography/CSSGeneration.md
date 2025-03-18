
# CSS Generation System

**Last Updated:** 2023-11-15

## Overview

The CSS Generation System converts text style objects into CSS rules that can be applied to documents. This system ensures that styles defined in the UI are accurately rendered in the document preview and final output.

## Core Components

### cssGenerator Module

The central module responsible for converting text styles to CSS:

```typescript
import { generateCSSFromTextStyles } from '@/stores/textStyles/cssGenerator';

// Generate CSS from an array of text styles
const css = generateCSSFromTextStyles(textStyles);
```

## Style to CSS Mapping

Each text style is mapped to CSS properties according to these rules:

| Style Property | CSS Property | Example |
|----------------|-------------|---------|
| fontFamily | font-family | font-family: Inter; |
| fontSize | font-size | font-size: 16px; |
| fontWeight | font-weight | font-weight: 500; |
| color | color | color: #000000; |
| lineHeight | line-height | line-height: 1.5; |
| letterSpacing | letter-spacing | letter-spacing: 0.5px; |
| textAlign | text-align | text-align: center; |
| textTransform | text-transform | text-transform: uppercase; |
| marginTop | margin-top | margin-top: 1rem; |
| marginBottom | margin-bottom | margin-bottom: 1.5rem; |

## Selector System

Styles are applied to elements using CSS selectors:

1. **Element selectors** - Target HTML elements (`h1`, `p`, etc.)
2. **Class selectors** - Target elements with specific classes (`.caption`, `.highlight`, etc.)
3. **Custom selectors** - Allow for more complex targeting (`.document h1`, `blockquote > p`, etc.)

## Implementation Details

### CSS Generation Process

1. Each style object is processed individually:
   ```typescript
   function generateCSSForStyle(style: TextStyle): string {
     return `
       ${style.selector} {
         font-family: ${style.fontFamily};
         font-size: ${style.fontSize};
         // Additional properties
       }
     `;
   }
   ```

2. Inheritance is resolved before CSS generation:
   ```typescript
   const resolvedStyles = styles.map(style => 
     getStyleWithInheritance(style.id)
   );
   ```

3. Custom properties are included if present:
   ```typescript
   if (style.customProperties) {
     Object.entries(style.customProperties).forEach(([property, value]) => {
       css += `\n  ${property}: ${value};`;
     });
   }
   ```

### CSS Application

The generated CSS is applied to documents through:

1. A `<style>` tag injected into the document head
2. Scoped style elements within the editor preview
3. Exported CSS for use in the final document output

### Optimization

The system includes optimization features:

- Deduplication of identical property values
- Combining selectors with identical declarations
- Minification of the final CSS (in production builds)

## Data Flow

1. When styles are updated in the UI:
   - The style object is saved to the store
   - The CSS generator is called to create updated CSS

2. When a document is loaded:
   - All referenced styles are retrieved
   - CSS is generated from these styles
   - The generated CSS is applied to the document

## Usage Example

```tsx
// In a component that manages styles
const { textStyles } = useTextStyles();

// Generate CSS from the styles
const css = generateCSSFromTextStyles(textStyles);

// Apply the CSS to a document
return (
  <div>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <div className="document-content">{content}</div>
  </div>
);
```

## Best Practices

1. **Use selector specificity wisely** - Understand CSS specificity to avoid unexpected overrides
2. **Test across browsers** - Verify CSS rendering is consistent across different browsers
3. **Monitor CSS size** - Large CSS files can impact performance
4. **Document custom selectors** - Ensure complex selectors are well-documented for maintainability

