
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StyleDetails } from "../StyleDetails";
import { TextStyle } from "@/lib/types";

interface StyleSelectionCardProps {
  styles: TextStyle[];
  selectedStyleId: string | null;
  setSelectedStyleId: (id: string) => void;
  handleApplyStyle: (id: string) => void;
}

export const StyleSelectionCard = ({
  styles,
  selectedStyleId,
  setSelectedStyleId,
  handleApplyStyle
}: StyleSelectionCardProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-medium mb-4">Available Styles</h2>
      
      {styles.length === 0 ? (
        <p className="text-muted-foreground">No styles yet. Create one!</p>
      ) : (
        <div className="space-y-4">
          <Select 
            value={selectedStyleId || undefined} 
            onValueChange={(value) => setSelectedStyleId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map(style => (
                <SelectItem key={style.id} value={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedStyleId && (
            <div className="space-y-2">
              <Button 
                size="sm" 
                onClick={() => handleApplyStyle(selectedStyleId)}
              >
                View Style Details
              </Button>
              
              <StyleDetails styleId={selectedStyleId} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
