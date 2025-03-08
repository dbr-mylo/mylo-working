
import React from 'react';

export const EditorStyles = () => {
  return (
    <>
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
      }
      
      /* Placeholder */
      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #adb5bd;
        pointer-events: none;
        height: 0;
      }
      
      /* Lists */
      .ProseMirror ul {
        list-style-type: disc;
        padding-left: 1.5em;
      }
      
      .ProseMirror ol {
        list-style-type: decimal;
        padding-left: 1.5em;
      }
      
      /* Indentation */
      .ProseMirror *[data-indent="1"] {
        padding-left: 2em;
      }
      
      .ProseMirror *[data-indent="2"] {
        padding-left: 4em;
      }
      
      .ProseMirror *[data-indent="3"] {
        padding-left: 6em;
      }
      
      /* Comprehensive color preservation rules */
      /* Base rule to ensure all elements inherit their parent's color */
      .ProseMirror * {
        color: inherit;
      }
      
      /* Make sure strong elements inherit color by default */
      .ProseMirror strong {
        color: inherit !important;
      }
      
      /* Ensure span elements with color styles pass their color to children */
      .ProseMirror span[style*="color"] * {
        color: inherit !important;
      }
      
      /* Special class for our custom bold extension */
      .ProseMirror .color-preserving-bold {
        font-weight: bold;
        color: inherit !important;
      }
      
      /* Override any browser default for bold elements with color styles */
      .ProseMirror strong[style*="color"],
      .ProseMirror [style*="color"] strong {
        color: inherit !important;
      }
      
      /* Ensure specific formatting combinations preserve color */
      .ProseMirror em[style*="color"],
      .ProseMirror span[style*="color"] em,
      .ProseMirror span[style*="color"] strong,
      .ProseMirror p[style*="color"] strong,
      .ProseMirror p[style*="color"] em {
        color: inherit !important;
      }
      
      /* Highest specificity rule to ensure marks inside colored text */
      .ProseMirror [style*="color"] mark,
      .ProseMirror mark[style*="color"] {
        background-color: transparent;
        color: inherit !important;
      }
      
      /* Force color inheritance for all inline elements, no exceptions */
      .ProseMirror p[style*="color"] *,
      .ProseMirror h1[style*="color"] *,
      .ProseMirror h2[style*="color"] *,
      .ProseMirror h3[style*="color"] *,
      .ProseMirror h4[style*="color"] *,
      .ProseMirror h5[style*="color"] *,
      .ProseMirror h6[style*="color"] *,
      .ProseMirror li[style*="color"] * {
        color: inherit !important;
      }
      `}</style>
    </>
  );
};
