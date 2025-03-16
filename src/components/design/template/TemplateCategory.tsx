
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateCategoryProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export const TemplateCategory = ({ category, onCategoryChange }: TemplateCategoryProps) => {
  return (
    <div className="py-2">
      <Label htmlFor="template-category" className="text-sm block mb-1">
        Category
      </Label>
      <Select
        value={category}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger id="template-category">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="letter">Letter</SelectItem>
          <SelectItem value="report">Report</SelectItem>
          <SelectItem value="invoice">Invoice</SelectItem>
          <SelectItem value="resume">Resume</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
