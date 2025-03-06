
import React from 'react';

export const EditorStyles: React.FC = () => {
  return (
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Poppins:wght@400;700&family=Merriweather:wght@400;700&family=Source+Sans+Pro:wght@400;700&display=swap');
        
        .ProseMirror {
          outline: none;
          overflow-y: auto;
          background-color: white;
          min-height: 11in;
          width: 100%;
          box-sizing: border-box;
          border-radius: 4px;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p {
          margin-top: 0;
          margin-bottom: 4px;
          line-height: 1.2;
        }
        .ProseMirror ul, .ProseMirror ol {
          margin-top: 0;
          margin-bottom: 0;
          padding-left: 20px;
        }
        .ProseMirror li {
          margin-bottom: 4px;
          line-height: 1.2;
        }
        .ProseMirror li p {
          margin: 0;
        }
        .ProseMirror ul ul, .ProseMirror ol ol, .ProseMirror ul ol, .ProseMirror ol ul {
          margin-top: 4px;
        }
        .ProseMirror li > ul, .ProseMirror li > ol {
          padding-left: 24px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}
    </style>
  );
};
