
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { FileText } from "lucide-react";
import { DocumentCard } from "./DocumentCard";

interface WriterContentTabsProps {
  filteredDocuments: any[];
  mockAssignedDocuments: any[];
  mockRecentTemplates: any[];
  searchQuery: string;
}

/**
 * Content tabs component for the writer dashboard
 * Extracted from WriterDashboard.tsx to reduce file size
 */
export const WriterContentTabs: React.FC<WriterContentTabsProps> = ({
  filteredDocuments,
  mockAssignedDocuments,
  mockRecentTemplates,
  searchQuery
}) => {
  const { navigateTo } = useNavigationHandlers();
  
  return (
    <Tabs defaultValue="recent">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo("/documents")}
        >
          View All Documents
        </Button>
      </div>
      
      <TabsContent value="recent" className="space-y-6">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? `No results matching "${searchQuery}"` : "You don't have any recent documents"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                document={{
                  id: doc.id,
                  title: doc.title,
                  updated_at: doc.updatedAt,
                  content: "", // Adding required property for Document type
                  status: doc.status,
                  meta: { // Use meta for additional properties
                    tags: [doc.category],
                    category: doc.category,
                  }
                }}
                onClick={() => navigateTo(`/editor/${doc.id}`)}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="assigned">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAssignedDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={{
                id: doc.id,
                title: doc.title,
                updated_at: doc.updatedAt,
                content: "",
                status: doc.status,
                meta: {
                  tags: [doc.category],
                  category: doc.category,
                }
              }}
              onClick={() => navigateTo(`/editor/${doc.id}`)}
              viewMode="grid"
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="templates">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRecentTemplates.map(template => (
            <DocumentCard
              key={template.id}
              document={{
                id: template.id,
                title: template.title,
                updated_at: template.updatedAt,
                content: "",
                status: template.status,
                meta: {
                  tags: [template.category],
                  category: template.category,
                }
              }}
              isTemplate={true}
              onClick={() => navigateTo(`/templates/${template.id}`)}
              viewMode="grid"
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default WriterContentTabs;
