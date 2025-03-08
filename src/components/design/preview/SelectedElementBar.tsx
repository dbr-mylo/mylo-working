
import { StyleApplicator } from "../typography/StyleApplicator";

interface SelectedElementBarProps {
  selectedElement: HTMLElement | null;
  onApplyStyle: (styleId: string) => Promise<void>;
}

export const SelectedElementBar = ({ selectedElement, onApplyStyle }: SelectedElementBarProps) => {
  if (!selectedElement) {
    return null;
  }

  return (
    <div className="mb-4 flex justify-between items-center bg-background p-2 rounded-md">
      <div className="text-xs">
        <span className="font-medium">Selected: </span>
        <span className="text-muted-foreground">{selectedElement.tagName.toLowerCase()}</span>
      </div>
      <StyleApplicator 
        onApplyStyle={onApplyStyle}
        selectedElement={selectedElement}
      />
    </div>
  );
};
