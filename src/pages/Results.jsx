import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import GradientBtn from '@/components/GradientBtn';

const Results = () => {
  const navigate = useNavigate();

  // Prevent going back to QuizPage
  useEffect(() => {
    const handleBackNavigation = () => {
      navigate('/quiz-dashboard', { replace: true });
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [navigate]);

  // Function to go back to the Quiz Dashboard
  const handleBackToDashboard = () => {
    navigate('/quiz-dashboard');
  };

  return (
    <div className="w-full text-white">
      <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />

      <div className='flex flex-col gap-9 items-center justify-center'>
        <h1 className='font-semibold text-3xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700'>
          <span className='text-slate-300'>Review Your Results & Learn More</span>
        </h1>

        <div className='relative bg-slate-900/50 grid w-full max-w-3/4 lg:max-w-3/5 gap-4 rounded-xl ring-1 ring-fuchsia-300 py-9 px-8 p-6 shadow-lg duration-200'>
          content
        </div>
      </div>
    </div>
  )
}

export default Results