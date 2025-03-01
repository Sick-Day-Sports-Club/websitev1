import BetaSignupForm from '@/components/BetaSignupForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Apply for Beta Access | Sick Day Sports Club',
  description: 'Join our exclusive beta program and be among the first to experience Sick Day Sports Club in Bend, OR.',
}

export default function BetaSignup() {
  return (
    <>
      <Navbar />
      <main className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Apply for Beta Access</h1>
            <p className="text-xl text-gray-600">
              Join our exclusive community of early adopters in Bend, OR and be the first to experience Sick Day Sports Club.
            </p>
          </div>
          
          <BetaSignupForm />
        </div>
      </main>
      <Footer />
    </>
  );
} 