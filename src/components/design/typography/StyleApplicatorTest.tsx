
import React from "react";
import { StyleCreator } from "./test/StyleCreator";
import { StylesBrowser } from "./test/StylesBrowser";
import { useStyleApplicatorTest } from "./test/useStyleApplicatorTest";

export const StyleApplicatorTest = () => {
  const {
    styles,
    selectedStyleId,
    setSelectedStyleId,
    newStyleId,
    newStyleParentId,
    newStyleProperties,
    handleStyleChange,
    handleParentChange,
    handleSaveNewStyle,
    handleApplyStyle
  } = useStyleApplicatorTest();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Style Inheritance Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StyleCreator
          newStyleId={newStyleId}
          newStyleParentId={newStyleParentId}
          newStyleProperties={newStyleProperties}
          onParentChange={handleParentChange}
          onStyleChange={handleStyleChange}
          onSaveStyle={handleSaveNewStyle}
        />
        
        <StylesBrowser
          styles={styles}
          selectedStyleId={selectedStyleId}
          onSelectStyle={setSelectedStyleId}
          onApplyStyle={handleApplyStyle}
        />
      </div>
    </div>
  );
};
