import { FC, ReactNode } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AuthPage } from "../../pages";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === "configuring") {
    return <span>Loading...</span>;
  }

  if (authStatus !== "authenticated") {
    return <AuthPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
