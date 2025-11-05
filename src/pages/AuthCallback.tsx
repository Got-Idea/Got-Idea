import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // Session is being established
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Auth callback error:", error);
            navigate("/auth");
            return;
          }

          if (session) {
            console.log("Session established successfully");
            // Small delay to ensure session is fully set
            setTimeout(() => {
              navigate("/workspace", { replace: true });
            }, 100);
          } else {
            console.log("No session found after callback");
            navigate("/auth");
          }
        } else {
          // No access token in URL, check if we already have a session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            navigate("/workspace", { replace: true });
          } else {
            navigate("/auth");
          }
        }
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
