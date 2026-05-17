import { Navigate, Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const RequireAuth = () => {
  const { store } = useGlobalReducer();
  if (!store.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
