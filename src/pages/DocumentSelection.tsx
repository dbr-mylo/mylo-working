
import React from "react";
import { RoleAwareLayout } from "@/components/layout/RoleAwareLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useIsWriter, useIsDesigner, useIsAdmin } from "@/utils/roles";

const DocumentSelection = () => {
  const { role } = useAuth();
  const isWriter = useIsWriter();
  const isDesigner = useIsDesigner();
  const isAdmin = useIsAdmin();
  
  return (
    <RoleAwareLayout role={role}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Document Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Writer Section */}
          {(isWriter || isAdmin) && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Writer Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Access and manage your documents and drafts.
              </p>
              <div className="space-y-2">
                <a 
                  href="/content/write" 
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md"
                >
                  Create New Document
                </a>
                <a 
                  href="/content/documents" 
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md"
                >
                  View All Documents
                </a>
                <a 
                  href="/content/drafts" 
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md"
                >
                  View Drafts
                </a>
              </div>
            </div>
          )}
          
          {/* Designer Section */}
          {(isDesigner || isAdmin) && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Designer Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Manage templates and design settings.
              </p>
              <div className="space-y-2">
                <a 
                  href="/design/templates" 
                  className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md"
                >
                  Manage Templates
                </a>
                <a 
                  href="/design/layout" 
                  className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md"
                >
                  Edit Layouts
                </a>
                <a 
                  href="/design/design-settings" 
                  className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md"
                >
                  Design Settings
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleAwareLayout>
  );
};

export default DocumentSelection;
