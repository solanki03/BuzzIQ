import React, { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import Navbar from '@/components/Navbar';
import GradientBtn from '@/components/GradientBtn';
import { PieChartComponent } from '@/components/PieChart';
import { Download, House } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const ref = useRef(null); // Reference for capturing the image

  const resultInfo = [
    { label: 'Topic', value: 'Computer Fundamentals' },
    { label: 'Total Questions', value: 15 },
    { label: 'Attempted Questions', value: 15 },
    { label: 'Correct Answers', value: 12 },
    { label: 'Wrong Answers', value: 3 },
    { label: 'Accuracy', value: '80%' },
    { label: 'Time Taken', value: '10 min 10 sec' },
  ];

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

  // Capture full-screen image
  const onButtonClick = useCallback(() => {
    if (ref.current === null) return;

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'quiz-results.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to capture image:', err);
      });
  }, [ref]);


  return (
    <div className="w-full text-white mb-10">
      <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />

      {/* Result Section (Captured for Image) */}
      <div ref={ref} className='flex flex-col gap-7 items-center justify-center px-5 bg-black'>
        <h1 className='font-semibold text-2xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700'>
          <span className='text-slate-300'>Review Your Results & Learn More</span>
        </h1>

        <div className="flex flex-col w-full max-w-5xl rounded-xl bg-slate-900/50 ring-1 ring-fuchsia-300 px-4 py-6 sm:px-8">
        
          {/* Home and Download Result button */}
        <div className='flex justify-between items-center'>
          <button
            className="text-fuchsia-400 hover:text-fuchsia-300 transition-all duration-200 ease-in-out w-11 h-11 rounded-full bg-slate-800/50 flex items-center justify-center shadow-md ring-1 ring-fuchsia-300 hover:ring-fuchsia-400 active:ring-fuchsia-500"
            onClick={() => navigate('/')}
          >
            <House />
          </button>
          <button
            className="text-fuchsia-400 hover:text-fuchsia-300 transition-all duration-200 ease-in-out w-11 h-11 rounded-full bg-slate-800/50 flex items-center justify-center shadow-md ring-1 ring-fuchsia-300 hover:ring-fuchsia-400 active:ring-fuchsia-500"
            onClick={onButtonClick}
          >
            <Download />
          </button>
        </div>

          <div className='flex flex-col md:flex-row justify-between gap-6 w-full'>

            {/* Result Details */}
            <div className="flex flex-col gap-4 max-md:min-w-[300px] md:w-1/2">
              <h2 className="text-2xl font-semibold text-center">Quiz Results</h2>
              <div className="space-y-2 bg-slate-700/30 px-5 md:px-7 py-3 rounded-lg">
                {resultInfo.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm sm:text-lg pb-1.5">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-gray-100 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="flex flex-col md:w-1/2">
              <h2 className='text-2xl font-semibold text-center'>Performance Overview</h2>
              <PieChartComponent />
            </div>
          </div>

          {/* Back to Dashboard, Retake Quiz */}
          <div className='flex flex-row items-center justify-between'>
            <GradientBtn name="Dashboard" onClick={() => navigate('/quiz-dashboard')} />
            <GradientBtn name="Retake Quiz" onClick={() => navigate('/quiz-page')} />
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="w-full flex justify-center text-center">
          <div className="">
            <p className="text-sm text-gray-400">
              <span className="font-Warnes! font-medium!">BuzzIQ{" "}</span>
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results