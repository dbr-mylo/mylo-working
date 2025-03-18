
# Hook Name

**Last Updated:** YYYY-MM-DD

## Purpose

Briefly describe what this hook does and why it exists.

## Usage

```tsx
import { useHookName } from '@/hooks/path/to/useHookName';

function MyComponent() {
  const { value1, value2, handleAction } = useHookName(initialValue);
  
  // Use the hook's return values
  return (
    <div onClick={handleAction}>
      {value1}: {value2}
    </div>
  );
}
```

## Parameters

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| param1 | string | - | Yes | Description of param1 |
| param2 | number | 0 | No | Description of param2 |
| options | Object | {} | No | Configuration options |

## Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| value1 | string | Description of value1 |
| value2 | number | Description of value2 |
| handleAction | () => void | Function to handle an action |

## Behavior

Describe how the hook behaves, including:
- Initialization
- State management
- Side effects
- Cleanup

## Dependencies

List important dependencies:

- Other hooks this hook uses
- Services this hook depends on
- Context providers this hook needs

## Examples

### Basic Example

```tsx
const { value, setValue } = useHookName('initial');
```

### With Options Example

```tsx
const { value, setValue, reset } = useHookName('initial', {
  validate: true,
  transform: (v) => v.toUpperCase()
});
```

## Implementation Details

Any important implementation details that would help other developers understand or modify this hook.

## Testing

How to test this hook, including:
- Key test cases
- Mocking dependencies
- Test utilities
