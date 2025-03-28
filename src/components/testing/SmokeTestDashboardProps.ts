
import { SmokeTestResult } from "@/hooks/useSmokeTest";

export interface SmokeTestDashboardProps {
  onTestRunComplete?: (results: SmokeTestResult[]) => void;
}
