import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import ScrollToTop from "./components/ScrollToTop"
import Index from "./pages/Index"
import ProductPage from "./pages/ProductPage"
import StoreInfo from "./pages/StoreInfo"
import NotFound from "./pages/NotFound"
import Admin from "./pages/Admin"
import AnalyticsConsent from "./components/AnalyticsConsent"

const queryClient = new QueryClient()
const App = () => <QueryClientProvider client={queryClient}><TooltipProvider><Toaster/><Sonner/><AnalyticsConsent/><BrowserRouter><ScrollToTop/><Routes>
  <Route path="/" element={<Index/>}/>
  <Route path="/products/:slug" element={<ProductPage/>}/>
  <Route path="/about" element={<StoreInfo/>}/>
  <Route path="/shipping" element={<StoreInfo/>}/>
  <Route path="/returns" element={<StoreInfo/>}/>
  <Route path="/terms" element={<StoreInfo/>}/>
  <Route path="/privacy" element={<StoreInfo/>}/>
  <Route path="/admin" element={<Admin/>}/>
  <Route path="*" element={<NotFound/>}/>
</Routes></BrowserRouter></TooltipProvider></QueryClientProvider>
export default App
