import Container from './Container';

import React from 'react';
export default function AdventurePrescriptions() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Adventure Prescriptions</h2>
          <p className="text-xl text-gray-700">We have epic remedies for common work day symptoms:</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Videochat Voice</h3>
            <p className="mb-3 text-gray-700">Symptoms: Scratchy throat, phantom notification anxiety, &ldquo;you&apos;re on mute&rdquo; reflexes</p>
            <p className="font-semibold text-[#4a7729]">
              Prescription: <a href="https://www.mountainproject.com/route/200485559/dirt-digger" className="text-[#4a7729] underline hover:text-[#3d6222]" target="_blank" rel="noopener noreferrer">Dirt Digger</a> with <a href="https://www.instagram.com/abbysummitttran/" className="text-[#4a7729] underline hover:text-[#3d6222]" target="_blank" rel="noopener noreferrer">Abby</a>
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Spreadsheet Strain</h3>
            <p className="mb-3 text-gray-700">Symptoms: Excel-induced eye twitching, formula nightmares, pivot table PTSD</p>
            <p className="font-semibold text-[#4a7729]">
              Prescription: <a href="https://www.mtbproject.com/trail/3387063/oleary-trail-loop" className="text-[#4a7729] underline hover:text-[#3d6222]" target="_blank" rel="noopener noreferrer">O&apos;Leary Trail Loop</a> with <a href="https://www.instagram.com/brave.endeavors/" className="text-[#4a7729] underline hover:text-[#3d6222]" target="_blank" rel="noopener noreferrer">Bekah</a>
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">RTOverload</h3>
            <p className="mb-3 text-gray-700">Symptoms: Calendar anxiety, buzzword overdose, overwhelming desire for sweatpants</p>
            <p className="font-semibold text-[#4a7729]">
              Prescription: <a href="https://www.bendparksandrec.org/facility/bend-whitewater-park/" className="text-[#4a7729] underline hover:text-[#3d6222]" target="_blank" rel="noopener noreferrer">Whitewater</a> with <a href="https://www.instagram.com/saveriat" className="text-[#4a7729] underline hover:text-[#3d6222]" target="_blank" rel="noopener noreferrer">Saveria</a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
