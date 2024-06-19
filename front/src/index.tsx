import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App } from "src/app/App";
import { routes } from "src/routes";
import ErrorBoundaryRouter from "src/components/ErrorBoundaryRouter";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <RouterProvider
      router={createBrowserRouter([
        {
          element: <App />,
          children: routes,
          errorElement: <ErrorBoundaryRouter />
        }
      ])}
    />
  );
}
