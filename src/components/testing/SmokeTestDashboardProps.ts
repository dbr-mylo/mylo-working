
import { SmokeTestResult } from "@/hooks/useSmokeTest";

export interface SmokeTestDashboardProps {
  onTestRunComplete?: (results: SmokeTestResult[]) => void;
}

// Make sure the SmokeTestDashboard component accepts these props
export type { SmokeTestDashboardProps as SmokeTestDashboardPropsType };
