
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface GeneratedLinkDisplayProps {
  link: string;
}

export const GeneratedLinkDisplay: React.FC<GeneratedLinkDisplayProps> = ({ link }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied to clipboard',
      description: 'Link copied to clipboard',
    });
  };

  if (!link) return null;

  return (
    <div className="border rounded-md p-4 space-y-2 bg-muted/50">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Generated Link</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4 mr-1" /> Copy
        </Button>
      </div>
      <div className="bg-background p-3 rounded-md break-words">
        <code className="text-sm">{link}</code>
      </div>
    </div>
  );
};
