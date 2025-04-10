
import { Document } from "@/lib/types";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";
import { withRetry } from "@/utils/error/withRetry";

// Constants for file operations
export const FILE_SIZE_LIMITS = {
  MYLO_MAX_SIZE_MB: 10, // Maximum size for .mylo files in MB
  PDF_MAX_SIZE_MB: 50,  // Maximum size for PDF exports in MB
  MAX_DIMENSION_PIXELS: 5000 // Maximum width/height for PDF export
};

export const FILE_VERSION = "1.1"; // Increased version to support new features

/**
 * File format for Mylo documents
 * Version 1.1 structure with extended metadata
 */
interface MyloFileFormat {
  version: string;
  type: "document" | "template";
  content: string;
  title: string;
  created: string;
  updated: string;
  meta: Record<string, any>;
  // New fields in version 1.1
  exportedBy?: string; // User who exported the file
  applicationVersion?: string; // Version of the application
  checksum?: string; // For file integrity verification
}

/**
 * Progress callback for file operations
 */
export interface ProgressCallback {
  (progress: number): void;
}

/**
 * Export options for customizing the export process
 */
export interface ExportOptions {
  includeMetadata?: boolean;
  progressCallback?: ProgressCallback;
  quality?: number; // For PDF exports (0.1 to 1.0)
}

/**
 * Calculate file size in MB from a string or Blob
 */
const calculateFileSizeInMB = (content: string | Blob): number => {
  if (typeof content === 'string') {
    // Each character in JavaScript is 2 bytes in UTF-16
    return (content.length * 2) / (1024 * 1024);
  } else {
    return content.size / (1024 * 1024);
  }
};

/**
 * Generate a simple checksum for file integrity verification
 */
const generateChecksum = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

/**
 * Exports the document to a .mylo file with progress reporting
 */
export const exportToMyloFile = async (
  document: Document, 
  documentType: string = "document",
  options: ExportOptions = {}
): Promise<boolean> => {
  try {
    const { includeMetadata = true, progressCallback } = options;
    
    // Report initial progress
    if (progressCallback) progressCallback(0);
    
    // Create the file content
    const fileContent: MyloFileFormat = {
      version: FILE_VERSION,
      type: documentType as "document" | "template",
      content: document.content,
      title: document.title,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      meta: document.meta || {},
    };
    
    // Add optional metadata if requested
    if (includeMetadata) {
      fileContent.applicationVersion = "1.0.0"; // Replace with actual app version
      fileContent.checksum = generateChecksum(document.content);
    }
    
    // Report progress after metadata preparation
    if (progressCallback) progressCallback(25);
    
    // Convert to JSON string
    const jsonString = JSON.stringify(fileContent, null, 2);
    
    // Check file size
    const fileSizeMB = calculateFileSizeInMB(jsonString);
    if (fileSizeMB > FILE_SIZE_LIMITS.MYLO_MAX_SIZE_MB) {
      throw new Error(`File size (${fileSizeMB.toFixed(1)}MB) exceeds the maximum allowed size of ${FILE_SIZE_LIMITS.MYLO_MAX_SIZE_MB}MB`);
    }
    
    // Report progress after size check
    if (progressCallback) progressCallback(50);
    
    // Create a blob
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Report progress after blob creation
    if (progressCallback) progressCallback(75);
    
    // Use FileSaver to save the file
    saveAs(blob, `${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mylo`);
    
    // Report completion
    if (progressCallback) progressCallback(100);
    
    toast({
      title: `${documentType === "template" ? "Template" : "Document"} exported`,
      description: `"${document.title}" has been exported as a .mylo file.`,
    });
    
    return true;
  } catch (error) {
    console.error("Error exporting to .mylo file:", error);
    toast({
      title: "Export failed",
      description: error instanceof Error ? error.message : "There was an error exporting your file.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Exports the document to a PDF file with quality options and progress reporting
 */
export const exportToPDF = withRetry(async (
  contentElement: HTMLElement | null, 
  document: Document,
  documentType: string = "document",
  options: ExportOptions = {}
): Promise<boolean> => {
  if (!contentElement) {
    toast({
      title: "Export failed",
      description: "Could not find the document content.",
      variant: "destructive",
    });
    return false;
  }
  
  try {
    const { quality = 2, progressCallback } = options;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your PDF...",
    });
    
    // Report initial progress
    if (progressCallback) progressCallback(0);
    
    // Get the dimensions of the document element
    const { width, height } = contentElement.getBoundingClientRect();
    
    // Check if dimensions are too large
    if (width > FILE_SIZE_LIMITS.MAX_DIMENSION_PIXELS || height > FILE_SIZE_LIMITS.MAX_DIMENSION_PIXELS) {
      throw new Error(`Document dimensions (${width}x${height}) exceed the maximum allowed size`);
    }
    
    // Report progress after dimension check
    if (progressCallback) progressCallback(10);
    
    // Create a canvas of the document
    const canvas = await html2canvas(contentElement, {
      scale: quality, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
    });
    
    // Report progress after canvas creation
    if (progressCallback) progressCallback(50);
    
    // Create PDF with proper dimensions (A4 or custom)
    const pdf = new jsPDF({
      orientation: height > width ? "portrait" : "landscape",
      unit: "px",
      format: [width, height],
    });
    
    // Add the canvas as an image
    const imgData = canvas.toDataURL("image/png");
    
    // Report progress after image data extraction
    if (progressCallback) progressCallback(75);
    
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    
    // Save the PDF
    pdf.save(`${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`);
    
    // Report completion
    if (progressCallback) progressCallback(100);
    
    toast({
      title: `PDF exported`,
      description: `"${document.title}" has been exported as a PDF file.`,
    });
    
    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast({
      title: "PDF export failed",
      description: error instanceof Error ? error.message : "There was an error generating the PDF.",
      variant: "destructive",
    });
    return false;
  }
}, { maxAttempts: 2, delayMs: 1000 });

/**
 * Validates file format and compatibility
 */
const validateFileFormat = (fileContent: any, currentRole: string): void => {
  // Check for required fields
  if (!fileContent.version || !fileContent.type || !fileContent.content) {
    throw new Error("Invalid file format: missing required fields");
  }
  
  // Check if the file type matches the current role
  if (
    (currentRole === "designer" && fileContent.type !== "template") ||
    (currentRole === "editor" && fileContent.type !== "document") ||
    (currentRole === "writer" && fileContent.type !== "document")
  ) {
    // Designer can open both templates and documents, so we need to remove this condition
    // and only check for editor/writer roles
    if (currentRole !== "designer") {
      throw new Error(`This file is a ${fileContent.type} and cannot be opened in ${currentRole} mode`);
    }
  }
  
  // Check for version compatibility (basic implementation)
  const fileVersion = parseFloat(fileContent.version);
  const currentVersion = parseFloat(FILE_VERSION);
  
  if (fileVersion > currentVersion) {
    throw new Error(`This file was created with a newer version of the application and may not be fully compatible`);
  }
  
  // Validate content size
  const contentSizeMB = calculateFileSizeInMB(fileContent.content);
  if (contentSizeMB > FILE_SIZE_LIMITS.MYLO_MAX_SIZE_MB) {
    throw new Error(`File content size (${contentSizeMB.toFixed(1)}MB) exceeds the maximum allowed size`);
  }
  
  // Check checksum if available
  if (fileContent.checksum && fileContent.checksum !== generateChecksum(fileContent.content)) {
    throw new Error("File integrity check failed. The file may be corrupted.");
  }
};

/**
 * Imports a .mylo file with streaming for large files and progress reporting
 */
export const importMyloFile = (
  file: File,
  currentRole: string,
  options: ExportOptions = {}
): Promise<Document> => {
  return new Promise((resolve, reject) => {
    const { progressCallback } = options;
    const reader = new FileReader();
    
    // Report start
    if (progressCallback) progressCallback(0);
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > FILE_SIZE_LIMITS.MYLO_MAX_SIZE_MB) {
      reject(new Error(`File size (${fileSizeMB.toFixed(1)}MB) exceeds the maximum allowed size of ${FILE_SIZE_LIMITS.MYLO_MAX_SIZE_MB}MB`));
      return;
    }
    
    // Progress report during load
    reader.onprogress = (event) => {
      if (event.lengthComputable && progressCallback) {
        const progress = Math.round((event.loaded / event.total) * 50);
        progressCallback(progress); // First half of progress is loading the file
      }
    };
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }
        
        // Progress update after loading
        if (progressCallback) progressCallback(50);
        
        // Parse the file content
        const fileContent: MyloFileFormat = JSON.parse(event.target.result as string);
        
        // Progress update after parsing
        if (progressCallback) progressCallback(60);
        
        // Validate the file format
        validateFileFormat(fileContent, currentRole);
        
        // Progress update after validation
        if (progressCallback) progressCallback(80);
        
        // Convert to Document format
        const document: Document = {
          id: crypto.randomUUID(),
          title: fileContent.title || "Imported Document",
          content: fileContent.content,
          updated_at: new Date().toISOString(),
          meta: {
            ...fileContent.meta,
            imported: true,
            original_type: fileContent.type,
            import_date: new Date().toISOString(),
            original_version: fileContent.version
          },
        };
        
        // Progress completion
        if (progressCallback) progressCallback(100);
        
        resolve(document);
      } catch (error) {
        console.error("Error importing file:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Batch export multiple documents
 */
export const batchExportToMylo = async (
  documents: Document[], 
  documentType: string = "document",
  options: ExportOptions = {}
): Promise<{ success: number, failed: number }> => {
  let success = 0;
  let failed = 0;
  
  for (const doc of documents) {
    const result = await exportToMyloFile(doc, documentType, options);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }
  
  return { success, failed };
};
