
# Dynamic Route Parameter Testing Suite

This testing suite provides tools to validate and test dynamic route parameters, deep linking, and navigation parameter handling.

## Components

### 1. Parameter Extraction Tester

The Parameter Extraction Tester allows you to test how route parameters are extracted from URLs:

- Enter a route pattern with parameters (e.g., `/user/:id`)
- Enter an actual path (e.g., `/user/123`)
- See extracted parameters in real-time
- Test against expected results

### 2. Navigation Parameter Tester

The Navigation Parameter Tester allows you to:

- Test complex path patterns
- Use the visual Path Segment Builder to create paths
- Validate parameter extraction
- Perform benchmarking tests for performance analysis

### 3. Deep Link Generator

The Deep Link Generator provides:

- Basic parameter support (strings)
- Advanced parameter support (arrays, objects, etc.)
- Interactive builder interface
- Generated link display with copy functionality

### 4. Edge Case Test Suite

The Edge Case Test Suite handles:

- Empty parameters
- Special character handling
- Unicode characters
- Array parameters
- Object parameters
- Performance benchmarking

## Usage Examples

### Basic Parameter Extraction

```typescript
import { extractParameters } from './utils/parameterTestUtils';

// Extract parameters from a route
const params = extractParameters('/user/:id', '/user/123');
// Result: { id: '123' }
```

### Creating Deep Links

```typescript
import { generateDeepLink } from './utils/parameterTestUtils';

// Create a deep link with parameters
const link = generateDeepLink('/user/:id', { id: '123' }, { view: 'profile' });
// Result: '/user/123?view=profile'
```

### Using Complex Parameters

```typescript
import { createComplexDeepLink } from './utils/complexParameterUtils';

// Create a deep link with complex parameters
const link = createComplexDeepLink(
  '/search/:query',
  { query: 'products' },
  { 
    filters: { 
      price: { min: 10, max: 100 },
      inStock: true
    },
    sort: ['price', 'asc']
  }
);
// Result: '/search/products?filters%5Bprice%5D%5Bmin%5D=10&filters%5Bprice%5D%5Bmax%5D=100&filters%5BinStock%5D=true&sort%5B0%5D=price&sort%5B1%5D=asc'
```

### Parsing Links

```typescript
import { parseComplexParameters } from './utils/complexParameterUtils';

// Parse a complex URL
const parsed = parseComplexParameters('/search/products?tags[0]=react&tags[1]=typescript');
// Result: { path: '/search/products', queryParams: { tags: ['react', 'typescript'] } }
```

## Best Practices

1. **Test Edge Cases**: Always test empty parameters, special characters, and nested structures
2. **Validate Results**: Compare expected vs. actual results to ensure accuracy
3. **Check Performance**: Run benchmarks for complex path patterns
4. **Consider URL Encoding**: Remember that parameters in URLs must be properly encoded

## Handling Special Cases

### Array Parameters

Arrays can be passed in two ways:

1. As JSON: `?tags=%5B%22react%22%2C%22typescript%22%5D` (URL-encoded JSON array)
2. As multiple parameters: `?tags[0]=react&tags[1]=typescript`

### Object Parameters

Objects can be passed as:

1. JSON: `?filters=%7B%22price%22%3A100%7D` (URL-encoded JSON object)
2. As nested parameters: `?filters[price]=100&filters[category]=electronics`

### Empty Values

Empty values should be handled gracefully:

```typescript
// Handle potential empty parameters
const safeValue = params.id || 'default';
```

## Performance Considerations

- Parameter extraction and URL parsing are performance-critical operations
- For optimal performance, minimize complex parameter structures in URLs
- Consider caching generated deep links for frequently accessed routes
