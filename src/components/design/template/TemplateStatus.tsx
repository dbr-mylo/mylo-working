
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EyeOff, Eye } from "lucide-react";

interface TemplateStatusProps {
  status: 'draft' | 'published';
  onToggleStatus: () => void;
  canPublish: boolean;
}

export const TemplateStatus = ({ status, onToggleStatus, canPublish }: TemplateStatusProps) => {
  if (!canPublish) return null;
  
  return (
    <div className="flex items-center justify-between py-2">
      <Label htmlFor="template-status" className="text-sm">
        Template Status:
      </Label>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {status === "published" ? "Published" : "Draft"}
        </span>
        <Switch
          id="template-status"
          checked={status === "published"}
          onCheckedChange={onToggleStatus}
        />
        <span className="text-sm text-gray-400">
          {status === "published" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </span>
      </div>
    </div>
  );
};
