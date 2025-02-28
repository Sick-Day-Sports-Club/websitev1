export default function ValueProp() {
  return (
    <section className="py-20 text-center bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-5 text-gray-900">Why Sick Day Sports Club?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-700">
          We&apos;re building the easiest way to turn your sick days into SICK days with qualified local guides for day trips and short outdoor experiences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-5xl mb-4">🌡️</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Effortless Matching</h3>
            <p className="text-gray-700">Adventures matched by our algorithm with your skills, stoke and social preferences. Be out the door before you can set up that OOO message.</p>
          </div>
          
          <div className="p-8 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Expert Guides</h3>
            <p className="text-gray-700">Prescribed adventures by the best local experts who know just the right secret stash to treat your sick day symptoms.</p>
          </div>
          
          <div className="p-8 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-5xl mb-4">💊</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">No Hidden Fees</h3>
            <p className="text-gray-700">Our club keeps costs low by charging a subscription instead of a commission so your dollars go straight to the local guide. Choose to DIY equipment and gear or share the details on your quiver and we&apos;ll help fill any gaps.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 