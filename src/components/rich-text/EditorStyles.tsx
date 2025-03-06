
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const EditorStyles: React.FC = () => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  return (
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Poppins:wght@400;700&family=Merriweather:wght@400;700&family=Source+Sans+Pro:wght@400;700&display=swap');
        
        .ProseMirror {
          min-height: 11in;
          width: 8.5in;
          padding: ${isDesigner ? '0' : '1in'};
          margin: ${isDesigner ? '0' : '0 auto'};
          background-color: white;
          ${!isDesigner ? 'box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);' : ''}
          overflow-y: auto;
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
      `}
    </style>
  );
};
