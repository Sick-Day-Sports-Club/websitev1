export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50" id="how">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-xl text-gray-700">Optimizing your days off has never been easier</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-[#4a7729] mb-5">1</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Share Your Profile</h3>
            <p className="text-gray-700">Give us your adventure preference beta including preferred locations, sports, skill levels, social interests and timing then we'll find the perfect matches for your next adventure.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-[#4a7729] mb-5">2</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Book Your Session</h3>
            <p className="text-gray-700">Every Sunday morning we'll offer a menu of adventure options for the week ahead matched to your adventure preferences, availability and upcoming conditions. Book a spot and you're good to go.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-[#4a7729] mb-5">3</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Enjoy Your Adventure</h3>
            <p className="text-gray-700">Meet your guide at the designated spot, enjoy the adventure then get back to work. We'll only share proof on social if you post first.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 