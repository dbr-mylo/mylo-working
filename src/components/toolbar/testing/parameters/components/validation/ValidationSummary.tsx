
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ValidationSummaryProps {
  totalParams: number;
  validParams: number;
  invalidParams: number;
  criticalErrors: number;
  warningErrors: number;
  infoErrors: number;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  totalParams,
  validParams,
  invalidParams,
  criticalErrors,
  warningErrors,
  infoErrors
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{totalParams}</div>
              <div className="text-sm text-muted-foreground">Total Parameters</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-3xl font-bold text-green-600">{validParams}</span>
              </div>
              <div className="text-sm text-muted-foreground">Valid Parameters</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-3xl font-bold text-red-600">{invalidParams}</span>
              </div>
              <div className="text-sm text-muted-foreground">Invalid Parameters</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-3">Error Distribution</h3>
          <div className="space-y-3">
            {criticalErrors > 0 && (
              <div className="flex items-center">
                <Badge variant="destructive" className="w-20 justify-center">
                  Critical
                </Badge>
                <div className="flex-1 mx-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(criticalErrors / (criticalErrors + warningErrors + infoErrors)) * 100}%` }}
                  />
                </div>
                <span className="text-sm w-10 text-right">{criticalErrors}</span>
              </div>
            )}
            {warningErrors > 0 && (
              <div className="flex items-center">
                <Badge variant="outline" className="w-20 justify-center border-amber-500 text-amber-700">
                  Warning
                </Badge>
                <div className="flex-1 mx-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${(warningErrors / (criticalErrors + warningErrors + infoErrors)) * 100}%` }}
                  />
                </div>
                <span className="text-sm w-10 text-right">{warningErrors}</span>
              </div>
            )}
            {infoErrors > 0 && (
              <div className="flex items-center">
                <Badge variant="outline" className="w-20 justify-center border-blue-500 text-blue-700">
                  Info
                </Badge>
                <div className="flex-1 mx-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(infoErrors / (criticalErrors + warningErrors + infoErrors)) * 100}%` }}
                  />
                </div>
                <span className="text-sm w-10 text-right">{infoErrors}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
