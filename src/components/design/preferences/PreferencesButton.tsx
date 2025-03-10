
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { PreferencesDialog } from "./PreferencesDialog";
import { TemplatePreferences } from "@/lib/types/preferences";

const defaultPreferences: TemplatePreferences = {
  typography: {
    fontUnit: 'px',
  },
};

export const PreferencesButton = () => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<TemplatePreferences>(defaultPreferences);

  const handlePreferencesChange = (newPreferences: TemplatePreferences) => {
    setPreferences(newPreferences);
    // TODO: Save preferences to template
    console.log('New preferences:', newPreferences);
  };

  return (
    <>
      <Button
        variant="outline"
        size="xxs"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-4 w-4" />
        <span>Preferences</span>
      </Button>

      <PreferencesDialog
        open={open}
        onOpenChange={setOpen}
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
      />
    </>
  );
};
