import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import "./colors.css";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DataProvider>
          <App />
          <Toaster
            toastOptions={{
              success: {
                iconTheme: {
                  primary: "var(--color-btn)",
                  secondary: "var(--color-card)",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f97373",
                  secondary: "var(--color-card)",
                },
              },
            }}
          />
        </DataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
