
# Component Name

**Last Updated:** YYYY-MM-DD

## Purpose

Briefly describe what this component does and why it exists.

## Usage

```tsx
import { ComponentName } from '@/components/path/to/ComponentName';

// Basic usage
<ComponentName prop1="value" prop2={value} />

// Advanced usage
<ComponentName
  prop1="value"
  prop2={value}
  onEvent={handleEvent}
>
  {children}
</ComponentName>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| prop1 | string | - | Yes | Description of prop1 |
| prop2 | number | 0 | No | Description of prop2 |
| onEvent | (value: string) => void | - | No | Callback when event occurs |
| children | ReactNode | - | No | Child elements |

## Behavior

Describe how the component behaves, including:
- Initialization
- State changes
- User interactions
- Edge cases

## Dependencies

List important dependencies:

- Other components this component uses
- Hooks or services this component depends on
- Context providers this component needs

## Related Components

List related components that are often used together with this one.

## Examples

### Basic Example

```tsx
<ComponentName prop1="value" />
```

### Advanced Example

```tsx
<ComponentName 
  prop1="value"
  prop2={42}
  onEvent={(value) => console.log(value)}
>
  <ChildComponent />
</ComponentName>
```

## Implementation Details

Any important implementation details that would help other developers understand or modify this component.

## Testing

How to test this component, including:
- Key test cases
- Mocking dependencies
- Test utilities
