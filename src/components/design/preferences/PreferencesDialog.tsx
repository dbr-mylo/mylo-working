
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplatePreferences } from "@/lib/types/preferences";

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
  const handleFontUnitChange = (value: 'px' | 'pt') => {
    onPreferencesChange({
      ...preferences,
      typography: {
        ...preferences.typography,
        fontUnit: value,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Template Preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="font-unit" className="text-right">
              Font Unit
            </Label>
            <Select
              value={preferences.typography.fontUnit}
              onValueChange={handleFontUnitChange}
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
      </DialogContent>
    </Dialog>
  );
};
