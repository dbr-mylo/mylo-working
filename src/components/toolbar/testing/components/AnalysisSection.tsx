
import React from 'react';

interface AnalysisSectionProps {
  title: string;
  children: React.ReactNode;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, children }) => {
  return (
    <section className="space-y-2 mb-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {children}
    </section>
  );
};
