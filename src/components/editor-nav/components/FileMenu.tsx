
import { useState, useRef } from "react";
import { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileText, FilePlus2 } from "lucide-react";
import { exportToMyloFile, exportToPDF, importMyloFile } from "@/utils/fileExportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleError } from "@/utils/errorHandling";

interface FileMenuProps {
  currentDocument: Document | null;
  documentType: string;
  currentRole: string;
  onImport: (doc: Document) => void;
  content: string;
}

export const FileMenu = ({
  currentDocument,
  documentType,
  currentRole,
  onImport,
  content
}: FileMenuProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Create a document object if we don't have one
  const documentObj: Document = currentDocument || {
    id: crypto.randomUUID(),
    title: `Untitled ${documentType}`,
    content: content,
    updated_at: new Date().toISOString()
  };
  
  const handleExportToMylo = () => {
    try {
      setIsExporting(true);
      exportToMyloFile(documentObj, documentType);
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleExportToMylo",
        `Failed to export ${documentType}. Please try again.`
      );
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportToPDF = async () => {
    try {
      setIsExporting(true);
      
      // Find the document content element
      const contentElement = document.querySelector(".ProseMirror") as HTMLElement;
      await exportToPDF(contentElement, documentObj, documentType);
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleExportToPDF",
        `Failed to export ${documentType} as PDF. Please try again.`
      );
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const file = files[0];
      
      // Check if file is a .mylo file
      if (!file.name.endsWith('.mylo')) {
        toast({
          title: "Invalid file format",
          description: "Please select a .mylo file.",
          variant: "destructive",
        });
        return;
      }
      
      // Import the file
      const importedDoc = await importMyloFile(file, currentRole);
      
      // Pass the imported document to the parent component
      onImport(importedDoc);
      
      toast({
        title: `${documentType} imported`,
        description: `"${importedDoc.title}" has been imported successfully.`,
      });
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleFileSelected",
        `Failed to import ${documentType}. Please check the file format.`
      );
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-2 rounded-[7.5px] h-[40px]"
            disabled={isExporting}
          >
            <FileText className="w-4 h-4" />
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {/* Import */}
          <DropdownMenuItem onSelect={handleImportClick}>
            <Upload className="w-4 h-4 mr-2" />
            Import .mylo file
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept=".mylo"
              className="hidden"
            />
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Export options */}
          <DropdownMenuItem onSelect={handleExportToMylo} disabled={!content || isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Save as .mylo file
          </DropdownMenuItem>
          
          <DropdownMenuItem onSelect={handleExportToPDF} disabled={!content || isExporting}>
            <FilePlus2 className="w-4 h-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
