import React from "react";

export default function Footer() {
  const quotes = [
    "Success starts with self-discipline.",
    "Push harder than yesterday if you want a different tomorrow.",
    "Dream it. Believe it. Achieve it.",
    "Strength does not come from winning.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Do something today that your future self will thank you for.",
    "Sweat is your fat crying.",
    "It never gets easier, you just get stronger.",
    "Don’t limit your challenges. Challenge your limits.",
    "Big journeys begin with small steps.",
    "Consistency is more important than perfection.",
    "A little progress each day adds up to big results.",
    "Be stronger than your excuses.",
    "Success is the sum of small efforts repeated daily.",
    "Don’t stop until you’re proud.",
    "Your only limit is you.",
    "Strong mind, strong body.",
    "Train insane or remain the same.",
    "Every accomplishment starts with the decision to try.",
    "Hustle for that muscle.",
    "Pain is temporary, pride is forever.",
    "Wake up. Work out. Look hot. Kick ass.",
    "You didn’t come this far to only come this far.",
    "Winners train, losers complain.",
    "Fall down seven times, stand up eight.",
    "Sweat. Smile. Repeat.",
    "Great things never come from comfort zones.",
    "No pain, no gain.",
    "When you feel like quitting, think about why you started.",
    "The only bad workout is the one you didn’t do.",
    "Focus on progress, not perfection.",
    "Small steps every day.",
    "Grind now, glory later.",
    "Success is a journey, not a destination.",
    "Stop doubting yourself. Work hard and make it happen.",
    "Your future is created by what you do today.",
    "Pain is weakness leaving the body.",
    "Work hard in silence; let success make the noise.",
    "Discipline is choosing what you want most.",
    "Commit to be fit."
  ];

  const marqueeText = quotes
    .map((q) => `${q} • Contact Developer: +91 7007445861`)
    .join("   ✦   ");

  return (
    <footer className="w-full bg-white border-t shadow-inner py-4 overflow-hidden relative h-[48px] flex items-center">

      {/* Subtle background soft-light effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-[#f9f9f9] to-white opacity-90"></div>

      {/* Layer 1 */}
      <div
        className="absolute whitespace-nowrap text-gray-800 text-sm font-medium
        animate-superSmoothSlow bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600"
      >
        {marqueeText}
      </div>

      {/* Layer 2 */}
      <div
        className="absolute whitespace-nowrap text-gray-800 text-sm font-medium
        animate-superSmoothSlow2 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600"
      >
        {marqueeText}
      </div>

      <style>
        {`
          /* Ultra slow scrolling — 180 seconds */
          .animate-superSmoothSlow {
            animation: superSmoothSlow 180s linear infinite;
          }

          .animate-superSmoothSlow2 {
            animation: superSmoothSlow2 180s linear infinite;
          }

          @keyframes superSmoothSlow {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }

          @keyframes superSmoothSlow2 {
            0% { transform: translateX(100%); }
            100% { transform: translateX(0%); }
          }
        `}
      </style>
    </footer>
  );
}
