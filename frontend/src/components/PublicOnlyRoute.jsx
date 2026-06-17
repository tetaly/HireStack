import { Navigate } from "react-router-dom";
import { authStorage, nextPathForUser } from "@/lib/api";

const PublicOnlyRoute = ({ children }) => {
  const token = authStorage.getToken();
  const user = authStorage.getUser();

  if (token && user) {
    return <Navigate to={nextPathForUser(user)} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
