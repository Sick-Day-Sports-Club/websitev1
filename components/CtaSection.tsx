import Link from 'next/link';
import Container from './Container';

export default function CtaSection() {
  return (
    <section className="py-24 text-center text-white relative">
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      
      {/* When you have an image, use this:
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-background.jpg"
          alt="Adventure background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70 z-0"></div>
      </div>
      */}
      
      <Container className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">We&apos;re Launching Soon</h2>
        <p className="text-xl max-w-4xl mx-auto mb-8">
          Sick Day Sports Club built a global adventure guide network and is launching in Bend, OR this spring with plans for other top adventure towns through 2025. Save those sick days and join our waitlist to be the first to know when we launch near you!
        </p>
        <Link href="#signup" className="btn-primary inline-block py-4 px-8 rounded bg-white text-black font-semibold hover:bg-gray-100 transition-colors">
          Join the Waitlist
        </Link>
      </Container>
    </section>
  );
}
