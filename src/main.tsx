import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import "./colors.css";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <DataProvider>
                <App />
            </DataProvider>
        </ThemeProvider>
    </StrictMode>
);
