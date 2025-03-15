import React from "react";
import { Link } from "react-router-dom";

const StartSessionButton = ({name}) => {

  return (
    <Link to="/quiz-dashboard">
      <button className="group relative px-10 py-5 rounded-xl bg-zinc-900 text-white font-bold tracking-widest uppercase text-sm border-b-4 border-purple-400/50 hover:border-purple-400 transition-all duration-300 ease-in-out hover:text-purple-200 shadow-[0_5px_40px_rgba(251,191,36,0.15)] hover:shadow-[0_15px_30px_rgba(251,191,36,0.25)] active:border-b-0 active:translate-y-1">
        <span className="flex items-center gap-3 relative z-10">
          {name}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1">
            <path d="M12 4L10.6 5.4L16.2 11H4V13H16.2L10.6 18.6L12 20L20 12L12 4Z" />
          </svg>
        </span>
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 blur-2xl group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 group-hover:opacity-100" />
      </button>
    </Link>
  );
};

export default StartSessionButton;
