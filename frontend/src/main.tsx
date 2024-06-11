import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";
import { ToastBar, Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <App />
        <Toaster
          toastOptions={{
            success: {
              duration: 4000,
              className:
                "border-4 border-green-400 dark:border-green-900 bg-accent text-accent-foreground px-4 py-4",
            },
            error: {
              duration: 4000,
              className:
                "border-4 border-destructive bg-accent text-accent-foreground px-4 py-4",
            },
            loading: {
              className:
                "border-4 border-border bg-accent/10 text-accent-foreground px-4 py-4",
            },
          }}
        >
          {(t) => (
            <ToastBar
              toast={t}
              style={{}} // Overwrite styles
              position="top-center" // Used to adapt the animation
            />
          )}
        </Toaster>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
