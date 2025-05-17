import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PartyPopper } from 'lucide-react';

const Celebratebtn = () => {
  const canvasRef = useRef(null);
  const confettiInstance = useRef(null);

  useEffect(() => {
    // Create the confetti instance with useWorker
    confettiInstance.current = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });
  }, []);

  const handleClick = () => {
    confettiInstance.current({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  return (
    <>
      {/* Full screen canvas for confetti */}
      <canvas
        ref={canvasRef}
        className="fixed top-5 w-full h-full pointer-events-none z-50"
      />
      <button
        onClick={handleClick}
        className="flex items-center bg-[#1f1f1f] border border-slate-700 px-4 py-2 rounded-full text-white shadow-lg hover:border-slate-500 transition-all duration-300 absolute top-25 md:top-20 z-30 space-x-3 cursor-pointer"
      >
        <span className="font-semibold text-xs">We just launched!</span>
        <div className="h-5 w-px bg-gray-600 mx-3" />
        <div className="bg-[#111] p-2 rounded-full hover:bg-[#222] transition-colors flex items-center justify-center">
          <PartyPopper className="h-3 w-3 text-white" />
        </div>
      </button>
    </>
  );
};

export default Celebratebtn;
