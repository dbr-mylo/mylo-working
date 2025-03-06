
import { Layers, Type, Image, Layout } from "lucide-react";

export const DesignerSidebar = () => {
  return (
    <div className="w-64 bg-editor-sidebar border-l border-editor-border p-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-editor-heading mb-3">Design Tools</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Type className="h-5 w-5 text-editor-text" />
            <span className="text-sm text-editor-text">Typography</span>
          </div>
          
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer opacity-50">
            <Layout className="h-5 w-5 text-editor-text" />
            <span className="text-sm text-editor-text">Layout</span>
          </div>
          
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer opacity-50">
            <Image className="h-5 w-5 text-editor-text" />
            <span className="text-sm text-editor-text">Images</span>
          </div>
          
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer opacity-50">
            <Layers className="h-5 w-5 text-editor-text" />
            <span className="text-sm text-editor-text">Layers</span>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-editor-border">
        <p className="text-xs text-editor-text opacity-70">
          More tools coming soon
        </p>
      </div>
    </div>
  );
};
