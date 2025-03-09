
import React from "react";
import { TextStyle } from "@/lib/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Link, Link2Off } from "lucide-react";

interface StyleInheritanceSelectProps {
  styles: TextStyle[];
  parentId?: string;
  onChange: (parentId: string | undefined) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
}

export const StyleInheritanceSelect = ({
  styles,
  parentId,
  onChange,
  disabled = false,
  loading = false,
  error = null
}: StyleInheritanceSelectProps) => {
  const handleSelectChange = (value: string) => {
    if (value === parentId) return;
    onChange(value === "none" ? undefined : value);
  };

  return (
    <Select
      disabled={disabled || loading}
      value={parentId || "none"}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger id="parent-style" className={error ? "border-destructive" : ""}>
        <SelectValue placeholder={loading ? "Loading styles..." : "Select parent style"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" className="flex items-center">
          <Link2Off className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>None (Base Style)</span>
        </SelectItem>
        {styles.map((style) => (
          <SelectItem key={style.id} value={style.id} className="flex items-center">
            <Link className="h-3.5 w-3.5 mr-2 text-primary" />
            <span>{style.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
