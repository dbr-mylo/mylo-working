
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const HelpSupportPage = () => {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      
      <div className="flex-1 p-8 bg-background overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Help & Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Browse our comprehensive guides</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Documentation
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get help from our team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
              <CardDescription>Join our community forum</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Visit Forum
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create a new document?</AccordionTrigger>
              <AccordionContent>
                To create a new document, navigate to the Documents page and click the "New Document" button. 
                Select a template if desired, then begin editing your document.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I share documents with others?</AccordionTrigger>
              <AccordionContent>
                Open the document you want to share, click the "Share" button in the top right corner, 
                and enter the email addresses of the people you want to share with. You can set 
                permissions to control whether they can view or edit the document.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use custom templates?</AccordionTrigger>
              <AccordionContent>
                Yes, you can create and use custom templates. Navigate to the Templates section, 
                click "Create Template", and design your template. Once saved, it will be available 
                when creating new documents.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I recover a deleted document?</AccordionTrigger>
              <AccordionContent>
                Deleted documents are moved to the Trash folder for 30 days before being permanently deleted. 
                To recover a document, go to the Trash folder, select the document, and click "Restore".
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>What file formats can I import and export?</AccordionTrigger>
              <AccordionContent>
                You can import documents in DOCX, PDF, and HTML formats. For exporting, you can choose 
                between PDF, DOCX, HTML, and plain text formats depending on your needs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
