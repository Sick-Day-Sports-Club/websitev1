'use client';

import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {}

const faqs: FAQItem[] = [
  {
    question: "How does Sick Day Sports Club work?",
    answer: "We connect you with local guides for short adventure experiences based on your detailed member profile. Each weekend, we'll offer a personalized menu of adventure options for the week ahead matched to your preferences, skill level, availability, and upcoming conditions. Simply select the adventures that appeal to you, and we handle all the logistics. Whether you prefer solo adventures, guided experiences, or self-guided group activities, we'll match you with the right opportunities to make the most of your time outdoors."
  },
  {
    question: "What activities are available?",
    answer: "For our Bend beta program, available activities include biking (mountain, road, gravel, enduro), climbing (sport, trad, bouldering, ice, mixed, indoor, mountaineering), hiking (day hiking, backpacking, peak bagging), paddling (kayaking, SUP, canoeing, rafting), running (trail, road, ultra), skiing (alpine, backcountry, cross country), and snowboarding (resort, backcountry). Additional activities like fishing, skating, surfing, and wind sports are coming soon. During signup, you'll select your specific activity interests and experience levels."
  },
  {
    question: "How much does it cost?",
    answer: "We offer several membership tiers during our beta period: Basic ($9/month) which includes 3 personalized solo adventures weekly, Better ($19/month) which includes 5 solo adventures and 3 guided or self-guided group adventures weekly, and Bomber ($99/month) which includes 7 solo adventures, 5 group adventures, and weekly gear shuttle service. Your membership includes access to our booking platform, certified local guides, and exclusive adventure locations. Beta members lock in these founding member rates that will be honored after our official launch."
  },
  {
    question: "What's included in the membership?",
    answer: "Your membership includes access to our booking platform, certified local guides, exclusive adventure locations, and community events. While the membership covers the connection to guides and logistics, any equipment rental or specialized gear may incur additional costs depending on the activity and guide."
  },
  {
    question: "Do I need my own equipment?",
    answer: "During the beta application process, you'll indicate your equipment status for each activity (whether you own all equipment, have some equipment, or need to rent everything). Most guides can provide necessary equipment, but this varies by activity. Equipment requirements and availability will be clearly listed on each adventure's booking page. Our Bomber tier membership includes a weekly gear shuttle service to help with logistics. For other tiers, equipment rental may incur additional costs depending on the activity and guide."
  },
  {
    question: "What skill level do I need to be?",
    answer: "We offer adventures for all skill levels, from complete beginners to advanced athletes. During signup, you'll specify your experience level for each activity you're interested in, from 'Beginner - I'm just starting out' to 'Expert - I could probably guide others.' This helps us match you with appropriate adventures and guides. Each activity recommendation will clearly indicate the required skill level to ensure you have a safe and enjoyable experience tailored to your abilities."
  },
  {
    question: "How long are the adventures?",
    answer: "Most adventures are designed to fit into part of a day, typically ranging from 2-4 hours, making them perfect for taking a 'sick day' or extending your lunch break. During signup, you'll specify your availability preferences (weekday mornings, afternoons, full days, or weekends) and preferred times (morning 6am-12pm, afternoon 12pm-5pm, or evening 5pm-10pm). This helps us recommend adventures that fit your schedule while maximizing your outdoor experience."
  },
  {
    question: "What is your cancellation policy?",
    answer: "During our beta period, you can cancel a scheduled adventure up to 48 hours in advance without any penalty. For cancellations less than 48 hours, we ask that you notify both us and the guide directly. Your membership fee covers access to the platform, but since no additional payment is made until you meet with the guide, there are no refunds to process. Weather-related cancellations will result in rescheduled adventures based on availability."
  },
  {
    question: "Are the guides certified?",
    answer: "Yes, all guides on our platform are certified professionals in their respective activities. We verify their certifications, insurance, and experience before they can offer adventures. These are local experts who know just the right secret spots to treat any sick day symptoms."
  },
  {
    question: "How do I sign up for the beta program in Bend?",
    answer: "You can join our exclusive beta program in Bend, OR by completing the membership form on our website. The form includes details about your adventure preferences, experience levels, equipment needs, and scheduling availability. You'll select your preferred membership tier (Basic, Better, or Bomber) or join our waitlist if you're not ready to commit yet. Your preferences help us match you with the perfect experiences when we launch on March 27th, 2025."
  }
];

const FAQ: React.FC<FAQProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="py-16 bg-gray-50" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 flex-shrink-0 ml-4"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    id={`faq-answer-${index}`}
                  >
                    <div className="px-6 py-4 border-t text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ; 