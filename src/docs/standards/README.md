
# Documentation Standards

**Last Updated:** 2023-11-15

This section contains the comprehensive documentation standards for the project. These standards ensure consistency, clarity, and completeness across all project documentation.

## Documentation Types

Different types of documentation have specific standards:

- [General Documentation Standards](../DOCUMENTATION_STANDARDS.md) - Core standards for all documentation
- [API Documentation](./API_DOCUMENTATION_STANDARDS.md) - Standards for documenting APIs
- [UI Component Documentation](./UI_COMPONENT_STANDARDS.md) - Standards for documenting UI components
- [State Management Documentation](./STATE_MANAGEMENT_STANDARDS.md) - Standards for documenting state
- [Hook Documentation](./HOOK_DOCUMENTATION_STANDARDS.md) - Standards for documenting custom hooks

## Documentation Creation Process

1. **Identify Documentation Need** - Determine what needs to be documented
2. **Select Template** - Choose the appropriate template from `src/docs/templates`
3. **Write Documentation** - Fill in the template with relevant information
4. **Review** - Have documentation reviewed for accuracy and completeness
5. **Publish** - Add the documentation to the appropriate location in `src/docs`
6. **Maintain** - Update documentation as code changes

## Documentation Templates

Use the appropriate template for each type of documentation:

- [`COMPONENT_TEMPLATE.md`](../templates/COMPONENT_TEMPLATE.md) - For UI components
- [`HOOK_TEMPLATE.md`](../templates/HOOK_TEMPLATE.md) - For custom hooks
- Additional templates can be found in the `src/docs/templates` directory

## Documentation Location Guidelines

- Component documentation should be stored in `src/docs/components/<category>`
- Architecture documentation should be stored in `src/docs/architecture`
- Feature documentation should be stored in `src/docs/features`
- Development guidelines should be stored in `src/docs/development`

## Documentation Review Checklist

Before finalizing documentation, ensure:

- [ ] Documentation follows the appropriate standard
- [ ] All required sections are completed
- [ ] Code examples are accurate and functional
- [ ] Types and interfaces are fully documented
- [ ] Links to related documentation work
- [ ] The documentation is understandable to new developers
- [ ] The last updated date is current
