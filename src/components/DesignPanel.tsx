
import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";

export const DesignPanel = ({ content, isEditable }: DesignPanelProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 1280;
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && <h2 className="text-sm font-medium text-editor-text mb-4">Design Panel</h2>}
        <div className="bg-editor-panel p-4 rounded-md">
          <div className="prose prose-sm max-w-none">
            <div 
              className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]"
            >
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
