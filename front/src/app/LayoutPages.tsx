import React, { Suspense, useEffect } from "react";
import { Preloader, SnackBarInstance } from "@quark-uilib/components";
import { Outlet, useLocation } from "react-router-dom";
import { MainWrapper, PageWrapper } from "./styles";

import ErrorBoundary from "src/components/ErrorBoundary";
import Sidebar from "src/components/Sidebar";
import { clientRoutes } from "src/routes/constants";
import { useStores } from "src/dal";

export const LayoutPages: React.FC = () => {
  const location = useLocation();
  const { AuthStore } = useStores();
  useEffect(() => {
    if (location.pathname !== clientRoutes.auth.path) {
      AuthStore.me();
    }
  }, []);

  return (
    <Suspense fallback={<Preloader type="loading" />}>
      <ErrorBoundary>
        <MainWrapper>
          <SnackBarInstance />
          {location.pathname !== clientRoutes.main.path && <Sidebar />}
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </MainWrapper>
      </ErrorBoundary>
    </Suspense>
  );
};
