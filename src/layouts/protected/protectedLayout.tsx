import {FC} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import { page_routes } from "../../utils/page_routes";
import { useUser } from "../../hooks/useUser";

/*
 * Layout to redirect the user to auth screen if not logged in else display dashboard or protected screen
 */
const ProtectedLayout: FC = () => {
  const location = useLocation();
  const {isAuthenticated} = useUser();

  return isAuthenticated ? <Outlet /> : 
  <Navigate to={page_routes.auth.login} state={{from: location}} replace />;
};

export default ProtectedLayout;
