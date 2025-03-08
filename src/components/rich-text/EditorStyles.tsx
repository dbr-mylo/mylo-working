
import React from 'react';

export const EditorStyles = () => {
  return (
    <style jsx global>{`
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
      
      /* Special styles for color preservation */
      .ProseMirror .color-preserving-bold {
        font-weight: bold;
      }
      
      /* Ensure that color styles are respected when toggling bold */
      .ProseMirror strong[style*="color"] {
        color: inherit !important;
      }
      
      /* Additional rule to ensure text style marks are properly inherited */
      .ProseMirror mark[data-color] {
        background-color: transparent;
        color: attr(data-color);
      }
    `}</style>
  );
};
