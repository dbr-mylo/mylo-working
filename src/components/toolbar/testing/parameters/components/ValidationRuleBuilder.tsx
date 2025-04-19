
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Plus, Trash2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ValidationRuleBuilder } from '@/utils/navigation/parameters/nestedParameterHandler';

interface ValidationRuleBuilderUIProps {
  onApplyRules: (rules: Record<string, any>) => void;
  parameterNames: string[];
}

export const ValidationRuleBuilderUI: React.FC<ValidationRuleBuilderUIProps> = ({
  onApplyRules,
  parameterNames
}) => {
  const [rules, setRules] = useState<Record<string, any>>({});
  const [currentParam, setCurrentParam] = useState<string | null>(null);
  const [ruleType, setRuleType] = useState<string>('string');
  const [isRequired, setIsRequired] = useState(false);
  const [minLength, setMinLength] = useState<string>('');
  const [maxLength, setMaxLength] = useState<string>('');
  const [pattern, setPattern] = useState<string>('');
  const [usePreset, setUsePreset] = useState<string>('');
  
  const addRule = () => {
    if (!currentParam) return;
    
    let ruleBuilder = new ValidationRuleBuilder();
    
    // Apply preset if selected
    if (usePreset) {
      switch (usePreset) {
        case 'uuid':
          ruleBuilder = ValidationRuleBuilder.presets.uuid();
          break;
        case 'email':
          ruleBuilder = ValidationRuleBuilder.presets.email();
          break;
        case 'slug':
          ruleBuilder = ValidationRuleBuilder.presets.slug();
          break;
        case 'date':
          ruleBuilder = ValidationRuleBuilder.presets.date();
          break;
      }
    } else {
      // Apply basic settings
      if (ruleType === 'string') ruleBuilder.string();
      if (ruleType === 'number') ruleBuilder.number();
      if (ruleType === 'boolean') ruleBuilder.boolean();
    }
    
    // Apply common settings
    if (isRequired) ruleBuilder.required();
    if (minLength) ruleBuilder.minLength(Number(minLength));
    if (maxLength) ruleBuilder.maxLength(Number(maxLength));
    if (pattern) ruleBuilder.pattern(new RegExp(pattern));
    
    // Build and add rule
    const newRules = { ...rules };
    newRules[currentParam] = ruleBuilder.build();
    setRules(newRules);
    
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setCurrentParam(null);
    setRuleType('string');
    setIsRequired(false);
    setMinLength('');
    setMaxLength('');
    setPattern('');
    setUsePreset('');
  };
  
  const removeRule = (paramName: string) => {
    const newRules = { ...rules };
    delete newRules[paramName];
    setRules(newRules);
  };
  
  const applyRules = () => {
    onApplyRules(rules);
  };
  
  const getRuleDescription = (rule: any) => {
    const parts = [];
    
    if (rule.required) parts.push('required');
    if (rule.type) parts.push(rule.type);
    if (rule.minLength !== undefined) parts.push(`min: ${rule.minLength}`);
    if (rule.maxLength !== undefined) parts.push(`max: ${rule.maxLength}`);
    if (rule.pattern) parts.push('has pattern');
    if (rule.custom) parts.push('has custom validator');
    
    return parts.join(', ');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Validation Rule Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Parameter</Label>
              <Select value={currentParam || ""} onValueChange={setCurrentParam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  {parameterNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Rule Presets</Label>
              <Select value={usePreset} onValueChange={setUsePreset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preset (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="uuid">UUID</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="slug">Slug</SelectItem>
                  <SelectItem value="date">Date (YYYY-MM-DD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={ruleType} onValueChange={setRuleType} disabled={!!usePreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Min Length</Label>
              <Input 
                type="number" 
                value={minLength} 
                onChange={e => setMinLength(e.target.value)}
                disabled={!!usePreset || ruleType !== 'string'} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Length</Label>
              <Input 
                type="number" 
                value={maxLength} 
                onChange={e => setMaxLength(e.target.value)}
                disabled={!!usePreset || ruleType !== 'string'} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={isRequired} 
                onCheckedChange={setIsRequired} 
                id="required-switch"
              />
              <Label htmlFor="required-switch">Required</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Regex Pattern</Label>
            <Input 
              value={pattern} 
              onChange={e => setPattern(e.target.value)}
              placeholder="Regular expression pattern"
              disabled={!!usePreset}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={addRule} disabled={!currentParam} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
            <Button onClick={resetForm} variant="outline">
              Reset
            </Button>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Current Rules</h3>
            {Object.keys(rules).length === 0 ? (
              <div className="text-sm text-muted-foreground">No rules added yet</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(rules).map(([paramName, rule]) => (
                  <div 
                    key={paramName}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{paramName}</span>
                      <Badge variant="outline">
                        {getRuleDescription(rule)}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeRule(paramName)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={applyRules} className="w-full mt-2">
                  Apply Rules
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
