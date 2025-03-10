
import React from "react";
import { StyleCreationCard } from "./cards/StyleCreationCard";
import { StyleSelectionCard } from "./cards/StyleSelectionCard";
import { useStyleApplicatorTest } from "./hooks/useStyleApplicatorTest";

export const StyleApplicatorTest = () => {
  const {
    styles,
    selectedStyleId,
    setSelectedStyleId,
    newStyleId,
    newStyleParentId,
    newStyleProperties,
    handleStyleChange,
    handleSaveNewStyle,
    handleParentChange,
    handleApplyStyle
  } = useStyleApplicatorTest();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Style Inheritance Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StyleCreationCard 
          newStyleId={newStyleId}
          newStyleParentId={newStyleParentId}
          newStyleProperties={newStyleProperties}
          handleStyleChange={handleStyleChange}
          handleParentChange={handleParentChange}
          handleSaveNewStyle={handleSaveNewStyle}
        />
        
        <StyleSelectionCard
          styles={styles}
          selectedStyleId={selectedStyleId}
          setSelectedStyleId={setSelectedStyleId}
          handleApplyStyle={handleApplyStyle}
        />
      </div>
    </div>
  );
};
