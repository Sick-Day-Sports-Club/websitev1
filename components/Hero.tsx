import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-start">
      {/* Background div that contains the image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-background.jpg"
          alt="Skiers touring through a pristine snowy mountain landscape"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-0"></div>
      
      {/* Content */}
      <div className="max-w-[600px] px-12 text-white relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5">
          Take That Sick Day. Make It Count.
        </h1>
        <p className="text-xl mb-8 max-w-[500px]">
          Connect with expert local guides for short but epic adventures in action sports and outdoor activities when you need a break from Zoom.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="#signup" 
            className="bg-[#4a7729] hover:bg-[#3d6222] text-white font-semibold py-3 px-8 rounded-md transition-colors"
          >
            Get Early Access
          </Link>
          <Link 
            href="#how" 
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-md transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
} 