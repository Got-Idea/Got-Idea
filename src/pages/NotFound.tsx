import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
