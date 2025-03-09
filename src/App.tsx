
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Auth from "./pages/Auth";
import DocumentSelection from "./pages/DocumentSelection";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import StyleTest from "./pages/StyleTest";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/editor" element={<Index />} />
            <Route path="/editor/:documentId" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/documents" element={<DocumentSelection />} />
            <Route path="/style-test" element={<StyleTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
