export default function AdventurePrescriptions() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Adventure Prescriptions</h2>
          <p className="text-xl text-gray-600">An epic remedy to standing desk treadmill fatigue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Videochat Voice</h3>
            <p className="mb-3">Symptoms: Scratchy throat, phantom notification anxiety, &ldquo;you&apos;re on mute&rdquo; reflexes</p>
            <p className="font-semibold text-[#4a7729]">
              Prescription: <a href="https://www.mountainproject.com/route/200485559/dirt-digger" className="text-[#4a7729] underline">Dirt Digger</a> with <a href="https://www.instagram.com/abbysummitttran/" className="text-[#4a7729] underline">Abby</a>
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Spreadsheet Strain</h3>
            <p className="mb-3">Symptoms: Excel-induced eye twitching, formula nightmares, pivot table PTSD</p>
            <p className="font-semibold text-[#4a7729]">
              Prescription: <a href="https://www.mtbproject.com/trail/3387063/oleary-trail-loop" className="text-[#4a7729] underline">O&apos;Leary Trail Loop</a> with <a href="https://www.instagram.com/brave.endeavors/" className="text-[#4a7729] underline">Bekah</a>
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">RTO Burnout</h3>
            <p className="mb-3">Symptoms: Calendar anxiety, buzzword overdose, overwhelming desire for sweatpants</p>
            <p className="font-semibold text-[#4a7729]">
              Prescription: <a href="https://www.bendparksandrec.org/facility/bend-whitewater-park/" className="text-[#4a7729] underline">Whitewater</a> with <a href="https://www.instagram.com/saveriat" className="text-[#4a7729] underline">Saveria</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
