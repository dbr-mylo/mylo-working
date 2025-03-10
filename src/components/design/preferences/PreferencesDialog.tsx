
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplatePreferences } from "@/lib/types/preferences";
import { useTextStyleOperations } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: TemplatePreferences;
  onPreferencesChange: (preferences: TemplatePreferences) => void;
}

export const PreferencesDialog = ({
  open,
  onOpenChange,
  preferences,
  onPreferencesChange,
}: PreferencesDialogProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const { convertAllStylesToUnit } = useTextStyleOperations();
  const [localFontUnit, setLocalFontUnit] = useState(preferences?.typography?.fontUnit || 'px');

  // Update local state when preferences change
  useEffect(() => {
    if (preferences?.typography?.fontUnit) {
      setLocalFontUnit(preferences.typography.fontUnit);
      console.log("PreferencesDialog: Updated localFontUnit to", preferences.typography.fontUnit);
    }
  }, [preferences]);

  // Log when the dialog opens
  useEffect(() => {
    if (open) {
      console.log("PreferencesDialog opened with fontUnit:", preferences?.typography?.fontUnit);
    }
  }, [open, preferences]);

  const handleFontUnitChange = async (value: 'px' | 'pt') => {
    // Early return if the value hasn't changed
    if (value === preferences.typography.fontUnit) return;
    
    console.log("Changing font unit from", preferences.typography.fontUnit, "to", value);
    setIsUpdating(true);
    setLocalFontUnit(value); // Update local state immediately for UI feedback
    
    try {
      // Update preferences first
      const updatedPreferences = {
        ...preferences,
        typography: {
          ...preferences.typography,
          fontUnit: value,
        },
      };
      
      onPreferencesChange(updatedPreferences);
      console.log("Updated preferences with new font unit:", value);
      
      // Convert all text styles to the new unit
      await convertAllStylesToUnit(value);
      console.log("Converted all text styles to", value);
      
      toast({
        title: "Font unit updated",
        description: `All text styles have been converted to ${value === 'px' ? 'pixels' : 'points'}.`,
      });
      
      // Force refresh the application by briefly closing and reopening the dialog
      onOpenChange(false);
      setTimeout(() => {
        onOpenChange(true);
      }, 100);
      
      // Force a window reload to ensure all components reflect the new unit
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error updating font unit:", error);
      toast({
        title: "Error updating font unit",
        description: "There was a problem converting text styles.",
        variant: "destructive",
      });
      
      // Revert local state on error
      setLocalFontUnit(preferences.typography.fontUnit);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Template Preferences</DialogTitle>
          <DialogDescription>
            Configure global settings for your template
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="font-unit" className="text-right">
              Font Unit
            </Label>
            <Select
              value={localFontUnit}
              onValueChange={handleFontUnitChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">Pixels (px)</SelectItem>
                <SelectItem value="pt">Points (pt)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-4 text-xs text-muted-foreground">
            Current font unit: {localFontUnit}
          </div>
        </div>
        {isUpdating && (
          <div className="text-xs text-muted-foreground mt-2">
            Converting text styles...
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Note: Changing the font unit will refresh the application to apply changes to all components.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
