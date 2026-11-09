import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";
import { ShopProvider } from "./lib/shop";

createRoot(document.getElementById("root")!).render(
  <ShopProvider>
    <App />
  </ShopProvider>
);
