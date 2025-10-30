import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const Auth = () => {
  const [isOn, setIsOn] = useState(false);
  const lampRef = useRef<SVGSVGElement>(null);
  const dummyCordRef = useRef<SVGLineElement>(null);
  const hitRef = useRef<SVGCircleElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/workspace");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/workspace");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!dummyCordRef.current || !hitRef.current || !proxyRef.current) return;

    const ENDX = 124;
    const ENDY = 348;
    let startX = 0;
    let startY = 0;

    gsap.set(proxyRef.current, { x: ENDX, y: ENDY });

    Draggable.create(proxyRef.current, {
      trigger: hitRef.current,
      type: "x,y",
      onPress: (e) => {
        startX = e.x;
        startY = e.y;
      },
      onDrag: function() {
        gsap.set(dummyCordRef.current, {
          attr: { x2: this.x, y2: Math.max(400, this.y) }
        });
      },
      onRelease: function(e) {
        const DISTX = Math.abs(e.x - startX);
        const DISTY = Math.abs(e.y - startY);
        const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
        
        gsap.to(dummyCordRef.current, {
          attr: { x2: ENDX, y2: ENDY },
          duration: 0.1,
          onComplete: () => {
            if (TRAVELLED > 50) {
              setIsOn(prev => !prev);
            }
            gsap.set(proxyRef.current, { x: ENDX, y: ENDY });
          }
        });
      }
    });
  }, []);

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/workspace`
      }
    });

    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-16 px-4" style={{ background: '#121921' }}>
      <style>{`
        :root {
          --lamp-on: ${isOn ? '1' : '0'};
          --shade-hue: ${isOn ? Math.floor(Math.random() * 360) : '320'};
        }
      `}</style>

      <div ref={proxyRef} className="absolute pointer-events-none" />

      <svg
        ref={lampRef}
        className="w-[300px] h-auto"
        viewBox="0 0 333 484"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="165" cy="220" rx="130" ry="20" fill={isOn ? "hsl(50, 90%, 90%)" : "hsl(50, 10%, 20%)"} opacity={isOn ? 0.3 : 1} />
        
        <path d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" fill={isOn ? "hsl(0, 0%, 80%)" : "hsl(0, 0%, 40%)"} />
        <ellipse cx="165" cy="430" rx="80" ry="20" fill={isOn ? "hsl(0, 0%, 80%)" : "hsl(0, 0%, 40%)"} />
        
        <path d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" fill={isOn ? "hsl(0, 0%, 60%)" : "hsl(0, 0%, 20%)"} />
        
        <line ref={dummyCordRef} x1="124" y1="190" x2="124" y2="348" stroke={isOn ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 40%)"} strokeWidth="6" strokeLinecap="round" />
        
        {isOn && (
          <path d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z" fill="url(#light)" opacity="0.2" />
        )}
        
        <path fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" fill={`hsl(var(--shade-hue), ${isOn ? '20%' : '0%'}, ${isOn ? '30%' : '10%'})`} />
        
        {isOn && (
          <g>
            <path d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z" fill="#141414" />
            <circle cx="179.4" cy="172.6" r="18" fill="#e06952" />
          </g>
        )}
        
        <path d="M115 135c0-5.523-5.82-10-13-10s-13 4.477-13 10" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" transform={isOn ? "" : "translate(0, 10)"} />
        <path d="M241 135c0-5.523-5.82-10-13-10s-13 4.477-13 10" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" transform={isOn ? "" : "translate(0, 10)"} />
        
        <circle ref={hitRef} cx="124" cy="347" r="66" fill="transparent" className="cursor-pointer" />
        
        <defs>
          <linearGradient id="light" x1="165.5" y1="218.5" x2="165.5" y2="483.5" gradientUnits="userSpaceOnUse">
            <stop stopColor={`hsl(var(--shade-hue), 40%, 70%)`} stopOpacity="0.4" />
            <stop offset="1" stopColor={`hsl(var(--shade-hue), 40%, 70%)`} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div 
        className={`bg-[rgba(18,25,33,0.9)] p-12 rounded-3xl min-w-[320px] transition-all duration-500 ${
          isOn 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto border-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
            : 'opacity-0 scale-80 translate-y-5 pointer-events-none border-2 border-transparent'
        }`}
        style={{
          borderColor: isOn ? `hsl(var(--shade-hue), 40%, 45%)` : 'transparent',
          boxShadow: isOn ? `0 0 30px hsl(var(--shade-hue), 40%, 45%), inset 0 0 15px rgba(255,255,255,0.05)` : 'none'
        }}
      >
        <h2 className="text-white text-3xl mb-8 text-center" style={{ textShadow: isOn ? `0 0 8px hsl(var(--shade-hue), 40%, 45%)` : 'none' }}>
          Welcome Back
        </h2>
        
        <div className="space-y-4">
          <Button
            onClick={() => handleOAuthSignIn('github')}
            className="w-full py-6 text-base font-semibold"
            variant="outline"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: '#fff'
            }}
          >
            <Github className="w-5 h-5 mr-3" />
            Continue with GitHub
          </Button>

          <Button
            onClick={() => handleOAuthSignIn('google')}
            className="w-full py-6 text-base font-semibold"
            variant="outline"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: '#fff'
            }}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
