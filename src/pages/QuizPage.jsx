import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import GradientBtn from '@/components/GradientBtn';
import stopwatch from '@/assets/stopwatch.png';
import notificationTone from '@/assets/audio/notification_tone.mp3';

const QuizPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [timeUp, setTimeUp] = useState(false); // Track if time is up

  useEffect(() => {
    const audio = new Audio(notificationTone); // Create an audio instance
    audio.muted = false; // Ensure audio is not muted

    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);

        // Show toast when 1 min is left
        if (minutes === 1) {
          toast("Last 1 min left!", { icon: "⚠️" });

          // Play notification tone
          audio.play().catch((error) => console.error("Error playing sound:", error));
        }
      } else {
        clearInterval(timer);
        setTimeUp(true); // Set time up to true
        toast("Time's up! Submitting quiz...", { icon: "⏳" });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);


  useEffect(() => {
    // Prevent navigating back
    const handleBack = (event) => {
      event.preventDefault();
      toast.error("You cannot go back during the quiz!", { icon: "🚫" });
    };
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);


  useEffect(() => {
    // Detect window resize
    const handleResize = () => {
      toast.error("Window resizing is not allowed!", { icon: "🚫" });
    };

    // Detect tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Tab switch detected! Submitting quiz...", { icon: "🚫" });
        setTimeUp(true);
      }
    };

    // Detect DevTools open
    const detectDevTools = (event) => {
      if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
        event.preventDefault();
        toast.error("Inspecting the page is not allowed!");
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", detectDevTools);
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", detectDevTools);
      document.removeEventListener("contextmenu", (event) => event.preventDefault());
    };
  }, []);


  // Prevent refreshing the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "You cannot refresh during the quiz!";
      toast.error("Page refresh is disabled during the quiz!", { icon: "🚫" });
    };

    const handleKeyDown = (event) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        toast.error("Refreshing is not allowed!", { icon: "🚫" });
      }
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  return (
    <div className="w-full text-white">
      <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />
      <Toaster position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            border: "1px solid #f0abfc",
            background: "#111827",
            color: "#fff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "8px 16px",
          },
        }}
      />

      <div className='flex flex-col gap-9 items-center justify-center'>
        <h1 className='font-semibold text-2xl sm:text-4xl text-center text-slate-300 block border-b-2 px-10 pb-4 border-slate-700'>
          <span>Computer Fundamentals</span>
        </h1>

        {/* Quiz Card */}
        <div className='relative bg-slate-900/50 grid w-full max-w-3/4 lg:max-w-3/5 gap-4 rounded-xl ring-1 ring-fuchsia-300 py-9 px-8 p-6 shadow-lg duration-200'>

          {!timeUp ? (
            <>
              {/* Timer */}
              <div className='absolute right-8 top-5 flex items-center justify-end gap-2 text-sm text-pink-200'>
                <img src={stopwatch} alt="Stopwatch image" className='h-6' />
                {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
              </div>

              {/* Question and Options*/}
              <div className='flex flex-col gap-8 mt-5'>
                <div className='text-xl font-semibold text-fuchsia-400 px-3'>
                  <p>1. Who is the father of Computers?</p>
                </div>

                {/* Options */}
                <div className='flex flex-col gap-1'>
                  {[
                    { id: "option1", value: "James Gosling" },
                    { id: "option2", value: "Charles Babbage" },
                    { id: "option3", value: "Dennis Ritchie" },
                    { id: "option4", value: "Bjarne Stroustrup" }
                  ].map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center gap-3 text-lg px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${selectedOption === option.value ? "bg-fuchsia-800" : "hover:bg-fuchsia-900"
                        }`}
                      onClick={() => setSelectedOption(option.value)}
                    >
                      <input
                        type="radio"
                        id={option.id}
                        name="option"
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={() => setSelectedOption(option.value)}
                        className="cursor-pointer"
                      />
                      <label htmlFor={option.id} className="cursor-pointer">{option.value}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next and Previous Buttons */}
              <div className='flex items-center justify-between mt-4'>
                <GradientBtn name="Prev" />
                <GradientBtn name="Next" disabled={!selectedOption} />
              </div>
            </>
          ) : (
            // Time's Up card (only shows when `timeUp` is true)
            <div className='flex flex-col items-center gap-16 my-8'>
              <h2>
                <p className='text-3xl text-center text-fuchsia-400 font-semibold mb-2.5'>Time's Up!</p>
                <p className='text-2xl text-center text-fuchsia-200 font-medium'>You've completed the quiz. Let's see your results!</p>
              </h2>
              <Link to="/quiz-results">
                <GradientBtn name="View Results" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
