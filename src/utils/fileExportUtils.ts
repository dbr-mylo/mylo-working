
import { Document } from "@/lib/types";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

/**
 * File format for Mylo documents
 * Version 1.0 structure
 */
interface MyloFileFormat {
  version: string;
  type: "document" | "template";
  content: string;
  title: string;
  created: string;
  updated: string;
  meta: Record<string, any>;
}

/**
 * Exports the document to a .mylo file
 */
export const exportToMyloFile = (document: Document, documentType: string = "document"): void => {
  try {
    // Create the file content
    const fileContent: MyloFileFormat = {
      version: "1.0",
      type: documentType as "document" | "template",
      content: document.content,
      title: document.title,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      meta: document.meta || {},
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(fileContent, null, 2);
    
    // Create a blob
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Use FileSaver to save the file
    saveAs(blob, `${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mylo`);
    
    toast({
      title: `${documentType === "template" ? "Template" : "Document"} exported`,
      description: `"${document.title}" has been exported as a .mylo file.`,
    });
  } catch (error) {
    console.error("Error exporting to .mylo file:", error);
    toast({
      title: "Export failed",
      description: "There was an error exporting your file.",
      variant: "destructive",
    });
  }
};

/**
 * Exports the document to a PDF file
 */
export const exportToPDF = async (
  contentElement: HTMLElement | null, 
  document: Document,
  documentType: string = "document"
): Promise<void> => {
  if (!contentElement) {
    toast({
      title: "Export failed",
      description: "Could not find the document content.",
      variant: "destructive",
    });
    return;
  }
  
  try {
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your PDF...",
    });
    
    // Get the dimensions of the document element
    const { width, height } = contentElement.getBoundingClientRect();
    
    // Create a canvas of the document
    const canvas = await html2canvas(contentElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
    });
    
    // Create PDF with proper dimensions (A4 or custom)
    const pdf = new jsPDF({
      orientation: height > width ? "portrait" : "landscape",
      unit: "px",
      format: [width, height],
    });
    
    // Add the canvas as an image
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    
    // Save the PDF
    pdf.save(`${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`);
    
    toast({
      title: `PDF exported`,
      description: `"${document.title}" has been exported as a PDF file.`,
    });
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast({
      title: "PDF export failed",
      description: "There was an error generating the PDF.",
      variant: "destructive",
    });
  }
};

/**
 * Imports a .mylo file
 */
export const importMyloFile = (
  file: File,
  currentRole: string
): Promise<Document> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }
        
        // Parse the file content
        const fileContent: MyloFileFormat = JSON.parse(event.target.result as string);
        
        // Validate the file format
        if (!fileContent.version || !fileContent.type || !fileContent.content) {
          throw new Error("Invalid file format");
        }
        
        // Check if the file type matches the current role
        if (
          (currentRole === "designer" && fileContent.type !== "template") &&
          (currentRole === "editor" && fileContent.type !== "document")
        ) {
          // Designer can open both templates and documents
          // Editor can only open documents
          if (currentRole !== "designer") {
            throw new Error(`This file is a ${fileContent.type} and cannot be opened in ${currentRole} mode`);
          }
        }
        
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
          },
        };
        
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
