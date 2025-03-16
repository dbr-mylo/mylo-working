
interface TemplateStylesProps {
  customStyles: string;
  onStylesChange: (styles: string) => void;
}

export const TemplateStyles = ({ customStyles, onStylesChange }: TemplateStylesProps) => {
  return (
    <div>
      <textarea
        value={customStyles}
        onChange={(e) => onStylesChange(e.target.value)}
        placeholder="Enter custom CSS styles"
        className="w-full h-24 p-2 text-sm font-mono border border-gray-300 rounded-md"
      />
    </div>
  );
};
