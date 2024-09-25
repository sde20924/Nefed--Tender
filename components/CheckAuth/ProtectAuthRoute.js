import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const protectAuthRoute = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Change initial state to null to handle loading state
    const router = useRouter();

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("token");
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      };

      checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Show a loading state while checking authentication
    }

    if (isAuthenticated) {
      // Redirect to dashboard if authenticated
      router.push("/dashboard");
      return null; // Optionally, you can return a redirect component or something similar
    }

    return <WrappedComponent {...props} />;
  };
};

export default protectAuthRoute;
