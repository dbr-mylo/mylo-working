
import { useState, useEffect } from "react";
import { textStyleStore } from "@/stores/textStyles";

interface UseStyleNameValidatorProps {
  name: string;
  currentStyleId?: string;
}

export const useStyleNameValidator = ({ name, currentStyleId }: UseStyleNameValidatorProps) => {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    // Reset validation when name changes
    setIsValid(!!name.trim());
    
    // Don't check for duplicates if the name is empty
    if (!name.trim()) {
      setIsDuplicate(false);
      return;
    }
    
    const checkDuplicateName = async () => {
      setIsChecking(true);
      try {
        const styles = await textStyleStore.getTextStyles();
        
        // Check if any other style has the same name
        const duplicate = styles.some(
          style => 
            style.name.toLowerCase() === name.toLowerCase() && 
            style.id !== currentStyleId
        );
        
        setIsDuplicate(duplicate);
      } catch (error) {
        console.error("Error checking for duplicate style names:", error);
        setIsDuplicate(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    // Use a debounce of 500ms to avoid too many checks while typing
    const timeoutId = setTimeout(() => {
      checkDuplicateName();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [name, currentStyleId]);
  
  return { isDuplicate, isChecking, isValid };
};
