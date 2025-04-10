
import React, { useState, useEffect } from "react";
import { DocumentTabs } from "@/components/dashboard/documents/DocumentTabs";
import { ProjectSidebar } from "@/components/dashboard/projects/ProjectSidebar";
import { useProjects } from "@/contexts/ProjectsContext";
import { useDocumentsData } from "@/hooks/dashboard/useDocumentsData";
import { useFilteredDocuments } from "@/hooks/dashboard/useFilteredDocuments";

interface DashboardDocumentsProps {
  searchQuery?: string;
}

export const DashboardDocuments: React.FC<DashboardDocumentsProps> = ({ searchQuery = "" }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    projects,
    selectedProject,
    isLoading: projectsLoading,
    selectProject,
    createProject,
    createFolder,
  } = useProjects();
  
  const {
    documents,
    isLoading: documentsLoading,
    handleDeleteDocument,
    handleSelectDocument,
    handleAddDocument,
  } = useDocumentsData(selectedProject?.id || null, searchQuery);
  
  const { filteredDocuments } = useFilteredDocuments(documents, searchQuery, activeTab);
  const isSearching = searchQuery.trim().length > 0;
  
  // Update active tab when search query changes
  useEffect(() => {
    if (isSearching && activeTab !== 'all') {
      setActiveTab('all');
    }
  }, [searchQuery, isSearching]);

  const handleCreateProject = async (name: string, description?: string) => {
    const newProject = await createProject(name, description);
    selectProject(newProject.id);
    setActiveTab('all');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Projects sidebar */}
      <div className="md:col-span-1">
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={selectProject}
          onCreateProject={handleCreateProject}
          onCreateFolder={createFolder}
          projectsLoading={projectsLoading}
        />
      </div>
      
      {/* Main content */}
      <div className="md:col-span-3">
        <DocumentTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documents={documents}
          filteredDocuments={filteredDocuments}
          documentsLoading={documentsLoading}
          searchQuery={searchQuery}
          handleAddDocument={handleAddDocument}
          handleDeleteDocument={handleDeleteDocument}
          handleSelectDocument={handleSelectDocument}
          selectedProjectId={selectedProject?.id || null}
        />
      </div>
    </div>
  );
};
