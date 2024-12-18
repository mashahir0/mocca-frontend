import { Navigate } from "react-router-dom";
import { userAuth } from "./useAuth";

const RequireAuthLogin = ({ children }) => {
  const { userToken } = userAuth();
  if (userToken) {
    return <Navigate to="/home" />;
  }
  return children;
};
export default RequireAuthLogin;
