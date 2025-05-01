import React from "react";
import Navbar from "@/components/Navbar";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { quizList } from "@/utils/info";

const QuizDashboard = () => {

  return (
    <div className="w-full text-white">
      <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />

      <div className="flex flex-col gap-5 items-center justify-center px-5">
        <h1 className="font-semibold text-xl md:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700">
          <span className="text-slate-300">
            Unleash Your Potential & Take the Challenge!
          </span>
        </h1>
        <div className="max-w-6xl mx-auto md:px-8">
          <HoverEffect items={quizList} />
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="w-full flex justify-center text-center mb-5">
        <p className="text-xs md:text-sm text-gray-400">
          <span className="font-Warnes! font-medium!">BuzzIQ </span>
          &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default QuizDashboard;
