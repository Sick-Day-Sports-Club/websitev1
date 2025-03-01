export default function Testimonials() {
  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">What Our Beta Users Say</h2>
          <p className="text-xl text-gray-600">Early feedback from our test community</p>
        </div>
        
        <div className="max-w-3xl mx-auto mb-10 p-4 bg-amber-100 rounded-lg">
          <p className="font-bold text-center mb-2">⚠️ WARNING: SIDE EFFECTS ⚠️</p>
          <p className="text-center">May cause extreme happiness, career perspective, and addiction to the outdoors. Users report Instagram-worthy photos and difficulty returning to office life.</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-lg italic mb-4">&ldquo;DUDE! I&apos;m so down... From pushing comfort zones trying an activity or something new, to giving back to community, being creative, supporting a world we want to live in!&rdquo;</p>
            <div className="font-semibold">— Kate N., Portland</div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-lg italic mb-4">&ldquo;Great day out there with great company! North facing aspects still had the goods and views were spectacular. Shout out to mom for fueling us with homemade peanut butter balls... looking forward to the next one.&rdquo;</p>
            <div className="font-semibold">— Alex W., Bellingham</div>
          </div>
        </div>
      </div>
    </section>
  );
}
