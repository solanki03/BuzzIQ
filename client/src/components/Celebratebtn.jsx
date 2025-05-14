import React from 'react';
import confetti from 'canvas-confetti';
import { PartyPopper } from 'lucide-react'; // optional icon

const Celebratebtn = () => {
  const handleClick = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  return (
    <button
    onClick={handleClick}
    className="flex items-center bg-[#1f1f1f] border border-gray-700 px-4 py-2 rounded-full text-white shadow-lg hover:border-white transition-all duration-300"
  >
    <span className="font-semibold text-sm">We just launched!</span>
    <div className="h-5 w-px bg-gray-600 mx-3" />
    <div className="bg-[#111] p-2 rounded-full hover:bg-[#222] transition-colors">
      <PartyPopper className="h-3 w-3 text-white" />
    </div>
  </button>
  );
};

export default Celebratebtn;
