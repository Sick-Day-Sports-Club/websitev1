'use client';

import { useEffect, useState } from 'react';
import Container from './Container';

export default function BackToWorkTips() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Get current date components
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    // Create a deterministic number based on the date
    // This will be consistent for all visitors on the same day
    // Base number is 80, add up to 20 based on day of month
    // Add up to 30 based on month
    // Multiply by a factor based on the year to vary year over year
    const baseCount = 80;
    const dayFactor = Math.floor((day / 31) * 20);
    const monthFactor = Math.floor((month / 11) * 30);
    const yearOffset = ((year - 2024) * 13) % 20;
    
    const dailyCount = baseCount + dayFactor + monthFactor + yearOffset;
    setCount(dailyCount);
  }, []);

  return (
    <section className="py-16 bg-secondary-light">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-secondary">Back to Work Tips</h2>
          <p className="text-xl text-gray-700">For a smooth return to the office after a sick day</p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <ul className="space-y-4">
            <li className="pl-8 relative text-secondary">
              <span className="absolute left-0 top-1 text-primary">✓</span>
              <strong>Grin Control</strong> - Remember to avoid gloating (but share just enough residual stoke to instill some friendly FOMO).
            </li>
            <li className="pl-8 relative text-secondary">
              <span className="absolute left-0 top-1 text-primary">✓</span>
              <strong>Voice Modulation</strong> - Hooting a buddy&apos;s full send is great when outside but remember to use your inside voice back in the office.
            </li>
            <li className="pl-8 relative text-secondary">
              <span className="absolute left-0 top-1 text-primary">✓</span>
              <strong>Wear Sunscreen</strong> - Raccoon eyes from a goggle tan is just going to make your coworkers jealous.
            </li>
            <li className="pl-8 relative text-secondary">
              <span className="absolute left-0 top-1 text-primary">✓</span>
              <strong>Wash Up</strong> - Lingering chalk dust and mud splatters on your pants are dead giveaways and trail grime in your hair is just gross.
            </li>
          </ul>
          
          <div className="text-center mt-8">
            <p className="text-gray-700 font-medium">
              <span className="font-bold text-secondary">{count}</span> sick days well spent this month
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
