import React from "react";

export interface IProtectedRouteProps {
  permissions?: string[];
  children: React.ReactNode;
}
