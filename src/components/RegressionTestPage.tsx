
import React from 'react';
import { MainRegressionTester } from './toolbar/testing';

export const RegressionTestPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <MainRegressionTester />
      </div>
    </div>
  );
};
