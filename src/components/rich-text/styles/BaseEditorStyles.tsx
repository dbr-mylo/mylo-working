
import React from 'react';

/**
 * BaseEditorStyles Component
 * 
 * Provides foundational styling for the editor that all other styles build upon.
 * These styles handle the core editor appearance, behavior, and interactions.
 */
export const BaseEditorStyles = () => {
  return (
    <style>{`
      /* Base Editor Styles */
      .ProseMirror {
        position: relative;
        outline: none;
        word-wrap: break-word;
        white-space: pre-wrap;
        white-space: break-spaces;
        -webkit-font-variant-ligatures: none;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0;
        /* Critical - establish base font-size */
        font-size: initial !important;
        font-family: Inter, sans-serif !important;
        box-sizing: border-box;
        padding-top: 0.25rem;
      }
      
      /* Placeholder */
      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #adb5bd;
        pointer-events: none;
        height: 0;
      }
      
      /* Force refresh for elements when cache is cleared */
      .ProseMirror.refresh-fonts [style*="font-size"],
      .ProseMirror.refresh-fonts .custom-font-size {
        opacity: 0.999; /* Trigger a repaint without visual change */
      }
      
      /* Critical z-index overrides */
      [data-radix-popper-content-wrapper] {
        z-index: 9999 !important;
      }
      
      /* Ensure dropdown backgrounds are solid */
      [data-radix-popper-content-wrapper] > div {
        background-color: white !important;
      }
      
      /* Ensure editor styling doesn't leak into preview */
      .template-styled {
        /* Reset all font styles to enable template control */
        font-family: inherit;
        color: inherit;
      }
      
      /* Provide clear separation between editor and preview styling */
      .ProseMirror:not(.template-styled) {
        /* Editor-specific styles won't affect template view */
      }
    `}</style>
  );
};
