import { useState, useRef, useEffect } from "react";
import { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, Upload, FileText, FilePlus2, 
  Files, History, Settings, AlertTriangle 
} from "lucide-react";
import { 
  exportToMyloFile, 
  exportToPDF, 
  importMyloFile, 
  batchExportToMylo,
  ProgressCallback
} from "@/utils/fileExportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { handleError } from "@/utils/errorHandling";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FileMenuProps {
  currentDocument: Document | null;
  documentType: string;
  currentRole: string;
  onImport: (doc: Document) => void;
  content: string;
  documentHistory?: Document[];
}

export const FileMenu = ({
  currentDocument,
  documentType,
  currentRole,
  onImport,
  content,
  documentHistory = []
}: FileMenuProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportQuality, setExportQuality] = useState(2);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [operation, setOperation] = useState<'export' | 'import' | 'pdf' | 'batch'>('export');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!showProgressDialog) {
      setExportProgress(0);
    }
  }, [showProgressDialog]);
  
  const documentObj: Document = currentDocument || {
    id: crypto.randomUUID(),
    title: `Untitled ${documentType}`,
    content: content,
    updated_at: new Date().toISOString()
  };
  
  const handleProgressCallback: ProgressCallback = (progress) => {
    setExportProgress(progress);
  };
  
  const handleExportToMylo = async () => {
    try {
      setOperation('export');
      setIsExporting(true);
      setShowProgressDialog(true);
      
      const success = await exportToMyloFile(
        documentObj, 
        documentType, 
        { progressCallback: handleProgressCallback }
      );
      
      if (!success) {
        throw new Error(`Failed to export ${documentType}`);
      }
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleExportToMylo",
        `Failed to export ${documentType}. Please try again.`
      );
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setShowProgressDialog(false);
      }, 500);
    }
  };
  
  const handleExportToPDF = async () => {
    try {
      setOperation('pdf');
      setIsExporting(true);
      setShowProgressDialog(true);
      
      const contentElement = document.querySelector(".ProseMirror") as HTMLElement;
      const success = await exportToPDF(
        contentElement, 
        documentObj, 
        documentType, 
        { 
          quality: exportQuality,
          progressCallback: handleProgressCallback
        }
      );
      
      if (!success) {
        throw new Error(`Failed to export ${documentType} as PDF`);
      }
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleExportToPDF",
        `Failed to export ${documentType} as PDF. Please try again.`
      );
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setShowProgressDialog(false);
        setShowExportOptions(false);
      }, 500);
    }
  };
  
  const handleBatchExport = async () => {
    if (!selectedDocuments.length) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to export.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setOperation('batch');
      setIsExporting(true);
      setShowProgressDialog(true);
      
      const { success, failed } = await batchExportToMylo(
        selectedDocuments, 
        documentType
      );
      
      toast({
        title: "Batch export completed",
        description: `Successfully exported ${success} documents. ${failed > 0 ? `Failed to export ${failed} documents.` : ''}`,
        variant: failed > 0 ? "destructive" : "default",
      });
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleBatchExport",
        "Failed to complete batch export. Please try again."
      );
    } finally {
      setIsExporting(false);
      setShowProgressDialog(false);
      setSelectedDocuments([]);
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleMultipleImportClick = () => {
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.click();
    }
  };
  
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setOperation('import');
      setIsExporting(true);
      setShowProgressDialog(true);
      
      const file = files[0];
      
      if (!file.name.endsWith('.mylo')) {
        toast({
          title: "Invalid file format",
          description: "Please select a .mylo file.",
          variant: "destructive",
        });
        return;
      }
      
      const importedDoc = await importMyloFile(
        file, 
        currentRole, 
        { progressCallback: handleProgressCallback }
      );
      
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
      setTimeout(() => {
        setIsExporting(false);
        setShowProgressDialog(false);
      }, 500);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleMultipleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setOperation('import');
      setIsExporting(true);
      setShowProgressDialog(true);
      
      let successCount = 0;
      let failCount = 0;
      const importedDocs: Document[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const fileProgress = (i / files.length) * 100;
        handleProgressCallback(fileProgress);
        
        try {
          if (!file.name.endsWith('.mylo')) {
            failCount++;
            continue;
          }
          
          const importedDoc = await importMyloFile(file, currentRole);
          importedDocs.push(importedDoc);
          successCount++;
        } catch (error) {
          console.error(`Error importing file ${file.name}:`, error);
          failCount++;
        }
      }
      
      if (importedDocs.length > 0) {
        onImport(importedDocs[0]);
      }
      
      toast({
        title: "Batch import completed",
        description: `Successfully imported ${successCount} documents. ${failCount > 0 ? `Failed to import ${failCount} documents.` : ''}`,
        variant: failCount > 0 && successCount === 0 ? "destructive" : "default",
      });
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleMultipleFilesSelected",
        "Failed to process batch import."
      );
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setShowProgressDialog(false);
      }, 500);
      
      if (multipleFileInputRef.current) {
        multipleFileInputRef.current.value = "";
      }
    }
  };
  
  const handleLoadHistoryVersion = (doc: Document) => {
    try {
      onImport(doc);
      
      toast({
        title: "Version loaded",
        description: `Loaded version from ${new Date(doc.updated_at).toLocaleString()}`,
      });
    } catch (error) {
      handleError(
        error,
        "FileMenu.handleLoadHistoryVersion",
        "Failed to load document version."
      );
    }
  };
  
  const getOperationTitle = () => {
    switch (operation) {
      case 'export': return "Exporting Document";
      case 'import': return "Importing Document";
      case 'pdf': return "Generating PDF";
      case 'batch': return "Processing Batch Operation";
      default: return "Processing";
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
          
          <DropdownMenuItem onSelect={handleMultipleImportClick}>
            <Files className="w-4 h-4 mr-2" />
            Import multiple files
            <input
              type="file"
              multiple
              ref={multipleFileInputRef}
              onChange={handleMultipleFilesSelected}
              accept=".mylo"
              className="hidden"
            />
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onSelect={handleExportToMylo} disabled={!content || isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Save as .mylo file
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onSelect={() => setShowExportOptions(true)} 
            disabled={!content || isExporting}
          >
            <FilePlus2 className="w-4 h-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={documentHistory.length === 0}>
              <Files className="w-4 h-4 mr-2" />
              Batch Operations
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={handleBatchExport} disabled={selectedDocuments.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Selected ({selectedDocuments.length})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {documentHistory.map((doc) => (
                <DropdownMenuItem key={doc.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedDocuments.some(d => d.id === doc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocuments([...selectedDocuments, doc]);
                      } else {
                        setSelectedDocuments(selectedDocuments.filter(d => d.id !== doc.id));
                      }
                    }}
                  />
                  <span className="flex-1 truncate">{doc.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={documentHistory.length === 0}>
              <History className="w-4 h-4 mr-2" />
              Version History
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {documentHistory.length === 0 ? (
                <DropdownMenuItem disabled>No history available</DropdownMenuItem>
              ) : (
                documentHistory.map((doc) => (
                  <DropdownMenuItem 
                    key={doc.id}
                    onSelect={() => handleLoadHistoryVersion(doc)}
                  >
                    <span className="truncate mr-2">{doc.title}</span>
                    <span className="text-xs opacity-50">
                      {new Date(doc.updated_at).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings className="w-4 h-4 mr-2" />
              Autosave Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={() => {
                window.localStorage.setItem('mylo-autosave-interval', '1000');
                toast({ title: "Autosave interval set to 1 second" });
              }}>
                1 second
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                window.localStorage.setItem('mylo-autosave-interval', '2000');
                toast({ title: "Autosave interval set to 2 seconds" });
              }}>
                2 seconds (default)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                window.localStorage.setItem('mylo-autosave-interval', '5000');
                toast({ title: "Autosave interval set to 5 seconds" });
              }}>
                5 seconds
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                window.localStorage.setItem('mylo-autosave-interval', '10000');
                toast({ title: "Autosave interval set to 10 seconds" });
              }}>
                10 seconds
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => {
                window.localStorage.setItem('mylo-autosave-enabled', 'false');
                toast({ title: "Autosave disabled" });
              }}>
                Disable Autosave
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                window.localStorage.setItem('mylo-autosave-enabled', 'true');
                toast({ title: "Autosave enabled" });
              }}>
                Enable Autosave
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{getOperationTitle()}</DialogTitle>
            <DialogDescription>
              Please wait while we process your request...
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Progress value={exportProgress} className="h-2" />
            <p className="text-center mt-2 text-sm">{exportProgress}%</p>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>PDF Export Options</DialogTitle>
            <DialogDescription>
              Adjust the quality and settings for your PDF export
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Quality (Higher values may increase file size)</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Low</span>
                  <Slider
                    id="quality"
                    min={1}
                    max={4}
                    step={1}
                    value={[exportQuality]}
                    onValueChange={(values) => setExportQuality(values[0])}
                  />
                  <span className="text-sm">High</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {exportQuality === 1 && "Lower quality, smaller file size (recommended for text documents)"}
                  {exportQuality === 2 && "Standard quality (recommended for most documents)"}
                  {exportQuality === 3 && "High quality (recommended for documents with images)"}
                  {exportQuality === 4 && "Maximum quality (larger file size)"}
                </div>
              </div>
              
              {exportQuality >= 3 && (
                <div className="flex items-center space-x-2 text-amber-500 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  <span>High quality may result in large file sizes and slower export times</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportOptions(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportToPDF} disabled={isExporting}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
