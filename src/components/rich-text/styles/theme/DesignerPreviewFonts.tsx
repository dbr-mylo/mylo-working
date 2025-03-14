
import React from 'react';

/**
 * DesignerPreviewFonts Component
 * 
 * Applies testing fonts to the designer preview panel to demonstrate
 * how font inheritance works with the template styling system.
 */
export const DesignerPreviewFonts = () => {
  return (
    <style>{`
      /* Designer Preview Test Fonts */
      
      /* Add Playfair Display as our test font for designer preview */
      .template-styled {
        font-family: 'Playfair Display', serif !important;
        color: #333 !important;
      }
      
      /* Apply different styling to headings to test inheritance */
      .template-styled h1 {
        font-family: 'Playfair Display', serif !important;
        font-weight: 700 !important;
        color: #1a365d !important;
        font-size: 2.25rem !important;
      }
      
      .template-styled h2 {
        font-family: 'Playfair Display', serif !important;
        font-weight: 700 !important;
        color: #2a4365 !important;
        font-size: 1.875rem !important;
      }
      
      .template-styled h3 {
        font-family: 'Playfair Display', serif !important;
        font-weight: 600 !important;
        color: #2c5282 !important;
        font-size: 1.5rem !important;
      }
      
      /* Paragraphs get the base font */
      .template-styled p {
        font-family: 'Playfair Display', serif !important;
        font-weight: 400 !important;
        color: #333 !important;
        font-size: 1.125rem !important;
        line-height: 1.6 !important;
      }
    `}</style>
  );
};
