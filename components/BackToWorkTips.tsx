'use client';

import { useEffect, useState } from 'react';

export default function BackToWorkTips() {
  const [count, setCount] = useState(127);
  
  useEffect(() => {
    // Simple counter that starts at a random value and increases slowly
    // Start with a random value between 80 and 180
    setCount(Math.floor(Math.random() * 100) + 80);
    const maxCount = 399;
    
    // Increment counter at random intervals
    const interval = setInterval(() => {
      // Only increment if below max
      setCount(prevCount => {
        if (prevCount < maxCount) {
          // Random increment between 1 and 3
          const newCount = prevCount + Math.floor(Math.random() * 3) + 1;
          return newCount > maxCount ? maxCount : newCount;
        }
        return prevCount;
      });
    }, 7000); // Update every 7 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Back to Work Tips</h2>
          <p className="text-xl text-gray-600">For a smooth return to the office</p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg">
          <ul className="space-y-4">
            <li className="pl-8 relative">
              <span className="absolute left-0 top-1">✓</span>
              <strong>Grin Control</strong> - Remember to avoid gloating (but share just enough residual stoke to instill some friendly FOMO).
            </li>
            <li className="pl-8 relative">
              <span className="absolute left-0 top-1">✓</span>
              <strong>Voice Modulation</strong> - Hooting a buddy&apos;s full send is great when outside but remember to use your inside voice back in the office.
            </li>
            <li className="pl-8 relative">
              <span className="absolute left-0 top-1">✓</span>
              <strong>Wear Sunscreen</strong> - Raccoon eyes from a goggle tan is just going to make your coworkers jealous.
            </li>
            <li className="pl-8 relative">
              <span className="absolute left-0 top-1">✓</span>
              <strong>Wash up</strong> - Lingering chalk dust and mud splatters on your pants are dead giveaways and trail grime in your hair is just gross.
            </li>
          </ul>
          
          <div className="text-center mt-8 italic text-gray-600">
            <p>
              <span className="font-bold">{count}</span> sick days well spent this month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
