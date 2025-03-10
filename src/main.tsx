
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add timestamp as a cache-busting query parameter
const appVersion = Date.now();
console.log(`App loaded with version: ${appVersion}`);

createRoot(document.getElementById("root")!).render(<App key={`app-${appVersion}`} />);
