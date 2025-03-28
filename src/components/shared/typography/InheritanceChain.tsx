
import React from "react";
import { TextStyle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Link, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InheritanceChainProps {
  inheritanceChain: TextStyle[];
  error?: string | null;
}

export const InheritanceChain = ({ inheritanceChain, error }: InheritanceChainProps) => {
  if (inheritanceChain.length === 0 && !error) {
    return null;
  }

  return (
    <div className="pt-2">
      <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
        <Link className="h-3 w-3" /> Inheritance Chain:
      </Label>
      
      {error ? (
        <div className="flex items-center gap-2 text-destructive text-xs mt-1">
          <AlertTriangle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1 mt-1">
          {inheritanceChain.map((style, index) => (
            <React.Fragment key={style.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={`
                        text-[10px] px-1.5 py-0 
                        ${index === 0 ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/50'}
                      `}
                    >
                      {style.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs p-2">
                    <p>Style ID: {style.id}</p>
                    {style.parentId && <p>Parent ID: {style.parentId}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {index < inheritanceChain.length - 1 && (
                <span className="text-muted-foreground">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
