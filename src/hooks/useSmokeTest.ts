
/**
 * @file useSmokeTest.ts
 * @description A React hook for running smoke tests on component render
 * 
 * This hook provides a way to verify that components render correctly and
 * their essential functionality works. It's designed to be used in development
 * and testing environments, with minimal impact on production performance.
 * 
 * @example
 * // Basic usage
 * const MyComponent = () => {
 *   useSmokeTest("MyComponent");
 *   return <div>My Component</div>;
 * };
 * 
 * @example
 * // Testing a specific feature
 * const Counter = () => {
 *   const { testFeature } = useSmokeTest("Counter");
 *   const [count, setCount] = useState(0);
 *   
 *   // Test increment functionality
 *   useEffect(() => {
 *     testFeature("increment", () => {
 *       const initialCount = count;
 *       setCount(prev => prev + 1);
 *       // This would normally be in another useEffect, but for testing we verify sync
 *       if (count !== initialCount + 1) {
 *         throw new Error("Increment failed");
 *       }
 *     });
 *   }, []);
 *   
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
 *     </div>
 *   );
 * };
 */

// Re-export from the new modular implementation
export * from "./smoke-testing/useSmokeTest";
