
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplatePreferences } from "@/lib/types/preferences";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  const handleFontUnitChange = async (value: 'px' | 'pt') => {
    // Early return if the value hasn't changed
    if (value === preferences.typography.fontUnit) return;
    
    setIsUpdating(true);
    
    try {
      // Update preferences first
      onPreferencesChange({
        ...preferences,
        typography: {
          ...preferences.typography,
          fontUnit: value,
        },
      });
      
      // Convert all text styles to the new unit
      await textStyleStore.convertAllStylesToUnit(value);
      
      toast({
        title: "Font unit updated",
        description: `All text styles have been converted to ${value === 'px' ? 'pixels' : 'points'}.`,
      });
      
      // Instead of reloading, we'll just notify that the changes are applied
      // The useTextStyleCSS hook in use by the app will automatically update
    } catch (error) {
      console.error("Error updating font unit:", error);
      toast({
        title: "Error updating font unit",
        description: "There was a problem converting text styles.",
        variant: "destructive",
      });
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
              value={preferences.typography.fontUnit}
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
        </div>
        {isUpdating && (
          <div className="text-xs text-muted-foreground mt-2">
            Converting text styles...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
