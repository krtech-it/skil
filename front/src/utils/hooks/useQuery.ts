import { useLocation } from "react-router-dom";

export const useQuery = (): URLSearchParams => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};
