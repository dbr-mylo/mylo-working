
import React from 'react';

/**
 * TemplateStyleOverrides Component
 * 
 * Generates CSS rules to enforce template typography settings in the design preview
 * while allowing editors to freely format text in the editor view.
 */
export const TemplateStyleOverrides = () => {
  return (
    <style>{`
      /* Template Preview Style Enforcement */
      
      /* Force template typography settings with high specificity */
      .template-styled [style*="font-family"],
      .template-styled span[style*="font-family"],
      .template-styled p[style*="font-family"],
      .template-styled h1[style*="font-family"],
      .template-styled h2[style*="font-family"],
      .template-styled h3[style*="font-family"],
      .template-styled h4[style*="font-family"],
      .template-styled h5[style*="font-family"],
      .template-styled h6[style*="font-family"] {
        font-family: inherit !important;
      }
      
      /* Force template color settings */
      .template-styled [style*="color"],
      .template-styled span[style*="color"],
      .template-styled p[style*="color"],
      .template-styled h1[style*="color"],
      .template-styled h2[style*="color"],
      .template-styled h3[style*="color"],
      .template-styled h4[style*="color"],
      .template-styled h5[style*="color"],
      .template-styled h6[style*="color"] {
        color: inherit !important;
      }
      
      /* Force template text alignment */
      .template-styled [style*="text-align"],
      .template-styled p[style*="text-align"],
      .template-styled h1[style*="text-align"],
      .template-styled h2[style*="text-align"],
      .template-styled h3[style*="text-align"],
      .template-styled h4[style*="text-align"],
      .template-styled h5[style*="text-align"],
      .template-styled h6[style*="text-align"] {
        text-align: inherit !important;
      }
      
      /* Apply template typography with inheritance */
      .template-styled * {
        font-family: inherit;
        color: inherit;
      }
      
      /* Preserve document structure while applying template styles */
      .template-styled p,
      .template-styled h1,
      .template-styled h2,
      .template-styled h3,
      .template-styled h4,
      .template-styled h5,
      .template-styled h6,
      .template-styled ul,
      .template-styled ol,
      .template-styled blockquote {
        margin-top: 0;
        margin-bottom: 0.5em;
      }
    `}</style>
  );
};
