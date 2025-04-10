
import { useNavigate } from "react-router-dom";
import { useRouteValidation } from "./navigation/useRouteValidation";

/**
 * Simple wrapper hook that combines useNavigate with route validation
 */
export const useValidatedNavigation = () => {
  const navigate = useNavigate();
  const { validateRoute } = useRouteValidation();
  
  const navigateTo = (path: string) => {
    if (validateRoute(path)) {
      navigate(path);
    } else {
      console.warn(`Invalid navigation attempt to ${path}`);
      navigate("/not-found");
    }
  };
  
  return {
    navigateTo
  };
};
