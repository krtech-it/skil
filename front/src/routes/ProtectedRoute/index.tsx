import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Preloader } from "@quark-uilib/components";
import { IProtectedRouteProps } from "./types";
import { useStores } from "src/dal";
import { clientRoutes } from "src/routes/constants";

const ProtectedRoute: React.FC<IProtectedRouteProps> = observer(
  ({ children, permissions = [] }) => {
    const { AuthStore } = useStores();
    const { isAuth, checkAuth, permissions: permissionsUser } = AuthStore;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      checkAuth();
      setIsLoading(false);
    }, []);

    if (isLoading) {
      return <Preloader type="loading" />;
    }

    if (!isAuth) {
      return <Navigate to={clientRoutes.auth.path} />;
    }

    if (
      permissions?.length === 0 ||
      permissions.some((permission) => permissionsUser.includes(permission))
    ) {
      return <>{children}</>;
    }

    return <Navigate to={clientRoutes["403"].path} />;
  }
);

export default ProtectedRoute;
