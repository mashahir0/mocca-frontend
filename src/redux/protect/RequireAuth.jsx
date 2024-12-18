import { Navigate } from "react-router-dom";
import { userAuth } from "./useAuth";

const RequireAuth = ({ children }) => {
  const { userToken } = userAuth();
  if (!userToken) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default RequireAuth;
