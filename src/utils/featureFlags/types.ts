
import { FeatureFlagKey } from './featureFlags';
import { UserRole } from '@/lib/types';

/**
 * Feature flag history entry
 */
export interface FeatureFlagHistoryEntry {
  flagName: FeatureFlagKey;
  timestamp: number;
  previousValue: boolean | null;
  newValue: boolean | null;
  changedBy: string;
  action?: 'create' | 'reset' | 'visibility-change' | 'toggle';
  metadata?: Record<string, any>;
}

/**
 * Feature flag usage statistics
 */
export interface FeatureFlagUsageStats {
  name: string;
  impressions: number;
  usageRate: number;
  byRole: Record<string, number>;
  healthImpact: number;
}

/**
 * Pattern for automated error recovery suggestion
 */
export interface ErrorPattern {
  pattern: string;
  category: string;
  frequency: number;
  remediation: string;
  autoRecoverable: boolean;
  successRate: number;
}

/**
 * Saved troubleshooting session
 */
export interface TroubleshootingSession {
  id: string;
  feature: string;
  context: string;
  errorMessage: string;
  errorStack?: string;
  stepsTaken: TroubleshootingStep[];
  status: 'in-progress' | 'resolved' | 'abandoned';
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
}

/**
 * Troubleshooting step
 */
export interface TroubleshootingStep {
  id: string;
  action: string;
  result: 'success' | 'failure' | 'inconclusive';
  timestamp: number;
  notes?: string;
}
