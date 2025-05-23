
import React from 'react';

/**
 * TemplateStyles Component
 * 
 * Provides styles related to document templates and their application within the editor.
 * Controls how templates affect the editor appearance and content styling.
 */
export const TemplateStyles = () => {
  return (
    <style>{`
      /* Template styling for the rich text editor */
      .template-styled {
        /* Base template styling */
      }
      
      /* Preserve editor styling in the editable area */
      .rich-text-editor:not(.template-styled) {
        /* Ensure editor styling isn't affected by template */
      }
      
      /* Ensure consistent rendering between editor and preview */
      .prose.template-styled h1,
      .prose.template-styled h2,
      .prose.template-styled h3,
      .prose.template-styled h4,
      .prose.template-styled h5,
      .prose.template-styled h6,
      .prose.template-styled p,
      .prose.template-styled ul,
      .prose.template-styled ol,
      .prose.template-styled blockquote {
        /* Base styles for consistent rendering */
        margin-top: 0;
        margin-bottom: 0.5em;
      }
    `}</style>
  );
};
