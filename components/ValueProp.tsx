import React from 'react';
import Container from './Container';

interface ValuePropProps {}

const ValueProp: React.FC<ValuePropProps> = () => {
  return (
    <section className="py-20 text-center bg-white">
      <Container>
        <h2 className="text-4xl font-bold mb-5 text-gray-900">Why Sick Day Sports Club?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-700">
          We&apos;re building the easiest way to turn sick days into SICK days with personalized adventure recommendations that match your skills, schedule, and preferences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-5xl mb-4">🌡️</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Personalized Adventures</h3>
            <p className="text-gray-700">Weekly adventure options matched to your specific skills, adventure style, and social preferences. Choose from solo adventures or group experiences based on your mood.</p>
          </div>
          
          <div className="p-8 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Expert Local Guides</h3>
            <p className="text-gray-700">Connect with certified professionals who know the best local spots. Our guides prescribe the perfect adventure to treat your sick day symptoms, regardless of your experience level.</p>
          </div>
          
          <div className="p-8 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-5xl mb-4">💊</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Flexible Membership Tiers</h3>
            <p className="text-gray-700">Choose the membership that fits your adventure style. From our Basic tier with solo adventures to our premium Bomber tier with group experiences and gear shuttle service, we have options for every need.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ValueProp; 