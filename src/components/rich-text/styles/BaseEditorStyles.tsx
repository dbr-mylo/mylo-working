
import React from 'react';

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
    `}</style>
  );
};
