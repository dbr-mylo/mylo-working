
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { FontUnit, extractFontSizeValue, convertFontSize } from "@/lib/types/preferences";

interface FontSizeControlProps {
  value: string;
  onChange: (value: string) => void;
  currentUnit?: FontUnit;
}

export const FontSizeControl = ({ value, onChange, currentUnit: propCurrentUnit }: FontSizeControlProps) => {
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  
  // Use the provided unit or fall back to preferences
  const currentUnit = propCurrentUnit || preferences?.typography?.fontUnit || 'px';
  
  const [internalValue, setInternalValue] = useState(extractFontSizeValue(value));
  
  // Update internal value when external value or unit changes
  useEffect(() => {
    const extracted = extractFontSizeValue(value);
    // Convert to current unit if needed
    if (extracted.unit !== currentUnit) {
      const converted = convertFontSize(value, extracted.unit, currentUnit);
      const convertedValue = extractFontSizeValue(converted);
      setInternalValue(convertedValue);
      // Propagate the converted value up
      onChange(converted);
    } else {
      setInternalValue(extracted);
    }
  }, [value, currentUnit, onChange]);

  // Get number value only
  const getNumberValue = (): number => {
    return internalValue.value;
  };

  // Format the display value with the current unit
  const formatDisplayValue = (): string => {
    return `${getNumberValue()}${currentUnit}`;
  };

  // Handle slider change
  const handleSliderChange = (newValue: number[]) => {
    const formattedValue = `${newValue[0]}${currentUnit}`;
    setInternalValue({
      value: newValue[0],
      unit: currentUnit
    });
    onChange(formattedValue);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      const formattedValue = `${newValue}${currentUnit}`;
      setInternalValue({
        value: newValue,
        unit: currentUnit
      });
      onChange(formattedValue);
    }
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <Label htmlFor="font-size" className="text-xs">Font Size</Label>
        <span className="text-xs text-gray-500">{formatDisplayValue()}</span>
      </div>
      <div className="flex items-center gap-1">
        <Slider 
          id="font-size"
          value={[getNumberValue()]} 
          min={8} 
          max={72} 
          step={1}
          onValueChange={handleSliderChange}
          className="flex-1"
        />
        <Input
          type="number"
          value={getNumberValue()}
          onChange={handleInputChange}
          className="w-14"
          min={8}
          max={72}
        />
        <span className="text-xs text-muted-foreground">{currentUnit}</span>
      </div>
    </div>
  );
};
