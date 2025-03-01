
import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState } from "react";
import { FontPicker } from "./FontPicker";

export const DesignPanel = ({ content, isEditable }: DesignPanelProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  const [designFont, setDesignFont] = useState('Inter');
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && <h2 className="text-sm font-medium text-editor-text mb-4">Design Panel</h2>}
        <div className="bg-editor-panel p-4 rounded-md">
          <div className="flex items-center gap-2 mb-4 border-b border-editor-border pb-2">
            <FontPicker value={designFont} onChange={setDesignFont} />
          </div>
          <div className="prose prose-sm max-w-none">
            <div 
              className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]"
              style={{ fontFamily: designFont }}
            >
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Poppins:wght@400;700&family=Merriweather:wght@400;700&family=Source+Sans+Pro:wght@400;700&display=swap');
                  
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
                `}
              </style>
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-editor-text opacity-50">
                  Content from the editor will appear here with brand styling
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
