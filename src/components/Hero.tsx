import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fashion Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="animate-fade-in">
          <h1 className="text-hero text-white mb-6 leading-tight">
            Elevate Your
            <span className="block bg-gradient-gold bg-clip-text text-transparent">
              Style
            </span>
          </h1>
          <p className="text-subtitle text-white/90 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium fashion pieces that blend
            timeless elegance with contemporary design
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero">
              Shop New Collection
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-outline-premium border-white text-white hover:bg-white hover:text-primary"
            >
              Explore Lookbook
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;