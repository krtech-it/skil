import React from "react";
import Error503 from "src/modules/errors/pages/Error503";

interface IErrorPageProps {
  error: any;
  errorInfo: React.ErrorInfo | null;
  moduleName?: string;
}

const ErrorPage: React.FC<IErrorPageProps> = ({
  error,
  errorInfo,
  moduleName
}) => {
  const customErrorEvent = new CustomEvent("customerror", {
    detail: {
      error,
      errorInfo,
      moduleName
    }
  });
  document.dispatchEvent(customErrorEvent);

  return <Error503 />;
};

export default ErrorPage;
