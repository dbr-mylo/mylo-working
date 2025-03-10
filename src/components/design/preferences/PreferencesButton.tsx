
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { PreferencesDialog } from "./PreferencesDialog";
import { TemplatePreferences } from "@/lib/types/preferences";
import { useDocument } from "@/hooks/document";

const defaultPreferences: TemplatePreferences = {
  typography: {
    fontUnit: 'px',
  },
};

export const PreferencesButton = () => {
  const [open, setOpen] = useState(false);
  const { preferences, setPreferences } = useDocument();

  // Initialize preferences if they don't exist
  useEffect(() => {
    if (!preferences) {
      setPreferences?.(defaultPreferences);
    }
  }, [preferences, setPreferences]);

  const handlePreferencesChange = (newPreferences: TemplatePreferences) => {
    if (setPreferences) {
      setPreferences(newPreferences);
      console.log('New preferences:', newPreferences);
    }
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
        preferences={preferences || defaultPreferences}
        onPreferencesChange={handlePreferencesChange}
      />
    </>
  );
};
