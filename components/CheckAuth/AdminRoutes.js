import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAdminAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("data"));
      if (userData.login_as !== "admin") {
        router.replace("/unauthorized");
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };

  if (Component.layout) {
    AuthenticatedComponent.layout = Component.layout;
  }

  return AuthenticatedComponent;
};

export default withAdminAuth;
