'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does Sick Day Sports Club work?",
    answer: "We connect you with local guides for short adventure experiences. Simply browse available activities, choose your preferred date and guide, and book your adventure. Our platform handles all the logistics so you can focus on having fun."
  },
  {
    question: "What activities are available?",
    answer: "We offer a variety of outdoor activities including rock climbing, mountain biking, skiing, snowboarding, surfing, and hiking. The specific activities available depend on your location and the season."
  },
  {
    question: "Do I need my own equipment?",
    answer: "Most guides can provide necessary equipment, but this varies by activity and guide. Equipment requirements and availability will be clearly listed on each adventure's booking page."
  },
  {
    question: "What skill level do I need to be?",
    answer: "We offer adventures for all skill levels, from complete beginners to advanced athletes. Each activity listing clearly indicates the required skill level so you can choose an appropriate adventure."
  },
  {
    question: "How long are the adventures?",
    answer: "Most adventures are designed to fit into a single day, typically ranging from 2-6 hours. This makes them perfect for fitting into a workday or a long lunch break."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellation policies vary by guide and activity. Generally, full refunds are available if cancelled 24 hours before the scheduled adventure. Weather-related cancellations are handled on a case-by-case basis."
  },
  {
    question: "Are the guides certified?",
    answer: "Yes, all guides on our platform are certified professionals in their respective activities. We verify their certifications, insurance, and experience before they can offer adventures."
  }
];

export default function FAQ() {
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