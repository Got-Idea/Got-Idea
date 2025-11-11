import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Background3D from "@/components/Background3D";
import FloatingCode from "@/components/FloatingCode";
import FishCursor from "@/components/FishCursor";
import FloatingFish from "@/components/FloatingFish";

const Home = () => {
  return (
    <div className="min-h-screen relative cursor-none">
      <FishCursor />
      <FloatingFish />
      <Background3D />
      <FloatingCode />
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
};

export default Home;
