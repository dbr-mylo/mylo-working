
import React from 'react';

interface DocumentStylesProps {
  customStyles: string;
}

export const DocumentStyles = ({ customStyles }: DocumentStylesProps) => {
  return (
    <style>
      {`
        .prose p {
          margin-top: 0;
          margin-bottom: 4px;
          line-height: 1.2;
        }
        .prose ul, .prose ol {
          margin-top: 0;
          margin-bottom: 0;
          padding-left: 20px;
        }
        .prose li {
          margin-bottom: 4px;
          line-height: 1.2;
        }
        .prose li p {
          margin: 0;
        }
        .prose ul ul, .prose ol ol, .prose ul ol, .prose ol ul {
          margin-top: 4px;
        }
        .prose li > ul, .prose li > ol {
          padding-left: 24px;
        }
        .text-element-selected {
          outline: 2px solid #6366f1;
          background-color: rgba(99, 102, 241, 0.1);
        }
        ${customStyles}
      `}
    </style>
  );
};
